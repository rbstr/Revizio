const request = require("request-promise-native");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const {CloudTasksClient} = require("@google-cloud/tasks");
const cors = require("cors")({origin: true});
sgMail.setApiKey(
    "",
);

admin.initializeApp(functions.config().firebase);

async function downloadPDF(pdfURL) {
  const pdfBuffer = await request.get({uri: pdfURL, encoding: null});
  return pdfBuffer;
}

exports.sendEmail = functions.https.onRequest((request, response) => {
  response.header("Access-Control-Allow-Headers", "*");
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  try {
    cors(request, response, async () => {
      try {
        const {email, subject, text, fileUrl} = request.body;
        const file = await downloadPDF(fileUrl);
        const buffer = Buffer.from(file).toString("base64");
        /**
         * @type {import("@sendgrid/mail").MailDataRequired}
         */
        const msg = {
          to: email,
          from: {
            email: 'filiprubes18@gmail.com',
            name: 'Revizio'
        },
          subject,
          html: text,
          attachments: [
            {
              content: buffer,
              filename: "revize.pdf",
              type: "application/pdf",
              disposition: "attachment",
              contentId: "revision",
            },
          ],
        };
        await sgMail.send(msg);
        return response.status(200).send({
          message: "Email sent successfully",
        });
      } catch (error) {
        console.log(error);
        return response.status(500).send(error);
      }
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

exports.createNotification = functions.firestore
    .document("revisions/{revisionId}")
    .onWrite(async (doc) => {
      const revision = doc.after.data();
      if (!doc.after.exists) return;
      if (revision?.additionalInformation?.nextRevisionDate) return;
      // Get 7 days before next revision date
      const nextRevisionDate = new Date(
          revision.additionalInformation.nextRevisionDate,
      ).getTime();
      const sevenDaysBefore = nextRevisionDate - 7 * 24 * 60 * 60 * 1000;
      const isDatePassed = sevenDaysBefore < new Date().getTime();
      if (isDatePassed) {
        const client = await admin.firestore()
            .collection("client")
            .doc(revision.clientId)
            .get();
        const isNextRevision = nextRevisionDate < new Date().getTime();
        const name = `${client?.data().firstName} ${client?.data().lastName}`;
        const notification = {
          title: `${name} bude potřebovat revizi`,
          description: `Platnost revize klienta ${name} vyprší za několik dní!
          Nechceš mu zavolat?`,
          time: admin.firestore.FieldValue.serverTimestamp(),
          revisionId: doc.after.id,
          isRead: false,
          userId: revision.userId,
        };
        if (isNextRevision) {
          notification.title = `${name} potřebuje revizi`;
          notification.description = `Platnost revize klienta ${name} vypršela!.
          Nechceš mu zavolat?`;
        }
        return await generateNotification({
          notification,
          id: doc.after.id,
          type: "revision",
        })
      }
      const project = "revizio-9d3ba";
      const location = "us-central1";
      const queue = "firestore-ttl";
      const tasksClient = new CloudTasksClient();
      const queuePath = tasksClient.queuePath(project, location, queue);

      const url = `https://${location}-${project}.cloudfunctions.net/notify`;
      const docPath = doc.after.ref.path;
      const payload = {docPath, type: "revision"};
      const task = {
        httpRequest: {
          httpMethod: "POST",
          url,
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
          headers: {
            "Content-Type": "application/json",
          },
        },
        scheduleTime: {
          seconds: sevenDaysBefore/1000,
        },
      };
      await tasksClient.createTask({parent: queuePath, task});
    });

exports.notify = functions.https.onRequest(async (request, response) => {
  try {
    const payload = request.body;
    const doc = admin.firestore().doc(payload.docPath);
    const snapshot = await doc.get();
    // Create notification
    const data = snapshot.data();
    let name = "";
    if (payload.type === "revision") {
      const client = (
        await admin.firestore().collection("client").doc(data.clientId).get()
      )?.data?.();
      name = `${client?.firstName} ${client?.lastName}`;
    } else if (payload.type === "meeting") {
      name = data.name;
    }
    const notification =
      payload.type === "revision" ?
        {
          name: "Oznámení o revizi",
          title: `${name} potřebuje revizi!`,
          description: `Revize klienta ${name} vyprší za několik dní!
          Nechceš mu zavolat?`,
          time: admin.firestore.FieldValue.serverTimestamp(),
          revisionId: snapshot.id,
          userId: data.userId,
        } :
        payload.type === "meeting" ?
        {
          name: "Oznámení o schůzce",
          title: `Dnešní schůzka s ${data.name}`,
          description: `Dnes máš domluvenou schůzku s ${data.name}!
          Tak na ni nezapomeň.`,
          time: admin.firestore.FieldValue.serverTimestamp(),
          meetingId: snapshot.id,
          userId: data.userId,
        } : null;
    await generateNotification({
      notification,
      id: snapshot.id,
      type: payload.type,
    })
    return response.status(200).send({
      message: "Notification created successfully",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

const generateNotification = async ({
  notification,
  id,
  type
})=> {
  const notificationSetting = await admin.firestore()
    .collection("settings")
    .doc(notification.userId)
    .get();
  if (notificationSetting.exists) {
    const tokens = Object.entries(notificationSetting?.data?.())
        ?.filter(([, value]) => value)
        ?.map(([key]) => key);
    await admin.messaging().sendMulticast({
      tokens: tokens || [],
      notification: {
        title: notification.title,
        body: notification.description,
      },
    });
  }
  await admin.firestore()
    .collection("notifications")
    .doc(`${id}:${type}`)
    .set(notification);
}

exports.createMeetingNotification = functions.firestore
    .document("meetings/{meetingId}")
    .onWrite(async (doc) => {
      const meeting = doc.after.data();
      if (!doc.after.exists) return;
      const project = "revizio-9d3ba";
      const location = "us-central1";
      const queue = "firestore-ttl";
      const tasksClient = new CloudTasksClient();
      const queuePath = tasksClient.queuePath(project, location, queue);

      const url = `https://${location}-${project}.cloudfunctions.net/notify`;
      const docPath = doc.after.ref.path;
      const payload = {docPath, type: "meeting"};
      const task = {
        httpRequest: {
          httpMethod: "POST",
          url,
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
          headers: {
            "Content-Type": "application/json",
          },
        },
        scheduleTime: {
          seconds: new Date(meeting.meetingDate).getTime()/1000,
        },
      };
      await tasksClient.createTask({parent: queuePath, task});
    });
