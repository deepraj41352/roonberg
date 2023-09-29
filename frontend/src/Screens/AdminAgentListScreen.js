import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import { Button, Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form, Toast } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';

import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: false }
    case "FATCH_SUCCESS":
      return { ...state, AgentData: action.payload, loading: false }
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "DELETE_SUCCESS":
      return { ...state, deleteSuccess: false, loading: false }
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







export default function AdminAgentListScreen() {

  const role = "agent";
  const { state } = React.useContext(Store);
  const { userInfo } = state;
  const id = userInfo._id;
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewAgent, setIsNewAgent] = React.useState(false);
  const [{ loading, error, AgentData }, dispatch] = React.useReducer(reducer, { deleteSuccess: false, loading: false, error: '', AgentData: [] })
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


  // const deleteHandle = async (agentId) => {
  //   if (window.confirm('Are you sure to delete ?')) {
  //     try {
  //       const datas = await axios.delete(`/api/user/${id}`,
  //         { headers: { Authorization: `Bearer ${userInfo.token}` } })

  //       if (datas.status === 200) {
  //         toast.success("Agent data deleted successfully!");
  //         setData((prevData) => prevData.filter(row => row._id !== agentId));
  //         dispatch({ type: "DELETE_SUCCESS" });
  //       } else {
  //         toast.error("Failed to delete agent data.");
  //       }
  //     } catch (error) {
  //       toast.error(data.message)
  //     }
  //   }
  // };
  const deleteHandle = async () => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/user/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        if (response.status === 200) {
          toast.success("Agent data deleted successfully!");

          // Update the data state by excluding the deleted row
          setData((prevData) => prevData?.filter(row => row._id !== id));
        } else {
          toast.error("Failed to delete agent data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting agent data.");
      }
    }
  };


  const handleSaveAgent = async () => {

    try {
      const response = await axios.put(`/api/user/update/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      if (response.status === 200) {
        toast.success("Agent data updated successfully!");
        setIsModelOpen(false);


        FatchAgentData();
      } else {
        toast.error("Failed to update agent data.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating agent data.");
    }
  };

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
              onChange={(e) => setSelectedRowData({ ...selectedRowData, first_name: e.target.value })}
              label="Username"
              fullWidth
            />

            <TextField
              className="mb-2"
              value={
                isNewAgent ? '' : selectedRowData ? selectedRowData.email : ''
              }

              onChange={(e) => setSelectedRowData({ ...selectedRowData, email: e.target.value })}
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
              onChange={(e) => setSelectedRowData({ ...selectedRowData, status: e.target.value })}
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
