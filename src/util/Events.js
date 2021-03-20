import { Subject } from 'rxjs';

const playbackRequest$ = new Subject();
const listViewMenuClick$ = new Subject();
const playBegin$ = new Subject();
const playEnd$ = new Subject();

const playbackRequest = playbackRequest$.asObservable();
const listViewMenuClick = listViewMenuClick$.asObservable();
const playBegin = playBegin$.asObservable();
const playEnd = playEnd$.asObservable();


const playScalar = (track) => () => {
  playbackRequest$.next({ items: [track], track, index: 0 });
}

export {
  playbackRequest$,
  playbackRequest,
  listViewMenuClick$,
  listViewMenuClick,
  playScalar,
  playBegin,
  playBegin$,
  playEnd,
  playEnd$
}