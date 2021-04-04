

const stripExt = (value) => {
  if (!(value && value.replace)) {
    return '';
  }
  const stripped = value.replace(/(\.mp3|\.opus|\.ogg)/g, '');
  if (stripped) {
    return stripped;
  }
  return value;
}

const organize = (list, tracks) => {
  const output = [];
  list.related?.map((track, i) => {
    const found = tracks.filter(f => stripExt(f.FileKey) === stripExt(track))[0];
    if (found) {
      const exist = output.filter(o => o.FileKey === found.FileKey)[0];
      if (exist) {
        return null;
      }
      found.trackNumber = i + 1;
      output.push(found);
    }
    return found;
  });
  return output;
}


export {
  organize,
  stripExt
}