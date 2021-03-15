import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Icon from '@material-ui/core/Icon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';

function ListItemLink(props) {
  const { icon, primary, secondary, to } = props;

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to],
  );
  return (
    <ListItem button component={CustomLink}>
      <ListItemAvatar>
        <Avatar>
          <Icon>{icon}</Icon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
}

const TrackMenu = (props) => {

  const nodes = [
    {
      label: 'View Artist',
      when: !!props.track?.artistName,
      footer: props.track?.artistName,
      icon: 'people',
      path: `/show/Artist.html/${props.track.artistFk}`
    },
    {
      label: 'View Album',
      when: !!props.track?.albumName,
      footer: props.track?.albumName,
      icon: 'album',
      path: `/show/Album.html/${props.track.albumFk}`
    },
    {
      label: 'View Genre',
      when: !!props.track?.Genre,
      footer: props.track?.Genre,
      icon: 'local_offer',
      path: `/show/Genre.html/${props.track.genreKey}`
    },
  ].filter(f => f.when);

  return (
    <List>
      {nodes.map(node => {
        return (
          <ListItemLink icon={node.icon} key={node.label} secondary={node.footer} primary={node.label} to={node.path} />
        )
      })}
    </List>
  )
}


export {
  TrackMenu
}