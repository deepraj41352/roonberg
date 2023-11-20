import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import { Button, Grid } from '@mui/material';

import axios from 'axios';

import { Store } from '../../Store';

import { useContext, useEffect, useState } from 'react';

const columns = [
  {
    field: 'first_name',
    headerName: 'Name',
    width: 100,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 100,
  },
  { field: 'role', headerName: 'Role', width: 150 },
];

export default function UserDataWidget(props) {
  const { state } = useContext(Store);
  const { toggleState } = state;

  const theme = toggleState ? 'dark' : 'light';

  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          className={`tableBg mx-2 ${theme}DataGrid`}
          rows={props.userData}
          columns={[...columns]}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
