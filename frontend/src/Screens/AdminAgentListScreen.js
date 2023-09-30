import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form, Toast } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { ImCross } from 'react-icons/im';

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true }
    case "FATCH_SUCCESS":
      return { ...state, AgentData: action.payload, loading: false }
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "DELETE_SUCCESS":
      return { ...state, successDelete: action.payload };

    case "DELETE_RESET":
      return { ...state, successDelete: false };

    case "UPDATE_SUCCESS":
      return { ...state, successUpdate: action.payload };

    case "UPDATE_RESET":
      return { ...state, successUpdate: false };

    default:
      return state;
  };

}

const columns = [
  { field: '_id', headerName: 'ID', width: 150 },
  {
    field: 'first_name',
    headerName: 'Agent Name',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
  },
];

export default function AdminAgentListScreen() {
  const role = "agent";
  const { state } = React.useContext(Store);
  const { userInfo } = state;
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewAgent, setIsNewAgent] = React.useState(false);
  const [{ loading, error, AgentData, successDelete, successUpdate }, dispatch] = React.useReducer(reducer,
    {
      loading: true,
      error: '',
      AgentData: [],
      successDelete: false,
      successUpdate: false
    })


  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [password, setPassword] = React.useState('');



  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewAgent(true);
  };

  const handleEdit = (userid) => {
    const agentToEdit = AgentData.find((agent) => agent && agent._id === userid);
    setName(agentToEdit ? agentToEdit.first_name : '');
    setEmail(agentToEdit ? agentToEdit.email : '');
    setStatus(agentToEdit ? agentToEdit.status : 'active');
    setSelectedRowData(agentToEdit);
    setIsModelOpen(true);
    setIsNewAgent(false);
  };

  React.useEffect(() => {
    const FatchAgentData = async () => {
      try {
        dispatch("FATCH_REQUEST")
        const response = await axios.post(`/api/user/`, { role: role });
        const datas = response.data
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            first_name: items.first_name,
            email: items.email,
            status: items.status,

          }
        })
        dispatch({ type: "FATCH_SUCCESS", payload: rowData })
      } catch (error) {
        console.log(error)
      }
    }
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" })
    }
    else if (successUpdate) {
      dispatch({ type: "UPDATE_RESET" })
    }
    else {
      FatchAgentData();
    }


  }, [successDelete, successUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isNewAgent) {
      const response = await axios.post(`/api/user/signup`, {
        first_name: name, email: email, password: password, role: role
      });
      if (response.status === 201) {
        toast.success("Agent added Successfully !");
        const datas = response.data;
        setIsModelOpen(false)
        dispatch({ type: "FATCH_SUCCESS", payload: datas })
        dispatch({ type: "UPDATE_SUCCESS", payload: true })

      }
    }
    else {
      const response = await axios.put(`/api/user/update/${selectedRowData._id}`,
        {
          first_name: name, email: email, role: role
        },

        { headers: { Authorization: `Bearer ${userInfo.token}` } }


      );

      if (response.status === 200) {
        toast.success(response.data);
        setIsModelOpen(false)
        dispatch({ type: "UPDATE_SUCCESS", payload: true })

      }
    }

  }

  const deleteHandle = async (userid) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/user/${userid}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        if (response.status === 200) {
          toast.success("Agent data deleted successfully!");
          dispatch({
            type: "DELETE_SUCCESS", payload: true
          })
        } else {
          toast.error("Failed to delete agent data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting agent data.");
      }
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading .....</div>
      ) : (error ? (
        <div>{error}</div>
      ) : (
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
              rows={AgentData}
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
                          onClick={() => handleEdit(params.row._id)}
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

              <Form onSubmit={handleSubmit}>
                <ImCross color='black' className='formcrossbtn' onClick={handleCloseRow} />
                {isNewAgent ? (
                  <h4 className="d-flex justify-content-center text-dark">
                    Add new Agent Details
                  </h4>
                ) : (
                  <h4 className="d-flex justify-content-center text-dark">
                    Edit Agent Details
                  </h4>
                )}
                <TextField
                  className="mb-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Username"
                  fullWidth
                />

                <TextField
                  className="mb-2"
                  value={email}

                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  fullWidth
                />
                {isNewAgent && <TextField
                  className="mb-2"
                  value={
                    password
                  }

                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  fullWidth
                />}

                <FormControl className='formselect'>

                  <Select value={status}
                    onChange={(e) => setStatus(e.target.value)} >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <br></br>
                <Button className='mt-2 formbtn'
                  variant="contained"
                  color="primary"

                  type='submit'>
                  {isNewAgent ? 'Add Agent' : 'Save Changes'}
                </Button>
              </Form>
            </Box>
          </Modal>
        </>
      ))}

    </>
  );
}
