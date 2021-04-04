import { Caption, footers } from './Caption';
import { useHistory } from 'react-router-dom';
import { Badge } from '@material-ui/core';

const DEFAULT_IMAGE = 'http://ullify.com/assets/cdrom-unmount.png';

export default function Thumbnail(props) {
  const { editing, select, artist, type, href } = props;
  const history = useHistory();
  let className = ['thumbnail-item'];
  const image = artist?.image || artist?.genreImage || DEFAULT_IMAGE;
  const footer = footers[type]?.(artist);
  const title = artist?.Name || artist?.Title;
  const count = artist.trackCount || artist.Count;
  const address = `/show/${href}/${artist.listKey || artist.ID || artist.genreKey}`;
  const go = (loc) => {
    if (editing) {
      return select(artist);
    }
    history.push(loc);
  }
  if (editing) className.push('editing');
  if (artist.selected) className.push('selected');
  className = className.join(' ');
  return <div className={className} onClick={() => go(address)}>
    <Badge max={9999} color="secondary" badgeContent={count}>
      <img className="standard-button" src={image} alt={title} />
    </Badge>
    <Caption text={title} />
    <div className="caption-footer-line">{footer}
    </div>
  </div>;
}