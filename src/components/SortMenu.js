import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Icon } from '@material-ui/core';

class SortMenu extends Component {
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

  handleClose = (field) => () => {
    this.props.update(field);
    this.setState({
      ...this.state,
      open: false,
      anchorEl: null
    });
  }

  componentDidMount() {
    this.setState({
      items: this.props.items
    })
  }
  render() {
    const { open, anchorEl } = this.state;
    const { items } = this.props;
    const sorter = items?.filter(s => s.isActive)[0];

    return !items ? (<b>loading...</b>) : (
      <div style={{ display: 'inline-block' }}>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
          <Icon>sort_by_alpha</Icon>  Sorted By {sorter?.Label}
        </Button>
        <Menu
          id="simple-menu"
          open={open}
          anchorEl={anchorEl}
          keepMounted
          onClose={this.handleClose}
        >
          {items.map(item => <MenuItem key={item.Label} onClick={this.handleClose(item.Field)}>
            {item.isActive && <Icon>check</Icon>}
            {item.Label}
          </MenuItem>)}
        </Menu>
      </div>
    );
  }
}

export {
  SortMenu
}
