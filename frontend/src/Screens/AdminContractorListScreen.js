import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import Validations from '../Components/Validations';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, constructorData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'DELETE_SUCCESS':
      return { ...state, successDelete: action.payload };

    case 'DELETE_RESET':
      return { ...state, successDelete: false };

    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case 'FATCH_SUBMITTING':
      return { ...state, submitting: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: '_id', headerName: 'ID', width: 250 },
  {
    field: 'first_name',
    headerName: 'constractor',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'userStatus',
    headerName: 'Status',
    width: 100,
  },
];

export default function AdminContractorListScreen() {
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const navigate = useNavigate();
  const role = 'contractor';
  const [isModelOpen, setIsModelOpen] = useState(false);
  const theme = toggleState ? 'dark' : 'light';

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');

  const [
    {
      loading,
      error,
      constructorData,
      successDelete,
      successUpdate,
      submitting,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',

    constructorData: [],
    successDelete: false,
    successUpdate: false,
    submitting: false,
  });

  useEffect(() => {
    const FatchconstractorData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.post(
          `/api/user/`,
          { role: role },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const datas = response.data;
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            first_name: items.first_name,
            email: items.email,
            userStatus: items.userStatus ? 'Active' : 'Inactive',
          };
        });
        dispatch({ type: 'FATCH_SUCCESS', payload: rowData });
      } catch (error) {
        console.log(error);
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else if (successUpdate) {
      dispatch({ type: 'UPDATE_RESET' });
    } else {
      FatchconstractorData();
    }
  }, [successDelete, successUpdate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'FATCH_SUBMITTING', payload: true });
    try {
      const response = await axios.post(
        `/api/user/add`,
        {
          first_name: name,
          last_name: lastname,
          last_name: lastname,
          email: email,
          password: password,
          password: password,
          role: role,
          userStatus: status,
          userStatus: status,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log(response);
      console.log(response);
      if (response.status === 200) {
        toast.success('Contractor added Successfully !');
        setIsModelOpen(false);
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
        dispatch({ type: 'FATCH_SUBMITTING', payload: false });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
      dispatch({ type: 'FATCH_SUBMITTING', payload: false });
    }
  };
  // --------------------------
  const deleteHandle = async (userid) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/user/${userid}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success('constractor data deleted successfully!');
          dispatch({
            type: 'DELETE_SUCCESS',
            payload: true,
          });
        } else {
          toast.error('Failed to delete constractor data.');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting constractor data.');
      }
    }
  };

  const handleEdit = (userid) => {
    navigate(`/adminEditContractor/${userid}`);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleModel = () => {
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="px-3 mt-3">
        {loading ? (
          <>
            <div className="ThreeDot">
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                className="ThreeDot justify-content-center"
                color="#0e0e3d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          </>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            <Button
              variant="outlined"
              className=" m-2 d-flex globalbtnColor"
              onClick={handleModel}
            >
              <BiPlusMedical className="mx-2" />
              Add Contractor
            </Button>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                className={`tableBg mx-2 ${theme}DataGrid`}
                rows={constructorData}
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
                            startIcon={<MdEdit />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            className="mx-2 tableDeletebtn"
                            onClick={() => deleteHandle(params.row._id)}
                            startIcon={<AiFillDelete />}
                          >
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
                className="modelBg modalRespnsive"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Form onSubmit={handleSubmit}>
                  <ImCross
                    color="black"
                    className="formcrossbtn"
                    onClick={handleCloseRow}
                  />

                  <h4 className="d-flex justify-content-center">
                    Add Contractor
                  </h4>

                  <TextField
                    className="mb-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="FirstName"
                    fullWidth
                  />
                  <TextField
                    className="mb-2"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    label="LastName"
                    fullWidth
                  />

                  <TextField
                    className="mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    type="email"
                    fullWidth
                  />
                  <Validations type="email" value={email} />
                  <TextField
                    className="mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    type="password"
                    fullWidth
                  />
                  <Validations type="password" value={password} />
                  <FormControl className="formselect">
                    <InputLabel>Choose Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  <br></br>
                  <Button
                    className="mt-2 formbtn"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding Contractor...' : 'Add Contractor'}
                  </Button>
                </Form>
              </Box>
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
