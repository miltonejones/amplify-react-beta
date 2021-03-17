import React from 'react';
import { getPlaylist, query } from '../../AmplifyData';
import { listViewOnClick$ } from '../../util/Events';
import { generateKey } from '../../util/State';
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

      listViewOnClick$.next({ items, track, index });
    })
  }

  componentDidUpdate() {
  }
  loadComponentList() {
    query('playlist')
      .then(res => {
        const objects = res.data.filter(f => !!f.image).slice(0, 6);
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

/**
 *
 *
    [style.background-image]="'url(' + i.image + ')'"
 *  *ngFor="let i of dataList"
 */