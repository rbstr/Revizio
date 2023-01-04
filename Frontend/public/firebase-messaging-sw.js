importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const isSupp = firebase.messaging.isSupported();
if (isSupp) {
  const app = firebase.initializeApp({
    apiKey: "AIzaSyAjxegS4dGWwsCYYUdbbdoEF3aaLUCWn3o",
    authDomain: "revizio-9d3ba.firebaseapp.com",
    projectId: "revizio-9d3ba",
    storageBucket: "revizio-9d3ba.appspot.com",
    messagingSenderId: "1029774409605",
    appId: "1:1029774409605:web:d7566b0651f9f2c3be8eec",
    measurementId: "G-PS241K2F5K"
  });
  const messaging = app.messaging();
  messaging.onBackgroundMessage((payload) => {
    try {
      const { title, ...notificationOptions } =
        payload.notification || payload.data;
      return self.registration.showNotification(title, notificationOptions);
    } catch (e) {
      console.error(e);
    }
  });
  self.addEventListener("notificationclick", async function (event) {
    event.notification.close();
  });
}
