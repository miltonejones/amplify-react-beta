
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Icon, ListItemAvatar } from '@material-ui/core';
import { query } from '../../AmplifyData';
import { listViewOnClick$ } from '../../util/Events';
import { sortObjects } from '../../util/State';

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
  },
  label: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}));



export default function ArtistVertical(props) {
  const { objects, field, icon, type } = props;
  const classes = useStyles();
  const artists = objects?.result || [];
  const label = objects?.label || '';

  const loadVertical = (id) => () => {
    query(type, id).then(res => {
      const data = res.data;
      console.log(data.related)
      const items = sortObjects(data.related, type);
      const index = 0;
      const track = items[index];
      console.log({ items, track, index });
      listViewOnClick$.next({ items, track, index });
    })
  }
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
            <ListItem onClick={loadVertical(artist.ID)} key={artist.ID} classes={{ gutters: classes.gutter, multiline: classes.multiline, root: 'standard-button' }} style={{ margin: 0, padding: '0 8px' }}>
              {i === 0 && (<ListItemAvatar>
                <Avatar alt={artist.Name} src={artist[field]} />
              </ListItemAvatar>)}
              <ListItemText classes={{ primary: classes.label, secondary: classes.label }} key={artist.ID} secondary={props.footer(artist)} primary={label} />
            </ListItem>
          )
        })}
      </List>

    </div>
  );
}

