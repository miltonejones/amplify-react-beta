import React from 'react';
import { randomize } from '../../util/State';
import './genre.css';

export default class SongList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }


  render() {
    const { objects, play } = this.props;
    const data = objects?.data;
    // console.log(data);
    const items = !(data && data.length) ? [] : randomize(data).slice(0, 6)
    return !data ? (<b>loading...</b>) : (
      <div className="genre-song-list"  >
        {items.map(item => <div key={item.ID} className="standard-button genre-song-item" >
          <div className="genre-song-item-photo" onClick={play(item)}>
            <img src={item.albumImage} />
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