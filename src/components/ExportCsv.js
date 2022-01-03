import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function ExportDataGrid(porps) {
  const {
    rows,
    columns,
    pageSize,
    rowsPerPageOptions,
    disableSelectionOnClick = true,
   } = porps;

  return (
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        disableSelectionOnClick={disableSelectionOnClick}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
  );
}
