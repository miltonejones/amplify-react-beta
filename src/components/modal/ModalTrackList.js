
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, ListItemAvatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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



export default function ModalTrackList({ tracks, select }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List dense component="nav" aria-label="main mailbox folders" >
        {!!tracks && tracks.map(track => {
          const { ID, Title, albumImage, artistName, albumName, trackNumber } = track;
          return (
            <ListItem
              onClick={() => select(track)}
              key={ID}
              classes={{ gutters: classes.gutter, multiline: classes.multiline, root: 'standard-button' }}
              style={{ margin: 0, padding: '0 8px' }}>
              <ListItemAvatar>
                <Avatar alt={Title} src={albumImage} />
              </ListItemAvatar>
              <ListItemText
                classes={{ primary: classes.label, secondary: classes.label }}
                key={ID}
                secondary={artistName + '/' + albumName}
                primary={(trackNumber || '#') + '. ' + Title} />
            </ListItem>
          )
        })}
      </List>
    </div>
  );
}
