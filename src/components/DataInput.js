import React, { Component, useState } from 'react';
import { Button, Collapse, Icon, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { query, search } from '../AmplifyData';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, ListItemAvatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    margin: '4px 0',
    display: 'flex',
    alignItems: 'center',
    width: 280,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  results: {
    listStyle: 'none',
    margin: 4,
    padding: 0,
    width: '100%',
    outline: 'dotted 1px red'
  },
}));

function SearchableInput({ value, close, type, find, items, choose, fields, create }) {
  const classes = useStyles();
  const [param, setParam] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [image, setImage] = useState('');
  const kind = type?.substr(0, type?.length - 1);
  const handleExp = () => {
    setExpanded(!expanded)
  }
  const handleChange = (arg) => {
    const value = arg?.target?.value;
    setImage(value)
    console.log({ image })
  }
  const handleKeyup = (arg) => {
    const keyCode = arg.keyCode;
    const param = arg.target?.value;
    if (keyCode === 13) {
      find(param);
      setParam(param);
    }
  }
  return (
    <div className="modal-data-input">
      <Paper component="div" className={classes.root}>
        {/* <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton> */}
        <InputBase
          defaultValue={value}
          className={classes.input}
          onKeyUp={handleKeyup}
          placeholder={type}
        />
        {/* <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" /> */}
        <IconButton onClick={() => close()} color="primary" className={classes.iconButton} aria-label="directions">
          <Icon>close</Icon>
        </IconButton>
      </Paper>

      {!!param?.length && (<div>
        <Button onClick={handleExp} size="small"> Add {param} as new {kind}</Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper component="div" className={classes.root}>
            <InputBase
              onChange={handleChange}
              className={classes.input}
              placeholder={`image for ${param}`}
            />
            <IconButton onClick={() => create(kind, param, image, ...fields)} color="primary" className={classes.iconButton} aria-label="directions">
              <Icon>save</Icon>
            </IconButton>
          </Paper>
        </Collapse>
      </div>)}

      {!!items?.length && (<Paper component="div" className={classes.root}>
        <ResultList items={items} choose={choose} fields={fields} />
      </Paper>)}

    </div>
  );
}

function ResultList({ items, choose, fields }) {
  return (<List dense component="nav" aria-label="main mailbox folders" >
    {!!items && items.map(track => {
      const { Key, Title, count, image } = track;
      const response = {
        [fields[0]]: Key,
        [fields[1]]: Title
      }
      return (
        <ListItem
          key={Key}
          onClick={() => choose(response)}
          style={{ margin: 0, padding: '0 8px' }}>
          <ListItemAvatar>
            <Avatar alt={Title} src={image} />
          </ListItemAvatar>
          <ListItemText key={Key} secondary={count + ' tracks'} primary={Title} />
        </ListItem>
      )
    })}
  </List>)
}

export default class DataInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    this.toggleEditing = this.toggleEditing.bind(this);
    this.searchBy = this.searchBy.bind(this);
    this.choose = this.choose.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
  }

  toggleEditing() {
    const { editing } = this.state;
    this.setState({ ...this.state, editing: !editing })
  }

  choose(answer) {
    const { select } = this.props;
    select(answer);
    this.setState({ items: [], editing: false });
  }

  searchBy(param) {
    const { type } = this.props;
    if (type === 'genres') {
      query('genre').then(res => {
        console.log(res.data, param)
        const genres = res.data.filter(g => g.Name.toLowerCase().indexOf(param.toLowerCase()) > -1)
          .map(g => {
            return { Key: g.genreKey, Title: g.Name, count: g.Count, image: g.genreImage }
          });

        this.setState({ ...this.state, items: genres.slice(0, 5) });
        console.log(genres)
      })
    }
    search(param, type).then(res => {
      this.setState({ ...this.state, items: res?.data?.items?.slice(0, 5) });
    });
  }

  handleKeyup(e) {
    console.log({ e })
  }

  render() {
    const { editing, items } = this.state;
    const { attr, text, immutable, change } = this.props;

    if (!editing) {
      return (
        <Typography onClick={this.toggleEditing} {...attr}>
          {text}
        </Typography>
      )
    }

    if (immutable) {
      return (
        <InputBase placeholder={text} onBlur={() => this.setState({ ...this.state, editing: !editing })} onChange={change} defaultValue={text} />
      )
    }

    return (
      <SearchableInput {...this.props} choose={(a) => this.choose(a)} items={items} find={this.searchBy} close={this.toggleEditing} value={text} />
    );
  }
}

