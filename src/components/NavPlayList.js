
import React, { useEffect, useState } from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';

import { makeStyles } from '@material-ui/core/styles';
import { PLAYLIST_COLLECTION } from '../AmplifyData';
import { ListItemLink } from './NavList';
import { generateKey } from '../util/State';
import { LocalApi } from '../data/LocalApi';

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



export default function NavPlayList() {
  const classes = useStyles();
  const [lists, setLists] = useState([]);
  useEffect(() => {
    if (lists.length) return;
    LocalApi.get('playlist')
      .then(res => {
        const items = (res.data || res)?.filter(c => c.trackCount > 40 && c.Title.length < 25).slice(0, 6);
        items.map(r => r.listKey = generateKey(r.Title))
        setLists(items);
      })
  })

  if (!lists.length) {
    return <em>please wait...</em>
  }

  return (
    <div className={classes.root}>
      <List dense component="nav" aria-label="main mailbox folders"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Playlists
        </ListSubheader>
        }
      >
        <ListItemLink icon="music_note" prefix="/recent/"
          primary="Recently Played" to="Recent.html" />
        {lists.map(route => {
          return (
            <ListItemLink icon="playlist_add_check" count={route.trackCount} key={route.Title} prefix="/show/Playlist.html/"
              primary={route.Title} to={route.listKey} />
          )
        })}
        <ListItemLink immutable bold icon="playlist_play" key="view-all" prefix="/list/"
          primary={`See all ${PLAYLIST_COLLECTION.length} playlists...`} to="Playlist.html" />
      </List>
    </div>
  );
}
