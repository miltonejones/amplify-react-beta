
import { Link } from 'react-router-dom';

const TextOrLink = ({ path, id, text }) => {
  if (id) return <Link to={path + id}>{text}</Link>
  return text;
}

export { TextOrLink }