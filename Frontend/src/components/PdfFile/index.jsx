import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

export const AllPages = (props) => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const { pdf } = props;

  return (
    <Document
      file={{
        url: pdf,
      }}
      options={{ workerSrc: "/pdf.worker.js" }}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={<Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        aspectRatio: "8.26/11.5",
        width: "100%",
        background: "rgba(0, 133, 255, 0.1)",
      }}>
        <CircularProgress size={100} color="primary" />
      </Box>}
      error={<Box sx={{
        padding: "4rem",
        aspectRatio: "8.26/11.69",
        width: "100%",
        background: `rgba(255, 5 , 5, 0.3)`,
      }}>
        Chyba při načítání dokumentu
      </Box>}
      onLoadError={(error) => console.log(error)}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} className={`mt-${index === 0 ? "0" : "3"} shadow`} pageNumber={index + 1} />
      ))}
    </Document>
  );
};
