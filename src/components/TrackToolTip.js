import React from 'react';
import { Avatar, Typography } from '@material-ui/core';

const TrackTooltip = ({ track }) => {
  return (
    <React.Fragment>
      <Avatar alt={track?.Title} src={track?.albumImage} style={{ float: 'left', margin: '4px' }} />
      <div className="tooltip-block">
        <Typography className="no-wrap" color="inherit">
          {track?.Title}
          <div className="tooltip-line"><label className="tooltip-label">artist</label> <b>{track?.artistName}</b></div>
          <div className="tooltip-line"><label className="tooltip-label">album</label> <b>{track?.albumName}</b></div>
        </Typography>
      </div>
    </React.Fragment>
  );
}

export {
  TrackTooltip
}