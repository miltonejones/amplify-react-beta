const AppState = {
  LOADED: false,
  PLAYING: false,
  SOURCE: null,
  TRACK: {},
  LOCALE: []
};

export {
  AppState
}


export function generateKey(Title) {
  if (!(Title && Title.replace)) {
    return '';
  }
  return Title.replace(/[.\s-/]/g, '').toLowerCase().trim().replace('the', '');
}

export function randomize(collection) {
  return collection.map(f => {
    return { f, b: Math.random() * collection.length };
  })
    .sort((a, b) => a.b > b.b ? 1 : -1).map(f => f.f);
}

export function sortObjects(items, type) {
  // 
  const sorter = ListItemSorts[type];
  const field = !sorter ? 'trackNumber' : sorter.replace('^', '');
  const objects = items?.sort((a, b) => sorter?.indexOf('^') > 0 ? (b[field] - a[field]) : (a[field] - b[field]));
  objects.map(obj => obj.id = obj.ID);
  return objects;
}


export function mmss(value, exponent) {
  if (isNaN(value)) return value;
  if (exponent) value = value / exponent;
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60);
  const minutes = mins < 10 ? `0${mins}` : mins;
  const seconds = secs < 10 ? `0${secs}` : secs;
  return `${minutes}:${seconds}`;
}


export const ListItemSorts = {
  artist: 'albumName',
  album: 'trackNumber',
  genre: 'artistName',
  library: 'ID^'
}
