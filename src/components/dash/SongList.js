import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { DEFAULT_IMAGE } from '../../Constants';
import { playBegin } from '../../util/Events';
import './genre.css';

export default class SongList extends React.Component {

  sub = null;
  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  componentDidMount() {

    this.sub = playBegin.subscribe(state => {
      if (state) {
        this.setState({
          ...this.state,
          ...state
        })

      }
    })
  }


  render() {
    const { objects, play } = this.props;
    const data = objects?.data;
    // 
    const items = !(data && data.length) ? [] : data.slice(0, 6); // randomize(data).slice(0, 6)
    return !data ? (<LinearProgress />) : (
      <div className="genre-song-list"  >
        {items.map(item => <div key={item.ID} onClick={play(item)}
          className="standard-button genre-song-item" >
          <div className="genre-song-item-photo">
            <img alt={item.Title} src={item.albumImage || DEFAULT_IMAGE} />
          </div>
          <div className="genre-song-item-title standard-link" >
            {item.Title}
          </div>
          <div className="genre-song-item-artist" >
            {item.artistName}
          </div>
          <div className="genre-song-item-album" >
            {item.albumName}
          </div>
        </div>)}
      </div>
    )
  }
}

/**
 **ngFor="let item of dataList"
 *
    [style.background-image]="'url(' + i.image + ')'"
 *  *ngFor="let i of dataList"
 */