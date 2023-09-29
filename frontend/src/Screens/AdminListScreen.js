import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import data from '../dummyData';
import { Button, Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import axios from 'axios';

const columns = [
  { field: '_id', headerName: 'ID', width: 80 },
  {
    field: 'first_name',
    headerName: 'Admin Name',
    width: 100,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 100,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
  },
]

const deleteHandle = async () => {
  if (window.confirm('Are you sure to delete ?')) {
    try {
    } catch (error) { }
  }
};



export default function AdminListScreen() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewAdmin, setIsNewAdmin] = React.useState(false);
  const role = "admin";
  const [data, setData] = React.useState([]);


  const handleEdit = (params) => {
    setSelectedRowData(params);
    setIsModelOpen(true);
    setIsNewAdmin(false);

  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewAdmin(true);
  };

  const handleSubmitNewAdmin = () => {
    setIsModelOpen(false);
  };

  React.useEffect(() => {
    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: role });
        const datas = response.data
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,

          }
        })

        setData(rowData);
      } catch (error) {
        console.log(error)
      }
    }
    FatchAgentData();

  }, []);


  // React.useEffect(() => {

  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/admindata'); 
  //       if (response.ok) {
  //         const data = await response.json();
  //         setAdminData(data);
  //       } else {
  //         console.error('Failed to fetch data');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}>
        <BiPlusMedical className='mx-2' />
        Add Admin
      </Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          className="tableBg mx-2"
          rows={data}
          columns={[
            ...columns,
            {
              field: 'action',
              headerName: 'Action',
              width: 250,
              renderCell: (params) => {
                return (
                  <Grid item xs={8}>
                    <Button
                      variant="contained"
                      className="mx-2 tableEditbtn"
                      onClick={() => handleEdit(params.row)}
                      startIcon={<MdEdit />}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      className="mx-2 tableDeletebtn"
                      onClick={deleteHandle}
                      startIcon={<AiFillDelete />}>
                      Delete
                    </Button>
                  </Grid>
                );
              },
            },
          ]}
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
      <Modal open={isModelOpen} onClose={handleCloseRow}>
        <Box
          className="modelBg"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
          <Form>
            {isNewAdmin ? (
              <h4 className="d-flex justify-content-center">
                Add new Admin Details
              </h4>
            ) : (
              <h4 className="d-flex justify-content-center">
                Edit Admin Details
              </h4>
            )}
            <TextField
              className="mb-2"
              value={
                isNewAdmin
                  ? ''
                  : selectedRowData
                    ? selectedRowData.first_name
                    : ''
              }
              label="Username"
              fullWidth
            />

            <TextField
              className="mb-2"
              value={
                isNewAdmin ? '' : selectedRowData ? selectedRowData.email : ''
              }
              label="Email"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewAdmin
                  ? ''
                  : selectedRowData
                    ? selectedRowData.status
                    : ''
              }
              label="User Status"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitNewAdmin}
              onChange={(e) => e.target.value}>
              {isNewAdmin ? 'Add Admin' : 'Save Changes'}
            </Button>
          </Form>
        </Box>
      </Modal>
    </>
  );
}
