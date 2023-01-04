import React from 'react'
import Button from "@mui/material/Button";
import { useSelector } from 'react-redux';

export default function CustomButton({
  onClick,
  btnProps,
  title,
  reducer,
  action,
  icon,
  loadingText,
}) {
  const loading = useSelector(state=>state?.[reducer]?.loadings?.[action])
  return (
    <Button
    disabled={loading}
      {...btnProps}
      onClick={onClick}
      disableElevation
      sx={{fontWeight: 500, color: "white"}}
    >
      {loading? "Načítám.." : 
      icon ? 
      <>
      <span className="me-2">{title}</span>
      {icon}
      </>
       :
      title
      }
    </Button>
  )
}
