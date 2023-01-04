import React, { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { CustomCard } from "components/Card";
import { PageHeader } from "utils/PageHeader";
import { Link } from "react-router-dom";
import { CircularProgressBar } from "components/CircularProgressBar";
import PlusCircleIcon from "assets/images/icons/plusIcon.webp";
import { ThemeSwitch } from "components/ThemeSwitch";
import { Dropdown } from "components/Dropdown";
import { BarChart } from "components/Chart";
import { Typography } from "@mui/material";
import { RevisionList } from "components/RevisionList";
import { useAuthFormContext } from "context/AuthContext";
import { useModalContext } from "context/ModalContext";
import { AuthLayout } from "Authentication/AuthLayout";
import { CalendarSlider } from "components/CalendarSlider";

export const DummyData = () => {
  const { handleAuthForm } = useAuthFormContext();
  const { handleToggleModal } = useModalContext();
  const [showed, setShowed] = useState(false)
  useEffect(() => {
    if (!showed) {
      setShowed(true)
      handleToggleModal();
      handleAuthForm("login");
    }
  }, []);

  const chartData = [
    { label: "Leden", value: 20 },
    { label: "Únor", value: 10 },
    { label: "Březen", value: 40 },
    { label: "Duben", value: 20 },
    { label: "Květen", value: 100 },
    { label: "Červen", value: 200 },
  ];
  const chartDataTitle = "User Data";

  const revisionList = [
    { name: "Johny Brown", date: "1.6.2021" },
    { name: "Tommy Shelby", date: "30.5.2021" },
    { name: "Broderick Apple", date: "30.5.2021" },
  ];

  return (
    <>
      <PageHeader title="Přehled" subTitle="Welcome back.">
        <Box
          sx={{ display: "inline-flex", gap: 1 }}
          alignItems="center"
          justifyContent="center"
        >
          <ThemeSwitch />
          <Dropdown />
        </Box>
      </PageHeader>
      <Box>
        <Grid container spacing={{ xs: 3, md: 4, lg: 5 }}>
          <Grid item xs={6} md={3} lg={3}>
            <CustomCard title="Vytvořit novou revizi">
              <Box className="text-center">
                <Link>
                  <img
                    src={PlusCircleIcon}
                    alt="Circle Plus"
                    className="mw-150px w-100 ratio-1x1"
                  />
                </Link>
              </Box>
            </CustomCard>
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <CustomCard title="Celkový počet revizí">
              <CircularProgressBar value={40} />
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCard title="Kalendář" >
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCard title="Měsíční vývoj počtu revizí" align="left">
              <Typography variant="body2" color="secondary">
                Bilance{" "}
                <Box component={"span"} sx={{ color: "green" }}>
                  +3
                </Box>
              </Typography>

              <BarChart chartData={chartData} chartDataTitle={chartDataTitle} />
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCard title="Nedávno vytvořené revize" align="left">
              <RevisionList listArr={revisionList} />
            </CustomCard>
          </Grid>
        </Grid>
      </Box>
      <AuthLayout />
    </>
  );
};
