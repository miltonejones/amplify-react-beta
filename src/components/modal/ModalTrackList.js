
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, Icon, ListItemAvatar, ListItemSecondaryAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ToolTipButton } from '../ToolTipButton';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 440,
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
  },
  label: {
    maxWidth: 440,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  active: {
    backgroundColor: 'antiquewhite'
  },
  icon: {
    maxWidth: '32px'
  }
}));

function Pagination({ startPage, pageSize, collection, selection, click }) {
  const descText = `${startPage + 1} to ${Math.min(startPage + pageSize, collection?.length)} of  ${collection?.length}`;
  const last = (startPage + pageSize) >= collection?.length;
  const target = collection?.indexOf(selection);
  const diff = Math.floor((target - startPage) / pageSize);

  if (collection.length <= pageSize) return '';
  return (
    <div className="pagination-container flex-centered right">
      {descText}
      <ToolTipButton icon="navigate_before" title="Previous" disabled={startPage < 1} click={() => click(-1)} />
      <ToolTipButton icon="navigate_next" title="Next" disabled={last} click={() => click(1)} />
      <ToolTipButton icon="filter_center_focus" title="center" disabled={diff === 0 || !selection} click={() => click(diff)} />
    </div>
  )
}


export default function ModalTrackList({ tracks, select, page, selectionModel, menuClick, pageSize }) {
  const classes = useStyles();
  const [pageNum, setPageNum] = React.useState(1);
  const startPage = ((pageNum - 1) * pageSize);
  const listItems = tracks?.slice(startPage, startPage + pageSize);
  const selectedTrack = tracks?.filter(t => t.ID === selectionModel?.[0])[0]

  console.log({ tracks, select, page, selectionModel, menuClick, pageSize })

  const handleNext = (index) => {
    setPageNum(pageNum + index)
  }
  return (
    <div className={classes.root}>

      <List dense component="nav" aria-label="main mailbox folders" >
        {listItems?.map((track, i) => {
          const { ID, Title, albumImage, artistName, albumName, trackNumber } = track;
          const selected = selectionModel?.indexOf(ID) > -1;
          let className = [page ? classes.root : 'standard-button', 'no-wrap'];
          if (selected) className.push(classes.active);
          else if (i % 2 === 0) className.push('row-even')
          className = className.join(' ');
          return (
            <ListItem
              style={{ margin: 0, padding: 0 }}
              onClick={() => select(track)}
              key={ID}
              classes={{
                gutters: classes.gutter,
                multiline: classes.multiline,
                root: className
              }} >
              <ListItemAvatar style={{ minWidth: '52px', padding: '6px' }}>
                <Avatar alt={Title} src={albumImage} />
              </ListItemAvatar>
              <ListItemText
                classes={{ primary: classes.label, secondary: classes.label }}
                key={ID}
                secondary={(
                  <div>
                    <div className="no-wrap">
                      {artistName}
                    </div>
                    <div className="no-wrap">
                      {albumName}
                    </div>
                  </div>
                )}
                primary={(trackNumber || '#') + '. ' + Title} />
              {menuClick && <ListItemSecondaryAction onClick={() => menuClick(track)}>
                <Icon>more_vert</Icon>
              </ListItemSecondaryAction>}
            </ListItem>
          )
        })}
      </List>

      <Pagination startPage={startPage} selection={selectedTrack} pageSize={pageSize} collection={tracks} click={handleNext} />

    </div>
  );
}
ModalTrackList.defaultProps = {
  page: 1,
  selectionModel: [],
  pageSize: 10,
  menuClick: console.log,
  select: console.log
}