import { useMediaQuery } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { openMenuRequest$ } from "../util/Events";
import ModalTrackList from "./modal/ModalTrackList";

function ResponsiveDataGrid({ dupes, click, change, objects, checkboxes, select, cols, selectionModel, pageSize }) {
  const matches = useMediaQuery('(max-width:600px)');
  const collect = dupes ? objects : objects?.filter(p => !p.duplicate)
  if (matches) {
    return (
      <ModalTrackList
        page
        pageSize={pageSize}
        menuClick={(a) => openMenuRequest$.next(a)}
        tracks={collect}
        selectionModel={selectionModel}
        select={select} />
    )
  }
  return (
    <DataGrid
      onCellClick={click}
      selectionModel={selectionModel}
      onSelectionModelChange={change}
      rows={collect}
      checkboxSelection={checkboxes}
      columns={cols}
      pageSize={pageSize} />
  )
}
ResponsiveDataGrid.defaultProps = {
  change: (a) => console.log(['change.default!!', a]),
  select: (a) => console.log(['select.default!!', a]),
}
export {
  ResponsiveDataGrid
}