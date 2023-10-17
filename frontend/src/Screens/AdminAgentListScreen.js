import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Toast,
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, categoryData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case 'FATCH_CATEGORY':
      return { ...state, categoryDatas: action.payload };
    //   case "CATEGORY_CRATED_REQ":
    //     return { ...state, isSubmiting: true }
    default:
      return state;
  }
};

function AdminEditAgent() {
  const [selectcategory, setSelectCategory] = React.useState('');
  const { id } = useParams();
  if (id) {
    console.log('id exists:', id);
  } else {
    console.log('id does not exist');
  }

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { toggleState, userInfo } = state;
  const navigate = useNavigate();
  const role = 'agent';
  const theme = toggleState ? 'dark' : 'light';
  const [isModelOpen, setIsModelOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState();
  const [password, setPassword] = useState('');
  const [selectcategory, setSelectCategory] = useState();

  const [
    {
      loading,
      error,
      categoryData,
      categoryDatas,
      successDelete,
      successUpdate,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    categoryData: {},
    successDelete: false,
    successUpdate: false,
    isSubmiting: false,
    categoryDatas: [],
  });

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // const [status, setStatus] = useState(userInfo.email);
  // const [selectedFile, setSelectedFile] = useState("");

  const [isSubmiting, setIsSubmiting] = useState(false);

  // State variable to hold the selected status
  const [status, setStatus] = useState('');

  // useEffect to update the status when the API data changes

  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/user/${id}`);
        const datas = response.data;
        setFirstName(datas.first_name);
        setLastName(datas.last_name || 'Last Name');
        setEmail(datas.email);
        setStatus(datas.userStatus);

        // setStatus(datas.categoryStatus)
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    FatchcategoryData();
  }, []);

  React.useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        setSelectCategory(datas);
        dispatch({ type: 'FATCH_CATEGORY', payload: datas });
      } catch (error) {
        console.log(error);
      }
    };
    FatchCategory();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const formDatas = new FormData();

    // formDatas.append("categoryImage", selectedFile);
    formDatas.append('first_name', firstName);
    formDatas.append('last_name', lastName);
    formDatas.append('email', email);
    formDatas.append('status', status);

    try {
      const data = await axios.put(`/api/user/update/${id}`, formDatas, {
        headers: {
          'content-type': 'multipart/form-data',

          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success(data.data);
      console.log(data);
      // navigate('/adminAgentList')
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <>
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
            Add Agent
          </Button>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              className={`tableBg mx-2 ${theme}DataGrid`}
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
              }}
            >
              <Form onSubmit={handleSubmit}>
                <ImCross
                  color="black"
                  className="formcrossbtn"
                  onClick={handleCloseRow}
                />
                <h4 className="d-flex justify-content-center text-dark">
                  Add Agent
                </h4>
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
                  type="email"
                  fullWidth
                />
                <TextField
                  className="mb-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  type="password"
                  fullWidth
                />

                <FormControl>
                  <InputLabel>Choose Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="">SELECT STATUS</MenuItem>
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Choose Category</InputLabel>
                  <Select
                    value={selectcategory}
                    onChange={(e) => setSelectCategory(e.target.value)}
                  >
                    {categoryData.map((items) => (
                      <MenuItem key={items._id} value={items._id}>
                        {items.categoryName}
                      </MenuItem>
                    ))}
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
                  {submitting ? 'Adding Agent...' : 'Add Agent'}
                </Button>
              </Form>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
}

export default AdminEditAgent;
