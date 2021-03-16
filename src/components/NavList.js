
import React from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import appRoutes from '../Routes';
import Icon from '@material-ui/core/Icon';
import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { ListItemSecondaryAction } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    maxWidth: '32px'
  }
}));

function ListItemLink(props) {
  const { icon, primary, to, prefix, count, bold } = props;

  const isActive = (match, location) => {
    if (!location) {
      return false;
    }
    return location.pathname.indexOf(to) > -1 && !bold;
  };

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <NavLink
          isActive={isActive}
          activeStyle={{
            fontWeight: "bold",
            color: "red"
          }} ref={ref} to={prefix + to} {...linkProps} />
      )),
    [to],
  );
  return (
    <ListItem button component={CustomLink}>
      <ListItemIcon classes={{ root: 'nav-list-icon' }}>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={primary} />
      {count && <ListItemSecondaryAction>
        {count}
      </ListItemSecondaryAction>}
    </ListItem>
  );
}


export default function NavList() {
  const classes = useStyles();
  const routes = appRoutes.filter(route => route.data?.icon);
  return (
    <div className={classes.root}>
      <List dense component="nav" aria-label="main mailbox folders"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Browse
        </ListSubheader>
        }
      >

        {routes.map(route => {
          return (

            <ListItemLink icon={route.data.icon} key={route.data.label} prefix={route.data.prefix} primary={route.data.label} to={route.path} />

          )
        })}
      </List>

    </div>
  );
}

export {
  ListItemLink
}