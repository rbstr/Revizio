import React from "react";
import { Step, StepLabel, Stepper, useMediaQuery } from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import styled from "@emotion/styled";
import { TickIcon } from "utils/icons";


/**
  * Stepper u vytváření revize
  *
  * @param {props} x 
  * @return {} komponenta
  */

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
  },

  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },
}));

const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.secondary.main,
  zIndex: 1,
  fontSize: "1rem",
  lineHeight: 0.0,
  color: "#fff",
  fontWeight: 600,
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
  }),
  //   ...(ownerState.completed && {
  //     backgroundColor: theme.palette.primary.main,
  //   }),
}));

function StepIcon(props) {
  const mobleScreen = useMediaQuery("(max-width:600px)");
  const { active, completed, className } = props;
  return (
    <StepIconRoot
      ownerState={{ completed, active }}
      className={className}
      style={{
        width: mobleScreen ? 30 : 40,
        height: mobleScreen ? 30 : 40,
        fontSize: 13,
      }}
    >
      {completed ? <TickIcon width="12" height="12" /> : props.icon}
    </StepIconRoot>
  );
}
export const StepHeader = ({ activeStep, steps, max, theme }) => {
  const tabletScreen = useMediaQuery("(max-width:1200px)");
  const mobileScreen = useMediaQuery("(max-width:400px)");
  //console.log(theme.palette.secondary.main)
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel={tabletScreen}
      connector={<ColorlibConnector />}
    >
      {steps &&
        steps.length > 0 &&
        steps.slice(0, max).map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={StepIcon}
              sx={{
                "& .Mui-completed": {
                  stopColor: mobileScreen ? theme.palette.secondary.main : "",
                  color: theme.palette.secondary.main,
                },
              }}
            >
              {activeStep + 1 != max + 1 && label}
            </StepLabel>
          </Step>
        ))}
    </Stepper>
  );
};
