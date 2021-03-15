import React from 'react';
import axios from 'axios';
import Thumbnail from './thumbnail/Thumbnail';
import { ARTIST_API_ADDRESS } from '../Constants';
import clsx from 'clsx';
import { AppState, generateKey } from '../util/State';


export default class ArtistList extends React.Component {

  cacheType = '';

  constructor(props) {
    super(props);
    this.state = {
      artists: []
    };
  }
  getType() {
    return this.props.type.replace('.html', '').toLowerCase();
  }
  componentDidUpdate() {
    if (this.cacheType !== this.getType()) {
      this.cacheType = this.getType();
      this.loadComponentList();
    }
  }
  loadComponentList() {
    axios.get(ARTIST_API_ADDRESS + this.getType())
      .then(res => {
        const artists = res.data;
        artists.map(f => f.listKey = generateKey(f.Title));
        console.log(artists)
        this.setState({ artists });
      });
  }
  componentDidMount() {
    this.loadComponentList();
  }
  render() {
    return (
      <div className={clsx("thumbnail-view", {
        ['open']: this.props.open,
        ['collapsed']: AppState.PLAYING
      })}>
        { this.state.artists.map((artist, k) => <Thumbnail href={this.props.type} type={this.cacheType} artist={artist} key={k} />)}
      </div>
    )
  }
}

