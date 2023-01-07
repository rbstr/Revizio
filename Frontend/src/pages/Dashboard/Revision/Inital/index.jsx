import React, { useState } from "react";
import Box from "@mui/material/Box";
import { BasicInfoStep } from "../Steps/BasicInfoStep";
import { RevisedDeviceStep } from "../Steps/RevisedDeviceStep";
import { FundDefectStep } from "../Steps/FoundDefectStep";
import { OverAllRatingStep } from "../Steps/OverAllRatingStep";
import { revisionTypes } from "utils/common";
import { StepHeader } from "components/SteperHeader";
import { useDispatch } from "react-redux";
import { PageHeader } from "utils/PageHeader";
import { PdfFile } from "../Steps/PdfFile";
import { CompleteRevision } from "../Steps/CompleteRevision";
import { useTheme } from "@emotion/react";


/**
  * Komponenta výchozí revize
  * @return {} komponenta
  */


export const RevisionInitial = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const steps = [
    "Údaje o klientovi",
    "Údaje o zařízení",
    "Nalezené závady",
    "Celkové hodnocení",
    "pdf Page",
    "complete Page",
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    if (newActiveStep == 3) {
      // dispatch(createRevisionAsyncThunk({type:"initial"}))
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <PageHeader
        title="Nová revize"
        subTitle="Výchozí"
        onClick={() => {
          if (activeStep + 1 === 5) {
            handleBack();
          } else if (activeStep + 1 >= 5) {
            handleBack();
            handleBack();
          }
        }}
        goBack={
          activeStep + 1 < 5
            ? {
              name: "Zpět na výběr revize",
              url: "/revision",
            }
            : activeStep + 1 >= 5 && {
              name: "Zpět na editaci",
              // url: "/revision",
            }
        }
      />
      <Box sx={{ width: "100%" }}>
        {activeStep + 1 <= 4 && (
          <StepHeader activeStep={activeStep} steps={steps} max={4} theme={theme} />
        )}
        <Box sx={{ paddingTop: 4, pb: { xs: 0, md: 4 } }}>
          {activeStep + 1 === 1 && (
            <BasicInfoStep
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              type={revisionTypes.initial}
            />
          )}
          {activeStep + 1 === 2 && (
            <RevisedDeviceStep
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              type={revisionTypes.initial}
            />
          )}

          {activeStep + 1 === 3 && (
            <FundDefectStep
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              type={revisionTypes.initial}
            />
          )}

          {activeStep + 1 === 4 && (
            <OverAllRatingStep
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              type={revisionTypes.initial}
            />
          )}

          {activeStep + 1 === 5 && (
            <PdfFile handleNext={handleNext} type={revisionTypes.initial} />
          )}
          {activeStep + 1 === 6 && (
            <CompleteRevision
              handleNext={handleNext}
              type={revisionTypes.initial}
            />
          )}
        </Box>
        {/* <Button onClick={()=>dispatch(createRevisionAsyncThunk({type:"initial"}))}>create</Button> */}
      </Box>
    </>
  );
};
