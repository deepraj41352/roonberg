import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import { Button, Grid } from '@mui/material';

import axios from 'axios';

import { useContext, useEffect, useState } from 'react';
import { Store } from '../../Store';

const columns = [
  {
    field: 'projectName',
    headerName: 'Name',
    width: 100,
  },
  {
    field: 'projectDescription',
    headerName: 'Description',
    width: 100,
  },
  { field: 'projectCategory', headerName: 'Categories', width: 150 },
  { field: 'projectStatus', headerName: 'Status', width: 150 },
];

export default function ProjectDataWidget(props) {
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const [filterData, setFilterData] = useState([]);
  const theme = toggleState ? 'dark' : 'light';

  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          className={`tableBg mx-2 ${theme}DataGrid`}
          rows={props.projectData}
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
