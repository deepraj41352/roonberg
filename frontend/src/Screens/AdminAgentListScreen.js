import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import data from '../dummyData';
import { Button, Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form, Toast } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: false }
    case "FATCH_SUCCESS":
      return { ...state, AgentData: action.payload, loading: false }
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false }
  }
}

const columns = [
  { field: '_id', headerName: 'ID', width: 80 },
  {
    field: 'first_name',
    headerName: 'Agent Name',
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
  // {
  //   field: 'email',
  //   headerName: 'Email',
  //   width: 180,
  // },
  // {
  //   field: 'userStatus',
  //   headerName: 'User Status',
  //   width: 120,
  // },
  // {
  //   field: 'assignedCategory',
  //   headerName: 'Assigned Category',
  //   width: 150,
  // },
];

const deleteHandle = async () => {
  if (window.confirm('Are you sure to delete ?')) {
    try {
      const data = await axios.delete(`/api/user/${id}`)
      toast.success(data)
      console.log(data.message)
    } catch (error) {
    }
  }
};





export default function AdminAgentListScreen() {

  const role = "agent";
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewAgent, setIsNewAgent] = React.useState(false);
  const [{ loading, error, AgentData }, dispatch] = React.useReducer(reducer, { loading: false, error: '', AgentData: [] })
  const [data, setData] = React.useState([])


  const handleEdit = (params) => {
    setSelectedRowData(params);
    setIsModelOpen(true);
    setIsNewAgent(false);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewAgent(true);
  };

  const handleSaveAgent = () => {
    setIsModelOpen(false);
  };

  React.useEffect(() => {
    const FatchAgentData = async () => {
      try {
        const response = await axios.get(`/api/user/${role}`);
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


  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}>
        <BiPlusMedical className='mx-2' />
        Add Agent
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
                      onClick={() => deleteHandle(params.row._id)}
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
            {isNewAgent ? (
              <h4 className="d-flex justify-content-center">
                Add new Agent Details
              </h4>
            ) : (
              <h4 className="d-flex justify-content-center">
                Edit Agent Details
              </h4>
            )}
            <TextField
              className="mb-2"
              value={
                isNewAgent
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
                isNewAgent ? '' : selectedRowData ? selectedRowData.email : ''
              }
              label="Email"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewAgent
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
              onClick={handleSaveAgent}
              onChange={(e) => e.target.value}>
              {isNewAgent ? 'Add Agent' : 'Save Changes'}
            </Button>
          </Form>
        </Box>
      </Modal>
    </>
  );
}
