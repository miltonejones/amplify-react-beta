import React from 'react';
import Thumbnail from './thumbnail/Thumbnail';
import { AppState, generateKey } from '../util/State';
import { query } from '../AmplifyData';
import { createCrumb, PageBreadcrumbs } from './Breadcrumb';


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
    query(this.getType())
      .then(res => {
        const artists = res.data;
        artists.map(f => f.listKey = generateKey(f.Title));
        const crumb = createCrumb(this.props.type);
        console.log(crumb)
        this.setState({ artists, crumb });
      });
  }
  componentDidMount() {
    this.loadComponentList();
  }
  render() {
    const { artists, crumb } = this.state;
    const className = ['thumbnail-view'];
    if (this.props.open) className.push('open');
    if (AppState.PLAYING) className.push('collapsed');
    return (
      <div>
        <PageBreadcrumbs crumb={crumb} />
        <div className={className.join(' ')}>
          {artists.map((artist, k) => <Thumbnail href={this.props.type} type={this.cacheType} artist={artist} key={k} />)}
        </div>
      </div>
    )
  }
}

