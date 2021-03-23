import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import appRoutes from '../Routes';
import { Icon, useMediaQuery } from '@material-ui/core';

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
    margin: '4px 20px'
  },
  open: {
    margin: '4px 20px 4px 256px'
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  noicon: {
    margin: 0,
  },
}));



const PageBreadcrumbs = (props) => {
  const classes = useStyles();
  const { crumb, open } = props;
  const matches = useMediaQuery('(max-width:600px)');

  return (
    <Breadcrumbs aria-label="breadcrumb" classes={{ root: open && !matches ? classes.open : classes.root }}>
      <Link color="inherit" to="/" className={classes.link}>
        <HomeIcon className={classes.icon} />
        {!matches && 'Home'}
      </Link>


      {
        crumb?.data?.label && (<Link
          color="inherit"
          to={crumb.data.prefix + crumb.path}
          className={classes.link}
        >
          <Icon className={classes.noicon}>{crumb.data.icon}</Icon>
          {!matches && crumb.data.label}
        </Link>)
      }


      {
        crumb?.label && (<Typography color="textPrimary" className={classes.link}>
          {/* <GrainIcon className={classes.icon} /> */}
          {truncate(crumb.label, matches)}
        </Typography>)
      }
    </Breadcrumbs>
  );
}


export {
  PageBreadcrumbs,
  createCrumb
}

const truncate = (str, yes) => {
  if (yes && str.length > 15) {
    return str.substr(0, 15) + '...';
  }
  return str;
}