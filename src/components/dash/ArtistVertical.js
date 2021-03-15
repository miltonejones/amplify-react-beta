
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles } from '@material-ui/core/styles';

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
  }
}));

export default function ArtistVertical(props) {
  const classes = useStyles();
  const artists = props.objects?.result || [];
  const label = props.objects?.label || '';
  // console.log({ artists })
  return (
    <div className={classes.root}>
      <List dense component="nav" aria-label="main mailbox folders" subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {label}
        </ListSubheader>
      }>

        {artists.map(artist => {
          return (
            <ListItem key={artist.ID} classes={{ gutters: classes.gutter }} style={{ margin: 0, padding: '0 8px' }}>
              <ListItemText key={artist.ID} secondary={props.footer(artist)} primary={artist.Name} />
            </ListItem>
          )
        })}
      </List>

    </div>
  );
}

