import { Subject } from 'rxjs';

const listViewOnClick$ = new Subject();
const listViewMenuClick$ = new Subject();
const playBegin$ = new Subject();

const listViewOnClick = listViewOnClick$.asObservable();
const listViewMenuClick = listViewMenuClick$.asObservable();
const playBegin = playBegin$.asObservable();


export {
  listViewOnClick$,
  listViewOnClick,
  listViewMenuClick$,
  listViewMenuClick,
  playBegin,
  playBegin$
}