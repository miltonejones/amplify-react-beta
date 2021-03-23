import { useMediaQuery } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

const DesktopOnly = ({ content }) => {
  const matches = useMediaQuery('(max-width:600px)');
  if (matches) return '';
  return content;
}

const DynamicGrid = ({ content, size }) => {
  const matches = useMediaQuery('(max-width:600px)');
  return (<Grid item xs={matches ? 12 : size}>{content}</Grid>)
}

export {
  DesktopOnly,
  DynamicGrid
}