import React from 'react';
import Thumbnail from './thumbnail/Thumbnail';
import { AppState, generateKey } from '../util/State';
import { query, search } from '../AmplifyData';
import { createCrumb, PageBreadcrumbs } from './Breadcrumb';
import InfiniteScroll from "react-infinite-scroll-component";
import { ThumbViewSorters } from './Sorters'
import { SortMenu } from './SortMenu';

const map = {
  artists: 'Artist.html',
  albums: 'Album.html'
}
export default class ArtistList extends React.Component {

  cacheType = '';
  findType = '';
  start = 0;
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      items: []
    };
  }

  fetchMoreData = () => {
    setTimeout(() => {
      this.start += 100;
      this.setState({
        ...this.state,
        items: this.state.items.concat(
          this.state.artists.slice(this.start, this.start + 100)
        )
      });
    }, 1);
  };


  getType() {
    return this.props.type.replace('.html', '').toLowerCase();
  }

  componentDidUpdate() {
    if (this.cacheType !== this.getType() && !this.props.type) {
      this.cacheType = this.getType();
      this.loadComponentList();
    }
    if (this.props.type && this.findType !== this.props.type) {
      this.findType = this.props.type;
      this.loadComponentList();
    }
  }
  searchComponentList() {
    search(this.props.param, this.props.type).then(res => {

      let artists = res.data.items.map(item => {
        return {
          Name: item.Title,
          ID: item.Key,
          trackCount: item.count,
          image: item.image,
          artistName: item.Artist
        };
      })
      const href = map[this.props.type];
      this.cacheType = this.props.type.substr(0, this.props.type.length - 1);
      this.setState({
        ...this.state, artists, href, crumb: {
          label: res.data.label
        }
      });
    });
  }

  sortUpdate = (Field) => {
    const sorters = this.state.sorter;
    let artists = this.state.artists;
    sorters.map(s => {
      s.isActive = s.Field === Field;
      if (s.isActive) {
        s.isASC = -s.isASC
      }
    });
    artists = this.sortBy(sorters, artists);
    const items = artists.slice(0, 100);
    this.start = 0;
    this.setState({ ...this.state, artists, items });
  }

  sortBy(sorters, collection) {
    const sorter = sorters.filter(s => s.isActive)[0];
    if (sorter) {
      const first = collection[0];
      if (sorter.Field in first) {
        const apply = (a, b) => sorter.isASC * (a[sorter.Field] > b[sorter.Field] ? -1 : 1)
        const out = collection.sort(apply);
        return out;
      }
      alert(`${sorter.Field} not found! Check the console`);
      console.log(first);
    }
    console.log(sorter);
  }

  loadComponentList() {
    if (this.props.param) {
      this.searchComponentList();
      return;
    }
    query(this.getType())
      .then(res => {
        let artists = res.data;
        artists.map(f => f.listKey = generateKey(f.Title));
        const crumb = createCrumb(this.props.type);
        const sorter = ThumbViewSorters[this.getType()];
        artists = this.sortBy(sorter, artists);
        const items = artists.slice(0, 100);
        this.cacheType = this.getType();
        this.setState({ ...this.state, items, sorter, artists, crumb, href: this.props.type });
        console.log({ sorter })
      });
  }


  componentDidMount() {
    this.loadComponentList();
    // this.setSorter();
  }

  render() {
    const { sorter, crumb, href, items } = this.state;
    const className = ['thumbnail-view'];
    if (this.props.open) className.push('open');
    if (AppState.PLAYING) className.push('collapsed');
    return (
      <div>

        <div class="upper-menu">
          <div class="upper-menu-left">
            <PageBreadcrumbs open={this.props.open} crumb={crumb} />
          </div>
          <div class="upper-menu-right">
            {sorter?.length && <SortMenu update={this.sortUpdate} items={sorter} />}
          </div>
        </div>

        <div id="thumbnail-view" className={className.join(' ')}>
          <InfiniteScroll
            dataLength={this.state.items.length}
            next={this.fetchMoreData}
            scrollableTarget="thumbnail-view"
            hasMore
            loader={<h4>Loading...</h4>}
          >
            {items.map((artist, k) => <Thumbnail href={href} type={this.cacheType} artist={artist} key={k} />)}
          </InfiniteScroll>
        </div>

      </div>
    )
  }
}

