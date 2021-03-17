import { Subject } from 'rxjs';

const listViewOnClick$ = new Subject();
const listViewMenuClick$ = new Subject();
const playBegin$ = new Subject();
const playEnd$ = new Subject();

const listViewOnClick = listViewOnClick$.asObservable();
const listViewMenuClick = listViewMenuClick$.asObservable();
const playBegin = playBegin$.asObservable();
const playEnd = playEnd$.asObservable();


const playScalar = (track) => () => {
  listViewOnClick$.next({ items: [track], track, index: 0 });
}

export {
  listViewOnClick$,
  listViewOnClick,
  listViewMenuClick$,
  listViewMenuClick,
  playScalar,
  playBegin,
  playBegin$,
  playEnd,
  playEnd$
}