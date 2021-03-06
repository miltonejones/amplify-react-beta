import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import { Icon } from '@material-ui/core';


class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(event) {
    this.setState({
      ...this.state,
      open: !this.state.open,
      anchorEl: event.currentTarget
    });
  }

  handleClose() {
    this.setState({
      ...this.state,
      open: false,
      anchorEl: null
    });
  }

  componentDidMount() {

    this.setState({
      items: this.props.items?.filter(item => item.Count > 400)
    })
  }
  render() {
    const { open, anchorEl, items } = this.state;

    return !items ? (<b>loading...</b>) : (
      <div>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
          <Icon>local_offer</Icon>   Browse Music by Genre...
      </Button>
        <Menu
          id="simple-menu"
          open={open}
          anchorEl={anchorEl}
          keepMounted
          onClose={this.handleClose}
        >
          {items.map(item => <MenuItem key={item.Name} onClick={this.handleClose}><Link to={`/show/Genre.html/${item.genreKey}`}>{item.Name} ({item.Count}</Link>)</MenuItem>)}
          <MenuItem onClick={this.handleClose}><Link to="/list/Genre.html">View all genres...</Link></MenuItem>
        </Menu>
      </div>
    );
  }
}

export {
  NavMenu
}


