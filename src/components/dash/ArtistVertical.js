
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Icon, ListItemAvatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  gutter: {
    padding: 0,
    margin: 0,
    // outline: 'dotted 2px orange'
  },
  title: {
    fontSize: '20px',
    margin: 0,
    // outline: 'dotted 2px orange'
  }
}));

export default function ArtistVertical(props) {
  const { objects, field, icon } = props;
  const classes = useStyles();
  const artists = objects?.result || [];
  const label = objects?.label || '';
  // console.log({ artists })
  return (
    <div className={classes.root}>
      <div className={classes.title}><Icon>{icon}</Icon>{label}</div>
      <List dense component="nav" aria-label="main mailbox folders">

        {artists.map((artist, i) => {
          const label = i === 0
            ? artist.Name
            : `${i + 1}. ${artist.Name}`
          return (
            <ListItem key={artist.ID} classes={{ gutters: classes.gutter }} style={{ margin: 0, padding: '0 8px' }}>
              {i === 0 && (<ListItemAvatar>
                <Avatar alt={artist.Name} src={artist[field]} />
              </ListItemAvatar>)}
              <ListItemText key={artist.ID} secondary={props.footer(artist)} primary={label} />
            </ListItem>
          )
        })}
      </List>

    </div>
  );
}

