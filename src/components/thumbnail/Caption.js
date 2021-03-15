

const footers = {
  artist: (obj) => `${obj.albumCount} albums, ${obj.trackCount} tracks`,
  album: (obj) => `${obj.artistName}, ${obj.trackCount} tracks`,
  genre: (obj) => `${obj.Count} tracks`,
  playlist: (obj) => `${obj.trackCount} tracks`,
}
export function parseLine(words, limit) {
  let count = 0;
  const tmp = [];
  while (count < limit && !!words.length) {
    tmp.push(words.shift());
    count = tmp.join(' ').length;
  }
  return tmp.join(' ');
}
export function parseLines(value) {
  const words = value.split(' ');
  return [parseLine(words, 12), parseLine(words, 20)];
}
function Caption(props) {
  const lines = parseLines(props.text);
  return (
    <div className="caption-title-lines">
      {lines.map((line, k) => <div key={k} className="caption-title-line">{line}</div>)}
    </div>
  );
}

export {
  Caption,
  footers
}