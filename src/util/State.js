const AppState = {
  LOADED: false,
  PLAYING: false,
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
  // console.log({ type, items })
  const sorter = ListItemSorts[type];
  const field = !sorter ? 'trackNumber' : sorter.replace('^', '');
  const objects = items?.sort((a, b) => sorter?.indexOf('^') > 0 ? (b[field] - a[field]) : (a[field] - b[field]));
  objects.map(obj => obj.id = obj.ID);
  return objects;
}

export const ListItemSorts = {
  artist: 'albumName',
  album: 'trackNumber',
  genre: 'artistName',
  library: 'ID^'
}
