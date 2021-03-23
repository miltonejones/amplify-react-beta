import React from 'react';
import { getPlaylist, query } from '../../AmplifyData';
import { playbackRequest$ } from '../../util/Events';
import { generateKey, randomize } from '../../util/State';
import './banner.css';

export default class PlaylistBanners extends React.Component {

  cacheType = '';

  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
    this.getPlaylist = this.getPlaylist.bind(this);
  }

  getPlaylist(data) {
    return () => getPlaylist(data).then(items => {
      const index = 0;
      const track = items[index];
      playbackRequest$.next({ items, track, index });
    })
  }

  componentDidUpdate() {
  }
  loadComponentList() {
    const { mobile } = this.props;
    query('playlist')
      .then(res => {
        const objects = randomize(res.data.filter(f => !!f.image)).slice(0, mobile ? 3 : 6);
        objects.map(f => f.listKey = generateKey(f.Title));
        this.setState({ objects });
      });
  }
  componentDidMount() {
    this.loadComponentList();
  }
  render() {
    return (
      <div className="banner-container">
        {this.state.objects.map(i => <div onClick={this.getPlaylist(i.listKey)} key={i.Title} className="banner standard-button" style={{ backgroundImage: 'url(' + i.image + ')' }}>
          {i.Title}
          <div className="material-icons">
            volume_up
          </div>
        </div>)}
      </div>
    )
  }
}
