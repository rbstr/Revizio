import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Dropdown } from "components/Dropdown";
import Paper from "@mui/material/Paper";
import { PdfIcon2 } from "utils/icons";
import { EmailModal } from "components/EmailModal";
import moment from "moment";
import { useTheme } from "@mui/material";

/**
  * Karta souboru
  *
  * @param {fileName} x 
  * @param {id} x 
  * @param {printOptions} x
  * @param {email} x
  * @param {subject} x
  * @param {fileUrl} x
  * @param {date} x
  * @return {} komponenta
  */

export const PrintCard = ({ fileName,id, printOptions, email,subject, fileUrl, date }) => {

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const mappedOptions = printOptions.map(e=> e.name ==="Odeslat emailem" ? {...e,onClick:()=>setOpen(true)} : e)

  function getDocumentType(fileName){
    if (fileName === 'service'){
      return "Provozní"
    }
    if (fileName === 'initial'){
      return "Výchozí"
    }
  }

  function getDate(date){
    return moment(date.seconds * 1000).format("YYYY")
  }
  return (
    <Paper className=" pt-0 p-2" elevation={15} style={{background: theme.palette.background.paper}}>
      <EmailModal email = {email} type={fileName} subject={subject} staticPDF={fileUrl} open={open} toggleOpen={()=> {
        setOpen(!open);
      }}  />
      <Box sx={{ textAlign: "end" }}>
        <Dropdown id={id} options={mappedOptions}></Dropdown>
      </Box>
      <Stack direction={"column"} alignItems="center" spacing={2}>
        <PdfIcon2 style={{color: theme.palette.secondary.main}} />
        {fileName && <Typography variant="subtitle2" color={theme.palette.secondary.main} >{getDocumentType(fileName) + "_" + getDate(date)}</Typography>}
      </Stack>
    </Paper>
  );
};
