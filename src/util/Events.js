import { Subject } from 'rxjs';

const listViewOnClick$ = new Subject();
const listViewOnClick = listViewOnClick$.asObservable();
const listViewMenuClick$ = new Subject();
const listViewMenuClick = listViewMenuClick$.asObservable();


export {
  listViewOnClick$,
  listViewOnClick,
  listViewMenuClick$,
  listViewMenuClick
}