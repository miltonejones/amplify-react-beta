import { Component } from 'react';
import { Link } from 'react-router-dom';
import appRoutes from '../../Routes';

class LinkList extends Component {
  constructor(props) {
    super(props);
    this.nodes = appRoutes.filter(f => f.data?.home).map(route => {
      return {
        path: route.data?.prefix + route.path,
        icon: route.data?.icon,
        label: route.data?.label
      }
    });
  }
  render() {
    return (
      <div className="home-link-list">
        {this.nodes.map(node => <div key={node.path} className="home-link-list-item">
          <span className="material-icons">{node.icon}</span>
          <Link to={node.path} className="standard-link">{node.label}</Link>
        </div>)}
      </div>
    );
  }
}


export default LinkList;
