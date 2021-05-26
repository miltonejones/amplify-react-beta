import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import { addQueueRequest$ } from "../util/Events";
import { LocalApi } from "../data/LocalApi";

function ListItemLink(props) {
  const { icon, primary, secondary, to } = props;

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to]
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

const TrackMenu = ({ track }) => {
  const nodes = [
    {
      label: "View Artist",
      when: !!track?.artistFk,
      footer: track?.artistName,
      icon: "people",
      path: `/show/Artist.html/${track.artistFk}`,
    },
    {
      label: "View Album",
      when: !!track?.albumFk,
      footer: track?.albumName,
      icon: "album",
      path: `/show/Album.html/${track.albumFk}`,
    },
    {
      label: "View Genre",
      when: !!track?.genreKey,
      footer: track?.Genre,
      icon: "local_offer",
      path: `/show/Genre.html/${track.genreKey}`,
    },
  ].filter((f) => f.when);

  const cache = () => {
    LocalApi.cache(track).then((d) => {
      console.log(d);
    });
  };

  return (
    <List>
      {nodes.map((node) => {
        return (
          <ListItemLink
            icon={node.icon}
            key={node.label}
            secondary={node.footer}
            primary={node.label}
            to={node.path}
          />
        );
      })}
      <ListItem onClick={() => addQueueRequest$.next(track)}>
        <ListItemAvatar>
          <Avatar>
            <Icon>add</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Add to queue" />
      </ListItem>
      <ListItem onClick={cache}>
        <ListItemAvatar>
          <Avatar>
            <Icon>
              {!!track.cache?.length
                ? "file_download_done"
                : "download_for_offline"}
            </Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            (!!track.cache?.length ? "Remove " : "Download ") + track.Title
          }
        />
      </ListItem>
    </List>
  );
};

export { TrackMenu };
