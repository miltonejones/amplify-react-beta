import React from 'react';
import { query } from '../../AmplifyData';
import { generateKey } from '../../util/State';
import './banner.css';

export default class PlaylistBanners extends React.Component {

  cacheType = '';

  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }

  componentDidUpdate() {
  }
  loadComponentList() {
    query('playlist')
      .then(res => {
        const objects = res.data.filter(f => !!f.image).slice(0, 6);
        objects.map(f => f.listKey = generateKey(f.Title));
        console.log(objects)
        this.setState({ objects });
      });
  }
  componentDidMount() {
    this.loadComponentList();
  }
  render() {
    return (
      <div className="banner-container">
        {this.state.objects.map(i => <div key={i.Title} className="banner" style={{ backgroundImage: 'url(' + i.image + ')' }}>
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