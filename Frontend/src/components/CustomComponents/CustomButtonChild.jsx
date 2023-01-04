import { CircularProgress } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';

export default function CustomButtonChild({
  icon,
  reducer,
  action,
  selected
}) {
  const loading = useSelector(state => state?.[reducer]?.loadings?.[action])
  return loading && selected ? <CircularProgress size="1rem" /> : icon
}
