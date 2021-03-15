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