import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GrainIcon from '@material-ui/icons/Grain';
import appRoutes from '../Routes';
import { Icon } from '@material-ui/core';

const createCrumb = (path, id, label) => {
  const crumb = appRoutes.filter(route => route.path === path)[0];
  if (crumb) {
    return {
      path,
      id,
      label,
      ...crumb
    }
  }
  return {}
}

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
  },
  root: {
    // border: 'dotted 2px rebeccapurple',
    margin: '4px 20px'
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));



const PageBreadcrumbs = (props) => {
  const classes = useStyles();
  const { crumb } = props;
  console.log({ crumb })
  return (
    <Breadcrumbs aria-label="breadcrumb" classes={{ root: classes.root }}>
      <Link color="inherit" to="/" className={classes.link}>
        <HomeIcon className={classes.icon} />
        Home
      </Link>


      {
        crumb?.data?.label && (<Link
          color="inherit"
          to={crumb.data.prefix + crumb.path}
          className={classes.link}
        >
          <Icon>{crumb.data.icon}</Icon>
          {crumb.data.label}
        </Link>)
      }


      {
        crumb?.label && (<Typography color="textPrimary" className={classes.link}>
          {/* <GrainIcon className={classes.icon} /> */}
          {crumb.label}
        </Typography>)
      }
    </Breadcrumbs>
  );
}


export {
  PageBreadcrumbs,
  createCrumb
}