import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tab from 'react-bootstrap/Tab';
import { ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import { GrSubtractCircle, GrAddCircle } from 'react-icons/gr';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
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
    case 'FATCH_CATEGORY':
      return { ...state, categoryData: action.payload };
    case 'FATCH_AGENTS':
      return { ...state, agentData: action.payload };
    case 'FATCH_CONTRACTOR':
      return { ...state, contractorData: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: '_id', headerName: 'ID', width: 90 },
  {
    field: 'projectName',
    headerName: 'Project Name',
    width: 150,
  },
  {
    field: 'projectDescription',
    headerName: 'Description',
    width: 150,
  },
  {
    field: 'projectCategory',
    headerName: 'Category',
    width: 150,
  },

  {
    field: 'projectOwner',
    headerName: 'Contractor',
    width: 90,
  },
  {
    field: 'assignedAgent',
    headerName: 'Agent',
    width: 90,
  },
];

export default function AdminProjectListScreen() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [
    {
      loading,
      error,
      projectData,
      successDelete,
      successUpdate,
      categoryData,
      agentData,
      contractorData,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    projectData: [],
    successDelete: false,
    successUpdate: false,
    categoryData: [],
    contractorData: [],
    agentData: [],
  });

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([
    { categoryId: '', agentName: '', agentId: '' },
  ]);
  const [categories, setCategories] = useState([]);
  const [projectStatus, setProjectStatus] = useState();

  const assignedAgentByCateHandle = (index) => {
    const category = agents[index].categoryId;
    if (category) {
      const selectedCategory1 = categoryData.find(
        (categoryItem) => categoryItem._id === category
      );
      if (selectedCategory1) {
        const agentForCategory = agentData.find(
          (agentItem) => agentItem.agentCategory === selectedCategory1._id
        );
        if (agentForCategory) {
          return [agentForCategory];
        }
      }
    }
    return [];
  };

  const handleAgentChange = (index, key, value) => {
    console.log('Value received:', value);
    const updatedAgents = [...agents];
    updatedAgents[index] = {
      ...updatedAgents[index],
      [key]: value,
    };

    const categoryName = categoryData.find(
      (categoryItem) => categoryItem._id === value
    );
    if (categoryName) {
      updatedAgents[index].categoryName = categoryName.categoryName;
    }

    const agentName = agentData.find((agentItem) => agentItem._id === value);
    if (agentName) {
      updatedAgents[index].agentName = agentName.first_name;
    }

    if (key === 'categoryId' && value !== '') {
      const selectedCategory = categoryData.find(
        (categoryItem) => categoryItem._id === value
      );

      if (selectedCategory) {
        const categoryObject = {
          categoryId: selectedCategory._id,
          categoryName: selectedCategory.categoryName,
        };
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[index] = categoryObject;
          return updatedCategories;
        });
      }
    }

    setAgents(updatedAgents);
  };

  const addAgent = () => {
    setAgents([...agents, { categoryId: '', agentId: '' }]);
  };
  const removeAgent = (index) => {
    const updatedAgents = [...agents];
    updatedAgents.splice(index, 1);
    setAgents(updatedAgents);
  };

  const handleEdit = (userid) => {
    navigate(`/adminEditProject/${userid}`);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setIsModelOpen(true);
    setIsNewProject(true);
  };

  useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        dispatch({ type: 'FATCH_CATEGORY', payload: datas });
      } catch (error) {
        console.log(error);
      }
    };
    FatchCategory();
  }, []);

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: 'contractor' });
        const datas = response.data;
        dispatch({ type: 'FATCH_CONTRACTOR', payload: datas });
      } catch (error) {}
    };
    FatchContractorData();
  }, []);

  useEffect(() => {
    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: 'agent' });
        const datas = response.data;
        dispatch({ type: 'FATCH_AGENTS', payload: datas });
      } catch (error) {}
    };
    FatchAgentData();
  }, []);

  useEffect(() => {
    const FatchProjectData = async () => {
      try {
        dispatch({ type: 'FATCH_REQUEST' });
        const response = await axios.get('/api/project', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        const rowData = datas.map((items) => {
          const contractor = contractorData.find(
            (contractor) => contractor._id === items.projectOwner
          );
          console.log('contractor', contractor);
          return {
            ...items,
            _id: items._id,
            projectName: items.projectName,
            projectDescription: items.projectDescription,
            projectCategory: items.projectCategory
              ? items.projectCategory.map((cat) => cat.categoryName)
              : '',
            assignedAgent: items.assignedAgent
              ? items.assignedAgent.map((agent) => agent.agentName)
              : 'Not Assigned',
            projectOwner: contractor ? contractor.first_name : '',
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
      FatchProjectData();
    }
  }, [successDelete, successUpdate, dispatch, userInfo.token, contractorData]);

  const projectActiveData = projectData.filter((item) => {
    return item.projectStatus === 'active';
  });
  const projectCompleteData = projectData.filter((item) => {
    return item.projectStatus === 'complete';
  });
  const projectQuedData = projectData.filter((item) => {
    return item.projectStatus === 'qued';
  });
  const assignedAgent = projectData.filter((item) => {
    return item.assignedAgent.length === 0;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    console.log('agents', agents);
    console.log('categories', categories);
    try {
      const response = await axios.post(
        '/api/project/admin/addproject',
        {
          projectName: projectName,
          projectDescription: projectDescription,
          createdDate: startDate,
          endDate: endDate,
          assignedAgent: agents,
          projectCategory: categories,
          projectOwner: projectOwner,
          projectStatus: projectStatus,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(response.data.message);
      console.log(response);
      dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      if (response.status === 201) {
        toast.success(response.data.message);
        const datas = response.data;
        setIsModelOpen(false);
        setIsSubmiting(false);
        setProjectName('');
        setProjectDescription('');
        startDate();
        endDate();
        setAgents([{}]);
        setProjectStatus('');
        setProjectOwner('');
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      }
    } catch (error) {
      toast.error(error.response);
      console.log(error);
      setIsSubmiting(false);
    }
  };

  const deleteHandle = async (productId) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/project/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success('Data deleted successfully!');
          dispatch({
            type: 'DELETE_SUCCESS',
            payload: true,
          });
        } else {
          toast.error('Failed to delete data.');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting data.');
      }
    }
  };

  const handleRedirectToContractorScreen = () => {
    navigate('/adminEditProject');
  };

  const handleAssigndment = (userid) => {
    navigate(`/AdminAssignAgent/${userid}`);
  };

  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}
      >
        <BiPlusMedical className="mx-2" />
        Add Project
      </Button>
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
          <Tabs
            defaultActiveKey="All"
            id="uncontrolled-tab-example"
            className="mb-3 mt-4 ps-4 gap-5 tab-btn"
          >
            <Tab className="tab-color" eventKey="All" title="All">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectData}
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
                  <Form
                    className="scrollInAdminproject"
                    onSubmit={handleSubmit}
                  >
                    <h4 className="d-flex justify-content-center">
                      Add Project
                    </h4>
                    <TextField
                      required
                      className="mb-2"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      label="Project Name"
                      fullWidth
                    />

                    <TextField
                      id="outlined-multiline-static"
                      onChange={(e) => setProjectDescription(e.target.value)}
                      label="Project Description"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                    />
                    <FormControl>
                      <InputLabel>Choose Contractor</InputLabel>
                      <Select
                        value={projectOwner}
                        onChange={(e) => setProjectOwner(e.target.value)}
                      >
                        <MenuItem
                          onClick={() => {
                            handleRedirectToContractorScreen();
                          }}
                        >
                          {' '}
                          <BiPlusMedical /> add new Contractor
                        </MenuItem>
                        {contractorData.map((items) => (
                          <MenuItem key={items._id} value={items._id}>
                            {items.first_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {agents.map((agent, index) => (
                      <div key={index}>
                        <FormControl>
                          <InputLabel>Choose Category</InputLabel>
                          <Select
                            value={agent.categoryId}
                            onChange={(e) =>
                              handleAgentChange(
                                index,
                                'categoryId',
                                e.target.value
                              )
                            }
                          >
                            <MenuItem disabled={agent.categoryId !== ''}>
                              Select Category
                            </MenuItem>
                            {categoryData.map((category) => (
                              <MenuItem
                                key={category._id}
                                value={category._id}
                                disabled={agents.some(
                                  (a) => a.categoryId === category._id
                                )}
                              >
                                {category.categoryName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <InputLabel>Choose Agent</InputLabel>
                          <Select
                            value={agent.agentId}
                            onChange={(e) =>
                              handleAgentChange(
                                index,
                                'agentId',
                                e.target.value
                              )
                            }
                          >
                            <MenuItem disabled={agent.agentId !== ''}>
                              Select Agent
                            </MenuItem>
                            {assignedAgentByCateHandle(index).map((agent) => (
                              <MenuItem
                                key={agent._id}
                                value={agent._id}
                                disabled={agents.some(
                                  (a) => a.agentId === agent._id
                                )}
                              >
                                {agent.first_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <div className="d-flex align-items-center">
                          <GrSubtractCircle
                            color="black"
                            className="mx-2"
                            onClick={() => removeAgent(index)}
                          />
                          <p className="text-dark m-0">Remove</p>
                        </div>
                      </div>
                    ))}

                    <div className="d-flex align-items-center">
                      <Button className="mb-2 bg-primary" onClick={addAgent}>
                        <GrAddCircle color="white" className="mx-2" />
                        Add Category and Agent
                      </Button>
                    </div>
                    <FormControl>
                      <InputLabel>Choose Status</InputLabel>
                      <Select
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                      >
                        <MenuItem value=""> Select Status </MenuItem>
                        <MenuItem value="active"> Active </MenuItem>
                        <MenuItem value="inactive"> Inactive </MenuItem>
                        <MenuItem value="queue"> In Proccess </MenuItem>
                      </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateField
                        required
                        label="Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        // format="MM-DD-YYYY"
                        // minDate={new Date()} // Prevent past dates from being selected
                      />
                      <DateField
                        required
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="MM-DD-YYYY"
                      />
                    </LocalizationProvider>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmiting}
                    >
                      {isNewProject
                        ? isSubmiting
                          ? 'Adding Project...'
                          : 'Add Project'
                        : isSubmiting
                        ? 'Saving Changes...'
                        : 'Save Changes'}
                    </Button>
                  </Form>
                </Box>
              </Modal>
            </Tab>
            <Tab className="tab-color" eventKey="Active" title="Active">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectActiveData}
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
            </Tab>
            <Tab className="tab-color" eventKey="Completed" title="Completed">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectCompleteData}
                  columns={[
                    ...columns,
                    {
                      field: 'action',
                      headerName: 'Action',
                      width: 250,
                      renderCell: (params) => {
                        return (
                          <Grid item xs={8}>
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                onClick={() => handleEdit(params.row._id)}
                                startIcon={<MdEdit />}
                              >
                                Edit
                              </Button>
                            </Link>

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
            </Tab>
            <Tab className="tab-color" eventKey="Qued" title="Qued">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectQuedData}
                  columns={[
                    ...columns,
                    {
                      field: 'action',
                      headerName: 'Action',
                      width: 250,
                      renderCell: (params) => {
                        return (
                          <Grid item xs={8}>
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                onClick={() => handleEdit(params.row._id)}
                                startIcon={<MdEdit />}
                              >
                                Edit
                              </Button>
                            </Link>
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
            </Tab>
            <Tab className="tab-color" eventKey="Assigned" title="Assigned">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={assignedAgent}
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
                              variant="danger"
                              className="mx-2  bg-danger"
                              onClick={() => handleAssigndment(params.row._id)}
                              startIcon={<MdEdit />}
                            >
                              Assign
                            </Button>

                            {/* <Button
                              variant="outlined"
                              className="mx-2 tableDeletebtn"
                              onClick={() => deleteHandle(params.row._id)}
                              startIcon={<AiFillDelete />}
                            >
                              Delete
                            </Button> */}
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
            </Tab>
          </Tabs>
        </>
      )}
    </>
  );
}
