import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import { AllPages } from "components/PdfFile";
import { DownloadIcon, PatternIcon } from "utils/icons";
import { PatternModal } from "components/PatternModal";
import { useModalContext } from "context/ModalContext";
import { useDispatch, useSelector } from "react-redux";
import { createRevisionAsyncThunk } from "redux/slices/revisionSlice";
import { PDFDocument, rgb } from "pdf-lib";
import Initial_template from "assets/pdf/Templates/Initial_template.pdf";
import Service_template from "assets/pdf/Templates/Service_template.pdf";
import Initial_obj_template from "assets/pdf/Templates/Initial_obj_template.pdf";
import Service_obj_template from "assets/pdf/Templates/Service_obj_template.pdf";
import Pressure_template from "assets/pdf/Templates/Pressure_template.pdf";

import PoppinsBold from "assets/fonts/poppins/Poppins-Bold.ttf";
import PoppinsMedium from "assets/fonts/poppins/Poppins-Medium.ttf";
import PoppinsSemiBold from "assets/fonts/poppins/Poppins-SemiBold.ttf";
import PoppinsRegular from "assets/fonts/poppins/Poppins-Regular.ttf"

import moment from "moment";
import { revisionTypes } from "utils/common";
import CustomButton from "components/CustomComponents/CustomButton";
import fontkit from "@pdf-lib/fontkit";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { BlurryDialogModal } from "utils/BlurryDialogModal";

function BootstrapDialogTitle({ open }) {
  return (
    <BlurryDialogModal fullWidth maxWidth={"xs"} open={open}>
      <DialogTitle variant="h3">Uložení revize</DialogTitle>
      <DialogContent>
        <Divider sx={{ marginBottom: 2 }} />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "20vh" }}
        >
          <Grid item xs={3}>
            <CircularProgress md={12} disableShrink />
          </Grid>
          <Grid item xs={3}>
            <DialogTitle variant="h6">
              Ukládám revizi..
            </DialogTitle>
          </Grid>
        </Grid>
      </DialogContent>
    </BlurryDialogModal>
  );
}
export const PdfFile = ({ handleNext, type }) => {

  const mobileScreen = useMediaQuery("(max-width:600px)");
  const { handleToggleModal } = useModalContext();
  const {
    defects: { data: defectsArray }
  } = useSelector((state) => state.defect);
  const open = useSelector(
    (state) => state.revision?.loadings?.createRevisionAsyncThunk
  );


  const [PDFString, setPDFString] = useState(null);
  const [PDFPressureTemplateString, setPDFPressureTemplateString] = useState(null);
  const dispatch = useDispatch();
  const saveRevision = async () => {
    if (PDFString == null)
      return toast.error("PDF se ještě nevygenerovalo, prosím počkej.");
    dispatch(
      createRevisionAsyncThunk({ type, handleNext, pdfString: PDFString, PDFPressureTemplateString })
    );
  };

  const returnDefectDescription = (e) =>
    e
      ? Array.isArray(e)
        ? e?.map(
          (f) =>
            defectsArray?.find((g) => g?.abbreviatedName == f)
              ?.defectDescription ?? f
        )
        : defectsArray?.find((g) => g?.abbreviatedName == e)
          ?.defectDescription ?? e
      : "Bez zjevných závad";

  function defectsText (text) {
    var regex = new RegExp(',', 'g');
    text = text.toString().replace(regex, ' ');
    return text
  }
  //
  const {
    revisionForm: { [type]: pdfRevisionData },
  } = useSelector((state) => state.revision);
  const { profile: technician } = useSelector((state) => state.auth);
  const checkString = (e) =>
    e ? (typeof e === "string" ? e : e.toString()) : e == false ? "" : "";
  //console.log("pdfRevisionData", pdfRevisionData);
  // ............................................................load record pdf
  async function loadPdfpressure_template(_pdfString) {
    const {
      techInformation,
      basicInformation: client,
      foundDefects,
      additionalInformation,
      timestamp,
      clientId,
      userId,
      signImg,
      performedTests,
    } = pdfRevisionData;
    const {
      connectionMethod,
      deviceName,
      devicePosition,
      evidenceNumber,
      performanceCheck,
      threadType,
      totalMaxConsumptionOfNaturalGas,
    } = techInformation;
    const { deviceDefects, majorDefects, minorDefects } = foundDefects;
    const { deviceSafe, nextRevisionDate, otherInformation, previousRevision } =
      additionalInformation;
    const {
      // evidenceNumber,
      assemblyBy,
      technicalValueOfDevice,
      strengthTestedPressure,
      strengthDuration,
      leakTestedPressure,
      leakDuration,
      strengthResult,
      leakTestResult,
      overallRating,
    } = performedTests;
    const response = await fetch(Pressure_template);
    const buffer = await response.arrayBuffer();
    const existingPdfDocBytes = new Uint8Array(buffer);
    //

    const pdfDoc = await PDFDocument.load(existingPdfDocBytes);

    const FontBold = await fetch(PoppinsBold).then((res) => res.arrayBuffer());
    const FontMedium = await fetch(PoppinsMedium).then((res) => res.arrayBuffer());
    const FontSemiBold = await fetch(PoppinsSemiBold).then((res) => res.arrayBuffer());

    pdfDoc.registerFontkit(fontkit);

    const poppins = await pdfDoc.embedFont(FontMedium);
    const poppinsSemiBold = await pdfDoc.embedFont(FontSemiBold);
    const poppinsBold = await pdfDoc.embedFont(FontBold);

  
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();
    // EVIDANCE NUMBER
    firstPage.drawText(checkString(evidenceNumber), {
      x: width - 207,
      y: height - 85,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    firstPage.drawText(moment().format("DD. MM. YYYY"), {
      x: width - 207,
      y: height - 120,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // CLIENT NAME
    firstPage.drawText(
      `${checkString(client?.firstName)} ${checkString(client?.lastName)}`,
      {
        x: 55,
        y: height - 191,
        size: 11,
        color: rgb(0, 0, 0),
        font: poppinsBold,
      }
    );
    // ADDRESS
    firstPage.drawText(
      checkString(`${client?.street}\n${client?.zipCode}, ${client?.city}`),
      {
        x: 55,
        y: height - 210,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        lineHeight: 15,
      }
    );
    firstPage.drawText(
      checkString(assemblyBy),
      {
        x: 55,
        y: height - 360,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
      }
    );
    firstPage.drawText(checkString(technicalValueOfDevice), {
      x: 55,
      y: height - 410,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
    });
    firstPage.drawText(checkString(strengthTestedPressure) + " kPa", {
      x: 210,
      y: height - 523,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(checkString(strengthDuration) + " min", {
      x: 340,
      y: height - 523,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    firstPage.drawRectangle({
      x: 55,
      y: height - 590,
      height: 20,
      font: poppins,
      color: rgb(1, 1, 1),
    });
    firstPage.drawText(`${technician?.pressureGaugeName} - v. č. ${technician?.pressureGaugeSerialNumber}`, {
      x: 55,
      y: height - 582,
      size: 11,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
      font: poppinsBold,
    });

    firstPage.drawText(checkString(leakTestedPressure) + " kPa", {
      x: 210,
      y: height - 541,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(checkString(leakDuration) + " min", {
      x: 340,
      y: height - 541,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(leakTestResult ? "Vyhovující" : "Nevyhovující", {
      x: 439,
      y: height - 541,
      size: 12,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(strengthResult ? "Vyhovující" : "Nevyhovující", {
      x: 439,
      y: height - 523,
      size: 12,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(overallRating ? "Vyhovující" : "Nevyhovující", {
      x: 55,
      y: height - 625,
      size: 12,
      font: poppinsBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      checkString(technician?.title + " ") +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 208,
        y: height - 190,
        size: 13,
        font: poppinsSemiBold,
        color: rgb(0, 0, 0),
      }
    );
    firstPage.drawText(checkString(technician?.certificate), {
      x: width - 207,
      y: height - 223,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(checkString(technician?.authorization), {
      x: width - 207,
      y: height - 260,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(checkString(technician?.executingPlace) + ", dne " + moment().format("DD. MM. YYYY"), {
      x: 55,
      y: height - 760,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const pressureTemplateString = await pdfDoc.saveAsBase64({ dataUri: true });
    setPDFPressureTemplateString(pressureTemplateString)
    const pdf1 = await PDFDocument.load(_pdfString);
    const copiedPagesB = await pdf1.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPagesB.forEach((page) => pdf1.addPage(page));
    const pdfBytes_1 = await pdf1.save();
    const pdfString = await pdf1.saveAsBase64({ dataUri: true });
    // setPDF_String(el => { return { ...el, pressure_template: pdfString } })
    setPDFString(pdfString);
    return pdfDoc;
  }
  // ............................................................load record pdf

  async function loadPdfInitial() {
    const {
      techInformation,
      basicInformation: client,
      foundDefects,
      additionalInformation,
      timestamp,
      clientId,
      userId,
      signImg,
    } = pdfRevisionData;
    const {
      connectionMethod,
      deviceName,
      devicePosition,
      evidenceNumber,
      performanceCheck,
      threadType,
      totalMaxConsumptionOfNaturalGas,
    } = techInformation;
    const { deviceDefects, majorDefects, minorDefects, removeDefectsBefore } = foundDefects;
    const { deviceSafe, nextRevisionDate, otherInformation, previousRevision } =
      additionalInformation;
    const response = await fetch(Initial_template);
    const buffer = await response.arrayBuffer();
    const existingPdfDocBytes = new Uint8Array(buffer);
    //
   

    const pdfDoc = await PDFDocument.load(existingPdfDocBytes);

    const Font = await fetch(PoppinsRegular).then((res) => res.arrayBuffer());
    const FontBold = await fetch(PoppinsBold).then((res) => res.arrayBuffer());
    const FontMedium = await fetch(PoppinsMedium).then((res) => res.arrayBuffer());
    const FontSemiBold = await fetch(PoppinsSemiBold).then((res) => res.arrayBuffer());

    pdfDoc.registerFontkit(fontkit);
    const poppins = await pdfDoc.embedFont(FontMedium);
    const poppinsSemiBold = await pdfDoc.embedFont(FontSemiBold);
    const poppinsBold = await pdfDoc.embedFont(FontBold);
    const poppinsReg = await pdfDoc.embedFont(Font);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const thirdPage = pages[2];
    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();
    const jpgImageBytes = await fetch(signImg).then((res) => res.arrayBuffer());
    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scale(0.2);
    const jpgImageBytes_stamp = await fetch(technician?.imageUrl).then((res) =>
      res.arrayBuffer()
    );
    var jpgImage_stamp;
    try {
      jpgImage_stamp = await pdfDoc.embedPng(jpgImageBytes_stamp);
    } catch (error) {
      jpgImage_stamp = await pdfDoc.embedJpg(jpgImageBytes_stamp);
    }
    const jpgDims_stamp = jpgImage_stamp.scale(0.25);

    // EVIDENCE NUMBER
    firstPage.drawText(evidenceNumber, {
      x: width - 208,
      y: height - 83,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    firstPage.drawText(moment().format("DD. MM. YYYY"), {
      x: width - 208,
      y: height - 118,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // CLIENT NAME
    firstPage.drawText(
      `${checkString(client?.firstName)} ${checkString(client?.lastName)}`,
      {
        x: 55,
        y: height - 190,
        size: 11,
        color: rgb(0, 0, 0),
        font: poppinsSemiBold,
      }
    );
    // ADDRESS
    firstPage.drawText(
      checkString(`${client?.street}\n${client?.zipCode}, ${client?.city}`),
      {
        x: 55,
        y: height - 207,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        lineHeight: 15,
      }
    );
    firstPage.drawText(checkString(client?.ownerAttended), {
      x: 55,
      y: height - 253,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    //console.clear();
    //console.log(pdfRevisionData);

    firstPage.drawText(
      checkString(technician?.title) +
      " " +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 208,
        y: height - 188,
        size: 11,
        font: poppinsSemiBold,
        color: rgb(0, 0, 0),
      }
    );
    firstPage.drawText(checkString(technician?.certificate), {
      x: width - 208,
      y: height - 222,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(checkString(technician?.authorization), {
      x: width - 208,
      y: height - 256,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      deviceSafe
        ? "Zařízení je schopno bezpečného a spolehlivého provozu."
        : "Zařízení není schopno bezpečného a spolehlivého provozu.",
      {
        x: 55,
        y: height - 530,
        size: 16,
        color: rgb(0, 0, 0),
        font: poppinsBold,
      }
    );

    firstPage.drawText(checkString(technician?.executingPlace) + ", " + moment().format("DD.MM.YYYY"), {
      x: 55,
      y: height - 690,
      size: 10,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });

    // STAMP
    firstPage.drawImage(jpgImage_stamp, {
      x: width - 245,
      y: height - 780,
      width: 100,
      height: (100 * jpgDims_stamp.height) / jpgDims_stamp.width,
    });

    // Sign
    firstPage.drawImage(jpgImage, {
      x: width - 135,
      y: height - 780,
      width: jpgDims.width,
      height: jpgDims.height,
    });
    // ...................page 2

    secondPage.drawText(checkString(connectionMethod), {
      x: 55,
      y: height - 185,
      size: 11,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
      lineHeight: 15,
      font: poppins,
    });
    
    secondPage.drawText(checkString(deviceName), {
      x: 55,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
      maxWidth: 130,
      lineHeight: 12,
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(devicePosition), {
      x: 197,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(threadType), {
      x: 336,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });

    secondPage.drawText(checkString(totalMaxConsumptionOfNaturalGas), {
      x: 458,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
    });

    // Box
    secondPage.drawRectangle({
      x: 55,
      y: height - 450,
      width: 450,
      height: 20,
      font: poppins,
      color: rgb(1, 1, 1),
      // borderColor: rgb(0.75, 0.2, 0.2),
    });
    secondPage.drawText(
      `Tlaková zkouška - viz zápis o tlakové zkoušce č. ${pdfRevisionData.performedTests.evidenceNumber
      } ze dne ${moment().format("DD. MM. YYYY")} - výsledek zkoušky - ${pdfRevisionData.performedTests.overallRating
        ? "vyhovující"
        : "nevyhovující"
      }`,
      {
        x: 55,
        y: height - 475,
        width: 450,
        height: 20,
        color: rgb(0, 0, 0),
        size: 11,
        lineHeight: 15,
        font: poppins,
        maxWidth: width - 110,
      }
    );

    secondPage.drawText(checkString(previousRevision),
      {
        x: 55,
        y: height - 508,
        width: 450,
        height: 20,
        color: rgb(0, 0, 0),
        size: 11,
        lineHeight: 15,
        font: poppins,
        maxWidth: width - 110,
      }
    );


    secondPage.drawText(checkString(defectsText(returnDefectDescription(majorDefects))), {
      x: 55,
      y: height - 626,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });
    secondPage.drawText(checkString(defectsText(returnDefectDescription(minorDefects))), {
      x: 55,
      y: height - 728,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });

    if (removeDefectsBefore){
      secondPage.drawText(checkString("Datum k odstranění závad"), {
        x: 400,
        y: height - 640,
        size: 10,
        font: poppinsReg,
        color: rgb(0.61, 0.61, 0.61),
      });
      secondPage.drawText(moment(checkString(removeDefectsBefore)).format("DD. MM. YYYY"), {
        x: 400,
        y: height - 655,
        size: 10,
        font: poppins,
        color: rgb(0, 0, 0),
      });

    }


    // ...................page 3
    thirdPage.drawRectangle({
      x: 55,
      width: width - 110,
      y: height - 185,
      size: 12,
      height: 20,
      color: rgb(1, 1, 1),
      maxWidth: width - 110,
      font: poppinsBold,
    });
    thirdPage.drawText(
      `Zápis o tlakové zkoušce č. ${pdfRevisionData.performedTests.evidenceNumber
      } ze dne ${moment().format("DD. MM. YYYY")} - provedl RT ${checkString(technician.title)} ${technician.firstName} ${technician.lastName
      }`,
      {
        x: 55,
        y: height - 173,
        size: 11,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        font: poppins,
      }
    );

    // OTHER INFORMATION
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.otherInformation),
      {
        x: 55,
        y: height - 175 - 90,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
      }
    );
    // next rev
    thirdPage.drawText(moment(nextRevisionDate).format("DD. MM. YYYY"), {
      x: 55,
      y: height - 755,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    // technician
    thirdPage.drawText(
      checkString(technician?.title + " ") +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 189,
        y: height - 755,
        size: 11,
        font: poppinsSemiBold,
        color: rgb(0, 0, 0),
      }
    );
    const pdfBytes = await pdfDoc.save();
    const pdfString = await pdfDoc.saveAsBase64({ dataUri: true });
    // setPDF_String(el => { return { ...el, initial_template: pdfString } })
    setPDFString((_) => pdfString);
    if (
      pdfRevisionData?.performedTests &&
      Object.keys(pdfRevisionData.performedTests).length
    ) {
      loadPdfpressure_template(pdfString);
      return;
    }
    return pdfDoc;
  }
  // ............................................................load record pdf

  async function loadPdfService() {
    const {
      techInformation,
      basicInformation: client,
      foundDefects,
      additionalInformation,
      timestamp,
      clientId,
      userId,
      signImg,
    } = pdfRevisionData;
    const {
      connectionMethod,
      deviceName,
      devicePosition,
      evidenceNumber,
      performanceCheck,
      threadType,
      totalMaxConsumptionOfNaturalGas,
    } = techInformation;
    const { deviceDefects, majorDefects, minorDefects, removeDefectsBefore } = foundDefects;
    const { deviceSafe, nextRevisionDate, otherInformation, previousRevision } =
      additionalInformation;
    const response = await fetch(Service_template);
    // const technician = await fetchCollectionData(userId, "profile");
    // const client = await fetchCollectionData(clientId, "client");

    const buffer = await response.arrayBuffer();
    const existingPdfDocBytes = new Uint8Array(buffer);
    //

    const pdfDoc = await PDFDocument.load(existingPdfDocBytes);

    const Font = await fetch(PoppinsRegular).then((res) => res.arrayBuffer());
    const FontBold = await fetch(PoppinsBold).then((res) => res.arrayBuffer());
    const FontMedium = await fetch(PoppinsMedium).then((res) => res.arrayBuffer());
    const FontSemiBold = await fetch(PoppinsSemiBold).then((res) => res.arrayBuffer());

    pdfDoc.registerFontkit(fontkit);
    const poppinsReg = await pdfDoc.embedFont(Font);
    const poppins = await pdfDoc.embedFont(FontMedium);
    const poppinsSemiBold = await pdfDoc.embedFont(FontSemiBold);
    const poppinsBold = await pdfDoc.embedFont(FontBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const thirdPage = pages[2];
    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();
    // const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg';
    // const jpgImageBytes = await fetch(pdfRevisionData.signImg).then((res) => res.arrayBuffer());
    //
    const jpgImageBytes = await fetch(signImg).then((res) => res.arrayBuffer());
    // const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scale(0.2);
    const jpgImageBytes_stamp = await fetch(technician?.imageUrl).then((res) =>
      res.arrayBuffer()
    );
    var jpgImage_stamp;
    try {
      jpgImage_stamp = await pdfDoc.embedPng(jpgImageBytes_stamp);
    } catch (error) {
      jpgImage_stamp = await pdfDoc.embedJpg(jpgImageBytes_stamp);
    }
    const jpgDims_stamp = jpgImage_stamp.scale(0.25);

    // EVIDENCE NUMBER
    firstPage.drawText(evidenceNumber, {
      x: width - 208,
      y: height - 83,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    firstPage.drawText(moment().format("DD. MM. YYYY"), {
      x: width - 208,
      y: height - 118,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // CLIENT NAME
    firstPage.drawText(
      `${checkString(client?.firstName)} ${checkString(client?.lastName)}`,
      {
        x: 55,
        y: height - 190,
        size: 11,
        color: rgb(0, 0, 0),
        font: poppinsSemiBold,
      }
    );
    // ADDRESS
    firstPage.drawText(
      checkString(`${client?.street}\n${client?.zipCode}, ${client?.city}`),
      {
        x: 55,
        y: height - 207,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        lineHeight: 15,
      }
    );
    firstPage.drawText(checkString(client?.ownerAttended), {
      x: 55,
      y: height - 253,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    //console.clear();
    //console.log(pdfRevisionData);

    firstPage.drawText(
      checkString(technician?.title) +
      " " +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 208,
        y: height - 188,
        size: 11,
        font: poppinsSemiBold,
        color: rgb(0, 0, 0),
      }
    );
    firstPage.drawText(checkString(technician?.certificate), {
      x: width - 208,
      y: height - 222,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(checkString(technician?.authorization), {
      x: width - 208,
      y: height - 256,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      deviceSafe
        ? "Zařízení je schopno bezpečného a spolehlivého provozu."
        : "Zařízení není schopno bezpečného a spolehlivého provozu.",
      {
        x: 55,
        y: height - 530,
        size: 16,
        color: rgb(0, 0, 0),
        font: poppinsBold,
      }
    );

    firstPage.drawText(checkString(technician?.executingPlace) + ", " + moment().format("DD.MM.YYYY"), {
      x: 55,
      y: height - 690,
      size: 10,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });

    // STAMP
    firstPage.drawImage(jpgImage_stamp, {
      x: width - 245,
      y: height - 780,
      width: 100,
      height: (100 * jpgDims_stamp.height) / jpgDims_stamp.width,
    });

    // Sign
    firstPage.drawImage(jpgImage, {
      x: width - 135,
      y: height - 780,
      width: jpgDims.width,
      height: jpgDims.height,
    });
    // ...................page 2
    // EVIDANCE NUMBER

    secondPage.drawRectangle({
      width: width,
      height: 50,
      x: 0,
      font: poppins,
      y: height - 500,
      color: rgb(1, 1, 1),
    });
    secondPage.drawText(
      `${performanceCheck.includes("Kontrola těsnosti")
        ? `- Kontrola těsnosti přístupných rozebíratelných spojů revidovaného zařízení byla provedena detektorem plynu ${technician.gasDetectorName} - v. č. ${technician.gasDetectorSerialNumber}\n`
        : ""
      }${performanceCheck.includes("Kontrola armatur")
        ? `- Kontrola funkce a úplnosti ovládacích a bezpečnostních armatur na zařízení\n`
        : ""
      }${performanceCheck.includes("Kontrola spotřebiče")
        ? `- Kontrola spotřebičů (ovládací a bezpečnostní prvky, funkce)\n`
        : ""
      }${performanceCheck.includes("Kontrola výskytu CO")
        ? `- Kontrola výskytu CO v místnosti byla provedena detekčním přístrojem ${technician.pressureGaugeName} - v. č. ${technician.pressureGaugeSerialNumber}`
        : ""
      }`,
      {
        x: 55,
        y: height - 455,
        size: 11,
        lineHeight: 15,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
      }
    );
    secondPage.drawText(checkString(connectionMethod), {
      x: 55,
      y: height - 185,
      size: 11,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
      lineHeight: 15,
      font: poppins,
    });
    
    secondPage.drawText(checkString(deviceName), {
      x: 55,
      y: height - 387,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
      maxWidth: 130,
      lineHeight: 15,
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(devicePosition), {
      x: 231,
      y: height - 387,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(threadType), {
      x: 421,
      y: height - 387,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // secondPage.drawText(totalMaxConsumptionOfNaturalGas, {
    //   x: 420,
    //   y: height - 400,
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // })

    // secondPage.drawText('acceptable', {
    //   x: 55,
    //   y: height - 470,
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // })
    // secondPage.drawText('acceptable', {
    //   x: 55,
    //   y: height - 470,
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // })
    secondPage.drawText(checkString(defectsText(returnDefectDescription(majorDefects))), {
      x: 55,
      y: height - 645,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });
    secondPage.drawText(checkString(defectsText(returnDefectDescription(minorDefects))), {
      x: 55,
      y: height - 712,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });
    secondPage.drawText(
      checkString(defectsText(returnDefectDescription(deviceDefects))) ?? "",
      {
        x: 55,
        y: height - 778,
        size: 10,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: 300,
        lineHeight: 15,
      }
    );
    if (removeDefectsBefore){
      secondPage.drawText(checkString("Datum k odstranění závad"), {
        x: 390,
        y: height - 698,
        size: 10,
        font: poppinsReg,
        color: rgb(0.61, 0.61, 0.61),
      });
      secondPage.drawText(moment(checkString(removeDefectsBefore)).format("DD. MM. YYYY"), {
        x: 390,
        y: height - 710,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
      });

    }
    // ...................page 3
    // PREVIOUS DEFECTS
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.previousDefects),
      {
        x: 55,
        y: height - 122,
        size: 11,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        font: poppins,
      }
    );
    // PREVIOUS REVISON
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.previousRevision),
      {
        x: 55,
        y: height - 220,
        size: 11,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        font: poppins,
      }
    );
    // OTHER INFORMATION
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.otherInformation),
      {
        x: 55,
        y: height - 323,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        lineHeight: 15
      }
    );
    // Date next revv
    thirdPage.drawText(moment(nextRevisionDate).format("DD. MM. YYYY"), {
      x: 55,
      y: height - 756,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    // Technician
    thirdPage.drawText(
      checkString(technician?.title + " ") +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 190,
        y: height - 756,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
      }
    );
    const pdfBytes = await pdfDoc.save();
    const pdfString = await pdfDoc.saveAsBase64({ dataUri: true });
    setPDFString(pdfString);
    return pdfDoc;
  }
  // ............................................................load record pdf

  async function loadPdfInitial_obj() {
    const {
      techInformation,
      basicInformation: client,
      foundDefects,
      additionalInformation,
      timestamp,
      clientId,
      userId,
      signImg,
    } = pdfRevisionData;
    const {
      connectionMethod,
      deviceName,
      devicePosition,
      evidenceNumber,
      performanceCheck,
      threadType,
      totalMaxConsumptionOfNaturalGas,
    } = techInformation;
    const { deviceDefects, majorDefects, minorDefects, removeDefectsBefore } = foundDefects;
    const { deviceSafe, nextRevisionDate, otherInformation, previousRevision } =
      additionalInformation;
    const response = await fetch(Initial_obj_template);
    const buffer = await response.arrayBuffer();
    const existingPdfDocBytes = new Uint8Array(buffer);
    //

    const pdfDoc = await PDFDocument.load(existingPdfDocBytes);

    const FontBold = await fetch(PoppinsBold).then((res) => res.arrayBuffer());
    const FontMedium = await fetch(PoppinsMedium).then((res) => res.arrayBuffer());
    const FontSemiBold = await fetch(PoppinsSemiBold).then((res) => res.arrayBuffer());

    pdfDoc.registerFontkit(fontkit);
    const poppins = await pdfDoc.embedFont(FontMedium);
    const poppinsSemiBold = await pdfDoc.embedFont(FontSemiBold);
    const poppinsBold = await pdfDoc.embedFont(FontBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const thirdPage = pages[2];

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();
    const jpgImageBytes = await fetch(signImg).then((res) => res.arrayBuffer());
    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scale(0.25);
    const jpgImageBytes_stamp = await fetch(technician?.imageUrl).then((res) =>
      res.arrayBuffer()
    );
    var jpgImage_stamp;
    try {
      jpgImage_stamp = await pdfDoc.embedPng(jpgImageBytes_stamp);
    } catch (error) {
      jpgImage_stamp = await pdfDoc.embedJpg(jpgImageBytes_stamp);
    }
    const jpgDims_stamp = jpgImage_stamp.scale(0.25);
    // EVIDENCE NUMBER
    firstPage.drawText(evidenceNumber, {
      x: width - 207,
      y: height - 73,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    firstPage.drawText(moment().format("DD. MM. YYYY"), {
      x: width - 207,
      y: height - 108,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // CLIENT NAME
    firstPage.drawText(
      `${checkString(client?.firstName)} ${checkString(client?.lastName)}`,
      {
        x: 55,
        y: height - 180,
        size: 11,
        color: rgb(0, 0, 0),
        font: poppinsSemiBold,
      }
    );
    // ADDRESS
    firstPage.drawText(
      checkString(`${client?.street}\n${client?.zipCode}, ${client?.city}`),
      {
        x: 55,
        y: height - 195,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        lineHeight: 15,
      }
    );
    
    firstPage.drawText(checkString(client?.ownerAttended), {
      x: 55,
      y: height - 277,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(checkString(client?.objectManagerName), {
      x: 55,
      y: height - 243,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(checkString(client?.flatPosition), {
      x: 212,
      y: height - 243,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    //console.clear();
    //console.log(pdfRevisionData);

    firstPage.drawText(
      checkString(technician?.title) +
      " " +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 207,
        y: height - 180,
        size: 11,
        font: poppinsSemiBold,
        color: rgb(0, 0, 0),
      }
    );
    firstPage.drawText(checkString(technician?.certificate), {
      x: width - 207,
      y: height - 212,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(checkString(technician?.authorization), {
      x: width - 207,
      y: height - 245,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      deviceSafe
        ? "Zařízení je schopno bezpečného a spolehlivého provozu."
        : "Zařízení není schopno bezpečného a spolehlivého provozu.",
      {
        x: 55,
        y: height - 539,
        size: 16,
        color: rgb(0, 0, 0),
        font: poppinsBold,
      }
    );

    firstPage.drawText(checkString(technician?.executingPlace) + ", " + moment().format("DD.MM.YYYY"), {
      x: 55,
      y: height - 698,
      size: 10,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });

    // STAMP
    firstPage.drawImage(jpgImage_stamp, {
      x: width - 245,
      y: height - 785,
      width: 100,
      height: (100 * jpgDims_stamp.height) / jpgDims_stamp.width,
    });

    // Sign
    firstPage.drawImage(jpgImage, {
      x: width - 135,
      y: height - 775,
      width: jpgDims.width,
      height: jpgDims.height,
    });
    // ...................page 2

    secondPage.drawText(checkString(connectionMethod), {
      x: 55,
      y: height - 185,
      size: 11,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
      lineHeight: 15,
      font: poppins,
    });
    
    secondPage.drawText(checkString(deviceName), {
      x: 55,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
      maxWidth: 130,
      lineHeight: 12,
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(devicePosition), {
      x: 198,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(threadType), {
      x: 337,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });

    secondPage.drawText(checkString(totalMaxConsumptionOfNaturalGas), {
      x: 459,
      y: height - 389,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
    });

    // Box
    secondPage.drawRectangle({
      x: 55,
      y: height - 450,
      width: 450,
      height: 20,
      font: poppins,
      color: rgb(1, 1, 1),
      // borderColor: rgb(0.75, 0.2, 0.2),
    });
    secondPage.drawText(
      `Tlaková zkouška - viz zápis o tlakové zkoušce č. ${pdfRevisionData.performedTests.evidenceNumber
      } ze dne ${moment().format("DD. MM. YYYY")} - výsledek zkoušky - ${pdfRevisionData.performedTests.overallRating
        ? "vyhovující"
        : "nevyhovující"
      }`,
      {
        x: 55,
        y: height - 475,
        width: 450,
        height: 20,
        color: rgb(0, 0, 0),
        size: 11,
        lineHeight: 15,
        font: poppins,
        maxWidth: width - 110,
      }
    );

    secondPage.drawText(checkString(previousRevision),
      {
        x: 55,
        y: height - 508,
        width: 450,
        height: 20,
        color: rgb(0, 0, 0),
        size: 11,
        lineHeight: 15,
        font: poppins,
        maxWidth: width - 110,
      }
    );


    secondPage.drawText(checkString(defectsText(returnDefectDescription(majorDefects))), {
      x: 55,
      y: height - 626,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });
    secondPage.drawText(checkString(defectsText(returnDefectDescription(minorDefects))), {
      x: 55,
      y: height - 728,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });
    if (removeDefectsBefore){
      secondPage.drawText(checkString("Datum k odstranění závad"), {
        x: 400,
        y: height - 640,
        size: 10,
        font: poppins,
        color: rgb(0.61, 0.61, 0.61),
      });
      secondPage.drawText(moment(checkString(removeDefectsBefore)).format("DD. MM. YYYY"), {
        x: 400,
        y: height - 655,
        size: 10,
        font: poppins,
        color: rgb(0, 0, 0),
      });

    }

    // ...................page 3
    thirdPage.drawRectangle({
      x: 55,
      width: width - 110,
      y: height - 185,
      size: 12,
      height: 20,
      color: rgb(1, 1, 1),
      maxWidth: width - 110,
      font: poppinsBold,
    });
    thirdPage.drawText(
      `Zápis o tlakové zkoušce č. ${pdfRevisionData.performedTests.evidenceNumber
      } ze dne ${moment().format("DD. MM. YYYY")} - provedl RT ${checkString(technician.title)} ${technician.firstName} ${technician.lastName
      }`,
      {
        x: 55,
        y: height - 173,
        size: 11,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        font: poppins,
      }
    );

    // OTHER INFORMATION
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.otherInformation),
      {
        x: 55,
        y: height - 175 - 88,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        lineHeight: 15,
      }
    );
    // EVIDANCE NUMBER
    thirdPage.drawText(moment(nextRevisionDate).format("DD. MM. YYYY"), {
      x: 55,
      y: height - 756,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    // EVIDANCE NUMBER
    thirdPage.drawText(
      checkString(technician?.title + " ") +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 189,
        y: height - 756,
        size: 11,
        font: poppinsSemiBold,
        color: rgb(0, 0, 0),
      }
    );
    const pdfBytes = await pdfDoc.save();
    const pdfString = await pdfDoc.saveAsBase64({ dataUri: true });
    // setPDF_String(el => { return { ...el, initial_template: pdfString } })
    setPDFString((_) => pdfString);
    if (
      pdfRevisionData?.performedTests &&
      Object.keys(pdfRevisionData.performedTests).length
    ) {
      loadPdfpressure_template(pdfString);
      return;
    }
    return pdfDoc;
  }
  

  // ............................................................load record pdf

  async function loadPdfService_obj() {
    const {
      techInformation,
      basicInformation: client,
      foundDefects,
      additionalInformation,
      timestamp,
      clientId,
      userId,
      signImg,
    } = pdfRevisionData;
    const {
      connectionMethod,
      deviceName,
      devicePosition,
      evidenceNumber,
      performanceCheck,
      threadType,
      totalMaxConsumptionOfNaturalGas,
    } = techInformation;
    const { deviceDefects, majorDefects, minorDefects, removeDefectsBefore } = foundDefects;
    const { deviceSafe, nextRevisionDate, otherInformation, previousRevision } =
      additionalInformation;
    const response = await fetch(Service_obj_template);
    // const technician = await fetchCollectionData(userId, "profile");
    // const client = await fetchCollectionData(clientId, "client");

    const buffer = await response.arrayBuffer();
    const existingPdfDocBytes = new Uint8Array(buffer);
    //

    const pdfDoc = await PDFDocument.load(existingPdfDocBytes);

    const Font = await fetch(PoppinsRegular).then((res) => res.arrayBuffer());
    const FontBold = await fetch(PoppinsBold).then((res) => res.arrayBuffer());
    const FontMedium = await fetch(PoppinsMedium).then((res) => res.arrayBuffer());
    const FontSemiBold = await fetch(PoppinsSemiBold).then((res) => res.arrayBuffer());

    pdfDoc.registerFontkit(fontkit);
    const poppinsReg = await pdfDoc.embedFont(Font);
    const poppins = await pdfDoc.embedFont(FontMedium);
    const poppinsSemiBold = await pdfDoc.embedFont(FontSemiBold);
    const poppinsBold = await pdfDoc.embedFont(FontBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const thirdPage = pages[2];
    const { width, height } = firstPage.getSize();
   
    
    const jpgImageBytes = await fetch(signImg).then((res) => res.arrayBuffer());

    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scale(0.25);
    const jpgImageBytes_stamp = await fetch(technician?.imageUrl).then((res) =>
      res.arrayBuffer()
    );
    var jpgImage_stamp;
    try {
      jpgImage_stamp = await pdfDoc.embedPng(jpgImageBytes_stamp);
    } catch (error) {
      jpgImage_stamp = await pdfDoc.embedJpg(jpgImageBytes_stamp);
    }
    const jpgDims_stamp = jpgImage_stamp.scale(0.2);

    /// EVIDENCE NUMBER
    firstPage.drawText(evidenceNumber, {
      x: width - 207,
      y: height - 75,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    firstPage.drawText(moment().format("DD. MM. YYYY"), {
      x: width - 207,
      y: height - 108,
      size: 13,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // CLIENT NAME
    firstPage.drawText(
      `${checkString(client?.firstName)} ${checkString(client?.lastName)}`,
      {
        x: 55,
        y: height - 180,
        size: 11,
        color: rgb(0, 0, 0),
        font: poppinsSemiBold,
      }
    );
    // ADDRESS
    firstPage.drawText(
      checkString(`${client?.street}\n${client?.zipCode}, ${client?.city}`),
      {
        x: 55,
        y: height - 195,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        lineHeight: 15,
      }
    );
    firstPage.drawText(checkString(client?.ownerAttended), {
      x: 55,
      y: height - 275,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(checkString(client?.objectManagerName), {
      x: 55,
      y: height - 242,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(checkString(client?.flatPosition), {
      x: 207,
      y: height - 242,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });

    //console.clear();
    //console.log(pdfRevisionData);

    firstPage.drawText(
      checkString(technician?.title + " ") +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 207,
        y: height - 178,
        size: 11,
        font: poppinsSemiBold,
        color: rgb(0, 0, 0),
      }
    );
    firstPage.drawText(checkString(technician?.certificate), {
      x: width - 207,
      y: height - 211,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(checkString(technician?.authorization), {
      x: width - 207,
      y: height - 245,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      deviceSafe
        ? "Zařízení je schopno bezpečného a spolehlivého provozu."
        : "Zařízení není schopno bezpečného a spolehlivého provozu.",
      {
        x: 55,
        y: height - 540,
        size: 16,
        color: rgb(0, 0, 0),
        font: poppinsBold,
      }
    );

    firstPage.drawText(checkString(technician?.executingPlace) + ", " + moment().format("DD.MM.YYYY"), {
      x: 55,
      y: height - 700,
      size: 10,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });

    // STAMP
    firstPage.drawImage(jpgImage_stamp, {
      x: width - 245,
      y: height - 785,
      width: 100,
      height: (100 * jpgDims_stamp.height) / jpgDims_stamp.width,
    });

    // Sign
    firstPage.drawImage(jpgImage, {
      x: width - 135,
      y: height - 780,
      width: jpgDims.width,
      height: jpgDims.height,
    });
    // ...................page 2
    // EVIDANCE NUMBER

    secondPage.drawRectangle({
      width: width,
      height: 50,
      x: 0,
      font: poppins,
      y: height - 500,
      color: rgb(1, 1, 1),
    });
    secondPage.drawText(
      `${performanceCheck.includes("Kontrola těsnosti")
        ? `- Kontrola těsnosti přístupných rozebíratelných spojů revidovaného zařízení byla provedena detektorem plynu ${technician.gasDetectorName} - v. č. ${technician.gasDetectorSerialNumber}\n`
        : ""
      }${performanceCheck.includes("Kontrola armatur")
        ? `- Kontrola funkce a úplnosti ovládacích a bezpečnostních armatur na zařízení\n`
        : ""
      }${performanceCheck.includes("Kontrola spotřebiče")
        ? `- Kontrola spotřebičů (ovládací a bezpečnostní prvky, funkce)\n`
        : ""
      }${performanceCheck.includes("Kontrola výskytu CO")
        ? `- Kontrola výskytu CO v místnosti byla provedena detekčním přístrojem ${technician.pressureGaugeName} - v. č. ${technician.pressureGaugeSerialNumber}`
        : ""
      }`,
      {
        x: 55,
        y: height - 455,
        size: 11,
        lineHeight: 15,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
      }
    );
    secondPage.drawText(checkString(connectionMethod), {
      x: 55,
      y: height - 185,
      size: 11,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
      lineHeight: 15,
      font: poppins,
    });
    
    secondPage.drawText(checkString(deviceName), {
      x: 55,
      y: height - 387,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
      maxWidth: 130,
      lineHeight: 15,
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(devicePosition), {
      x: 231,
      y: height - 387,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // DATE OF REVISION
    secondPage.drawText(checkString(threadType), {
      x: 421,
      y: height - 387,
      size: 11,
      font: poppinsSemiBold,
      color: rgb(0, 0, 0),
    });
    // secondPage.drawText(totalMaxConsumptionOfNaturalGas, {
    //   x: 420,
    //   y: height - 400,
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // })

    // secondPage.drawText('acceptable', {
    //   x: 55,
    //   y: height - 470,
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // })
    // secondPage.drawText('acceptable', {
    //   x: 55,
    //   y: height - 470,
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // })
    secondPage.drawText(checkString(defectsText(returnDefectDescription(majorDefects))), {
      x: 55,
      y: height - 645,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });
    secondPage.drawText(checkString(defectsText(returnDefectDescription(minorDefects))), {
      x: 55,
      y: height - 712,
      size: 10,
      font: poppins,
      color: rgb(0, 0, 0),
      maxWidth: 300,
      lineHeight: 15,
    });
    secondPage.drawText(
      checkString(defectsText(returnDefectDescription(deviceDefects))) ?? "",
      {
        x: 55,
        y: height - 778,
        size: 10,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: 300,
        lineHeight: 15,
      }
    );
    if (removeDefectsBefore){
      secondPage.drawText(checkString("Datum k odstranění závad"), {
        x: 390,
        y: height - 698,
        size: 10,
        font: poppinsReg,
        color: rgb(0.61, 0.61, 0.61),
      });
      secondPage.drawText(moment(checkString(removeDefectsBefore)).format("DD. MM. YYYY"), {
        x: 390,
        y: height - 710,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
      });

    }
    // ...................page 3
    // PREVIOUS DEFECTS
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.previousDefects),
      {
        x: 55,
        y: height - 120,
        size: 11,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        font: poppins,
      }
    );
    // PREVIOUS REVISON
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.previousRevision),
      {
        x: 55,
        y: height - 222,
        size: 11,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        font: poppins,
      }
    );
    // OTHER INFORMATION
    thirdPage.drawText(
      checkString(pdfRevisionData.additionalInformation.otherInformation),
      {
        x: 55,
        y: height - 328,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
        maxWidth: width - 110,
        lineHeight: 15
      }
    );
    // EVIDANCE NUMBER
    thirdPage.drawText(moment(nextRevisionDate).format("DD. MM. YYYY"), {
      x: 55,
      y: height - 756,
      size: 11,
      font: poppins,
      color: rgb(0, 0, 0),
    });
    // EVIDANCE NUMBER
    thirdPage.drawText(
      checkString(technician?.title + " ") +
      checkString(technician?.firstName) +
      " " +
      checkString(technician?.lastName),
      {
        x: width - 190,
        y: height - 756,
        size: 11,
        font: poppins,
        color: rgb(0, 0, 0),
      }
    );
    const pdfBytes = await pdfDoc.save();
    const pdfString = await pdfDoc.saveAsBase64({ dataUri: true });
    setPDFString(pdfString);
    return pdfDoc;
  }
  // ............................................................

  useEffect(() => {
    if (type === revisionTypes.initial) {
      if (pdfRevisionData?.basicInformation?.objectManagerName) {
        loadPdfInitial_obj();
      } else {
        loadPdfInitial();
      }
    } else {
      // if you want to show just selected service pdf according to objectmanager name
      if (pdfRevisionData?.basicInformation?.objectManagerName) {
        loadPdfService_obj();
      } else {
        loadPdfService();
      }
    }
  }, []);
  return (
    <>
      <Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item md={7}>
            <Stack
              direction={"row"}
              spacing={4}
              justifyContent="center"
              alignItems={"center"}
              sx={{ marginTop: mobileScreen? -8 : 0, marginBottom: 3 }}
            ></Stack>
            <Paper
              style={{
                aspectRatio: "8.26/11.5",
                overflowY: "auto",
                overflowX: "hidden",
              }}
              sx={{
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,.1)",
                  // outline: "1px solid slategrey",
                },
              }}
              elevation={15}
            >
              <AllPages type={type} pdf={PDFString} />
            </Paper>
            <Stack
              direction={"row"}
              spacing={4}
              justifyContent="center"
              alignItems={"center"}
              sx={{ marginTop: 3 }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleToggleModal}
                disableElevation
                sx={{fontWeight:500, color: "white" }}
              >
                <span className="me-2">Uložit jako vzor</span>
                <PatternIcon width="16" height="16" />
              </Button>
              <CustomButton
                onClick={saveRevision}
                btnProps={{ variant: "contained" }}
                title={"Uložit revizi"}
                reducer={"revision"}
                action={"createRevisionAsyncThunk"}
                icon={<DownloadIcon width="16" height="16" />}
              />
            </Stack>
          </Grid>
        </Grid>
        <PatternModal type={type} />
        <BootstrapDialogTitle open={open} />
      </Box>
    </>
  );
};
