const AppState = {
  LOADED: false,
  PLAYING: false
};

export {
  AppState
}


export function generateKey(Title) {
  if (!(Title && Title.replace)) {
    return '';
  }
  return Title.replace(/[\.\s-\/]/g, '').toLowerCase().trim().replace('the', '');
}

export function randomize(collection) {
  return collection.map(f => {
    return { f, b: Math.random() * collection.length };
  })
    .sort((a, b) => a.b > b.b ? 1 : -1).map(f => f.f);
}

