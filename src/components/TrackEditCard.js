import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DataInput from './DataInput';
import { DEFAULT_HREF } from '../Constants';
import { Avatar, CardHeader, Collapse, Icon, IconButton, InputBase, Tooltip } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 320,
    width: '320px',
    margin: 4
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
    color: 'red'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
    cursor: 'pointer'
  },
  act: {
    cursor: 'pointer'
  },
  sm: {
    width: '50px',
    maxWidth: '50px'
  },
  titleName: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '200px',
    minWidth: '200px',
  },
  titleRoot: {
    padding: '16px 16px 0 16px'
  }
});

export default function TrackEditCard({ track, suggested, assign, save, apply, create, clone, setTitle, itune }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleApplyClick = () => {
    assign();
    setExpanded(false);
  };

  return (
    <Card className={classes.root}>

      <CardHeader
        classes={{ title: classes.titleName, root: classes.titleRoot }}
        avatar={
          <Avatar alt={track.Title} src={track.albumImage} className={classes.avatar} />
        }
        action={
          <IconButton aria-label="settings">
            <Icon>more_vert</Icon>
          </IconButton>
        }
        title={track.Title}
        subheader={track.artistName}
      />

      {/* <CardMedia
        className={classes.media}
        image={track.albumImage}
        title={track.Title}
      /> */}

      <CardContent>
        {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
          edit track
        </Typography> */}
        {/* <Typography variant="h6" component="h2">
          {track.Title}
        </Typography> */}
        <DataInput immutable attr={{ 'variant': 'h6', component: 'h2' }} fields={['Title']} change={a => setTitle(a)} text={track.Title} />
        <DataInput create={create} select={(a) => assign(a)} attr={{ className: classes.pos, color: 'textSecondary' }} fields={['artistFk', 'artistName']} type="artists" text={track.artistName} />
        <DataInput create={create} select={(a) => assign(a)} attr={{ className: classes.act, variant: 'body2', component: 'div' }} fields={['albumFk', 'albumName']} type="albums" text={track.albumName} />
        <DataInput create={create} select={(a) => assign(a)} attr={{ className: classes.act, variant: 'body2', component: 'div' }} fields={['genreKey', 'Genre']} type="genres" text={track.Genre} />
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Disc: <TrackNumberInput track={track} field="discNumber" />, Track: <TrackNumberInput track={track} field="trackNumber" />
        </Typography>
      </CardContent>

      <CardActions>
        {/* <Button size="small">get info</Button> */}
        <Tooltip title="save">
          <IconButton size="small" onClick={() => save(track)} color="primary"><Icon>save</Icon></IconButton>
        </Tooltip>
        <Tooltip title="save all">
          <IconButton size="small" onClick={() => save(track, !0)} color="primary"><Icon>collections_bookmark</Icon></IconButton>
        </Tooltip>
        <Tooltip title="copy album/artist to all tracks">
          <IconButton size="small" onClick={() => clone()}>
            <Icon>content_copy</Icon>
          </IconButton>
        </Tooltip>

        <Tooltip title="find info on Apple.com">
          <IconButton size="small" onClick={() => itune()}>
            <Icon>travel_explore</Icon>
          </IconButton>
        </Tooltip>


      </CardActions>

      <Divider />

      {!!suggested?.value && (<CardActions>
        <Button onClick={handleExpandClick} size="small">show suggestions</Button>
      </CardActions>)}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography className={classes.pos} color="textSecondary">
            {suggested?.Title}
          </Typography>
          <Typography onClick={() => apply('artist', { ID: suggested.artistFk, Text: suggested.artistName })} variant="body2" component="div">
            {suggested?.artistName}
          </Typography>
          <Typography onClick={() => apply('album', { ID: suggested.albumFk, Text: suggested.albumName })} variant="body2" component="div">
            {suggested?.albumName}
          </Typography>
          <CardActions disableSpacing>
            <Button size="small" onClick={handleApplyClick}>apply suggestions</Button>
          </CardActions>
        </CardContent>
      </Collapse>


    </Card>
  );
}

const TrackNumberInput = ({ track, field }) => {
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  const handleChange = (e) => {
    const { target, keyCode } = e;
    const { value } = target;
    if (keyCode === 13) {
      track[field] = value;
      setEditing(false)
    }

  }
  if (!editing) {
    return <a href={DEFAULT_HREF} onClick={() => setEditing(true)}>{track[field] || '---'}</a>
  }
  return (
    <InputBase className={classes.sm} onKeyUp={handleChange} placeholder={field} defaultValue={track[field]} />
  )
}