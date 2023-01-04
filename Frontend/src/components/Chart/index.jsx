import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const BarChart = ({ chartData, chartDataTitle }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const [chartLabel, chartValue] = useMemo(()=> {
    return chartData.reduce((acc, data) => {
      return [
        [...acc[0], data.label],
        [...acc[1], data.value],
      ]
    }, [[], []])
  }, [chartData])
  const theme = useTheme();
  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: chartDataTitle,
        data: chartValue,
        backgroundColor: theme.palette.primary.main,
        borderWidth: 0,
        borderRadius: 12,
        barThickness: mobileScreen? 10 : 12 ,
      },
    ],
  };
  return <Bar width={"100%"} options={{
    aspectRatio: 2.75,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      } 
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      },
      y: {
        beginAtZero: true,
        ticks : {
          //stepSize: 5
        },
        grid: {
          // display: false,
          color: theme.palette.third.main,
          drawBorder: false,
        },
      }
    },
    responsive:true,
    // ...options,
  }} data={data} />;
};
