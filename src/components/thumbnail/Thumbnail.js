import { Caption, footers } from './Caption';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'http://ullify.com/assets/cdrom-unmount.png';

export default function Thumbnail(props) {
  const image = props.artist?.image || props.artist?.genreImage || DEFAULT_IMAGE;
  const footer = footers[props.type]?.(props.artist);
  const title = props.artist?.Name || props.artist?.Title;
  const href = `/show/${props.href}/${props.artist.listKey || props.artist.ID || props.artist.genreKey}`;
  return <div className="thumbnail-item">
    <Link to={href}>
      <img src={image} alt={title} />
    </Link>
    <Caption text={title} />
    <div className="caption-footer-line">{footer}[{props.artist.listKey}]
    </div>
  </div>;
}