import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import { MdAddCircleOutline, MdPlaylistRemove } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Badge, Dropdown, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateField } from '@mui/x-date-pickers/DateField';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import { MdRemoveCircleOutline } from 'react-icons/md';
import dayjs from 'dayjs';
import { ImCross } from 'react-icons/im';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import 'bootstrap/dist/css/bootstrap.min.css';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'DELETE_SUCCESS':
      return { ...state, successDelete: action.payload, loading: false };

    case 'DELETE_RESET':
      return { ...state, successDelete: false, loading: false };
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
  const [morefieldsModel, setMorefieldsModel] = useState(false);
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
  const [endDate, setEndDate] = useState(null);
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const navigate = useNavigate();
  const [errorAccured, setErrorAccured] = useState(false);
  const [agents, setAgents] = useState([{ categoryId: '' }]);
  const [categories, setCategories] = useState([]);
  const [projectStatus, setProjectStatus] = useState('active');
  const [isDeleting, setIsDeleting] = useState(false);

  const assignedAgentByCateHandle = (index) => {
    const category = agents[index].categoryId;
    if (category) {
      const selectedCategory = categoryData.find(
        (categoryItem) => categoryItem._id === category
      );
      const agentsForCategory = agentData.filter((agentItem) =>
        agentItem.agentCategory.includes(selectedCategory._id)
      );

      const activeAgents = agentsForCategory.filter(
        (agentItem) => agentItem.userStatus === true
      );

      if (activeAgents.length > 0) {
        return activeAgents;
      }
    }
    return [];
  };

  const handleAgentChange = (index, key, value) => {
    const updatedAgents = [...agents];
    updatedAgents[index] = {
      ...updatedAgents[index],
      [key]: value,
    };

    if (key === 'categoryId' && value !== '') {
      const selectedCategory = categoryData.find(
        (categoryItem) => categoryItem._id === value
      );

      // if (selectedCategory) {
      //   const categoryObject = {
      //     categoryId: selectedCategory._id,
      //   };
      //   setCategories((prevCategories) => {
      //     const updatedCategories = [...prevCategories];
      //     updatedCategories[index] = categoryObject;
      //     return updatedCategories;
      //   });
      // }
    }

    setAgents(updatedAgents);
  };

  const addAgent = () => {
    setAgents([...agents, { categoryId: '' }]);
  };
  const removeAgent = (index) => {
    if (index > 0) {
      const updatedAgents = [...agents];
      updatedAgents.splice(index, 1);
      setAgents(updatedAgents);
    }
  };

  const handleEdit = (userid) => {
    navigate(`/adminEditProject/${userid}`);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };
  const HandelClose = () => {
    setMorefieldsModel(false);
  };
  const handleNew = () => {
    setIsModelOpen(true);
  };

  useEffect(() => {
    const FatchCategory = async () => {
      try {
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

          return {
            ...items,
            _id: items._id,
            projectName: items.projectName,
            projectDescription:
              items.projectDescription == '' ? 'N/D' : items.projectDescription,

            projectCategory:
              items.assignedAgent.length > 0
                ? items.assignedAgent.map((cat) =>
                    cat.categoryName !== '' ? cat.categoryName : 'N/C'
                  )
                : 'N/C',
            assignedAgent:
              items.assignedAgent.length > 0
                ? items.assignedAgent.map((agent) =>
                    agent.agentName !== '' ? agent.agentName : 'N/A'
                  )
                : 'N/A',

            projectOwner: contractor ? contractor.first_name : 'N/C',
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
  }, [successDelete, successUpdate, contractorData]);

  const projectActiveData = projectData.filter((item) => {
    return item.projectStatus === 'active';
  });
  const projectCompleteData = projectData.filter((item) => {
    return item.projectStatus === 'completed';
  });
  const projectQuedData = projectData.filter((item) => {
    return item.projectStatus === 'qued';
  });
  // const assignedAgent = projectData.filter((item) => {
  //   return item.assignedAgent.length === 0;
  // });
  console.log('projectData', projectData);

  // const assignedAgent = projectData.filter((item) => {
  //   return (
  //     Array.isArray(item.assignedAgent) &&
  //     item.assignedAgent.length > 0 &&
  //     item.assignedAgent.every((agent) => !agent?.agentId)
  //   );
  // });
  const assignedAgent = projectData.filter((item) => {
    return (
      Array.isArray(item.assignedAgent) &&
      item.assignedAgent.length > 0 &&
      item.assignedAgent.every((agent) => agent === undefined)
    );
  });

  const currentDate = dayjs();
  console.log('currentDate', currentDate);

  const validateDates = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    const selectedStartDate = dayjs(newStartDate);
    const selectedEndDate = dayjs(newEndDate);

    if (
      selectedStartDate.isAfter(currentDate, 'day') ||
      selectedStartDate.isSame(currentDate, 'day')
    ) {
      setStartDate(newStartDate);
      setStartDateError('');

      if (newEndDate) {
        if (
          selectedEndDate.isAfter(selectedStartDate, 'day') ||
          selectedEndDate.isSame(selectedStartDate, 'day')
        ) {
          setEndDate(newEndDate);
          setEndDateError('');
          setErrorAccured(false);
        } else {
          setErrorAccured(true);
          setEndDateError(
            'End date must be greater than or equal to the Start Date.'
          );
        }
      }
    } else {
      setErrorAccured(true);
      setStartDateError(
        'Start date must be greater than or equal to the current date.'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredAgents = agents.filter((obj) => Object.keys(obj).length > 1);
    setIsSubmiting(true);
    if (startDate === null || endDate === null) {
      setErrorAccured(true);
      if (startDate === null) {
        setStartDateError('Start date required.');
      }
      if (endDate === null) {
        setEndDateError('End date required.');
      }

      setIsSubmiting(false);
      return;
    }
    try {
      const response = await axios.post(
        '/api/project/admin/addproject',
        {
          projectName: projectName,
          projectDescription: projectDescription,
          createdDate: startDate,
          endDate: endDate,
          assignedAgent: agents,
          projectOwner: projectOwner,
          projectStatus: projectStatus,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        toast.success('Project Created Successfully !');
        setProjectName('');
        setProjectDescription('');
        setAgents([{}]);
        setProjectStatus('');
        setProjectOwner('');
        setIsSubmiting(false);
        setIsModelOpen(false);
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      }
    } catch (error) {
      if (error.response.status === 500) {
        setIsModelOpen(false);
        toast.error('Server Error');
        setIsSubmiting(false);
      }
    }
  };

  const deleteHandle = async (productId) => {
    setIsDeleting(true);
    if (window.confirm('Are You Sure To Delete?')) {
      try {
        const response = await axios.delete(`/api/project/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          setIsDeleting(false);
          toast.success('Project Deleted Successfully!');
          dispatch({
            type: 'DELETE_SUCCESS',
            payload: true,
          });
        } else {
          toast.error('Failed To Delete Project.');
        }
      } catch (error) {
        setIsDeleting(false);
        console.error(error);
        toast.error('An Error Occurred While Deleting Project.');
      }
    } else {
      setIsDeleting(false);
    }
  };

  const handleRedirectToContractorScreen = () => {
    navigate('/adminContractorList');
  };

  const handleAssigndment = (userid) => {
    navigate(`/AdminAssignAgent/${userid}`);
  };

  const moreFieldsopen = () => {
    setMorefieldsModel(true);
  };
  const [selectedTab, setSelectedTab] = useState('All');

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <div className="px-3 mt-3">
        <Button
          variant="outlined"
          className="my-2 d-flex globalbtnColor"
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
            <div className="overlayLoading">
              {isDeleting && (
                <div className="overlayLoadingItem1">
                  <ColorRing
                    visible={true}
                    height="40"
                    width="40"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    const
                    colors={['white', 'white', 'white', 'white', 'white']}
                  />
                </div>
              )}

              <Dropdown className={`mb-0 dropTab1 tab-btn ${theme}Tab`}>
                <Dropdown.Toggle variant="secondary" id="dropdown-tabs">
                  {selectedTab}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropMenu">
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('All')}
                  >
                    <span class="position-relative">
                      All
                      <span class=" badgesclass badgeAll top-0 start-112 translate-middle badge rounded-pill">
                        {projectData.length}
                      </span>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('Active')}
                  >
                    <span class="position-relative">
                      Active
                      <span class=" badgesclass badgeAll top-0 start-112 translate-middle badge rounded-pill ">
                        {projectActiveData.length}
                      </span>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('Completed')}
                  >
                    <span class="position-relative">
                      Completed
                      <span class=" badgesclass badgeAll top-0 start-112 translate-middle badge rounded-pill">
                        {projectCompleteData.length}
                      </span>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('Qued')}
                  >
                    <span className="position-relative">
                      Qued
                      <span className="badgesclass badgeAll top-0 start-112 translate-middle badge rounded-pill">
                        {projectQuedData.length}
                      </span>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('Assigned')}
                  >
                    <span className="position-relative">
                      Assigned
                      <span className="badgesclass badgeAll top-0 start-112 translate-middle badge rounded-pill">
                        {assignedAgent.length}
                      </span>
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Tabs
                activeKey={selectedTab}
                onSelect={(tab) => handleTabSelect(tab)}
                id="uncontrolled-tab-example"
                className={`mb-0 dropTab tab-btn ${theme}Tab`}
              >
                <Tab
                  className="tab-color"
                  eventKey="All"
                  title={
                    <span class="position-relative">
                      All
                      <span class=" badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {projectData.length}
                      </span>
                    </span>
                  }
                >
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme == 'light'
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
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
                                >
                                  Edit
                                </Button>

                                <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
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
                      // checkboxSelection
                      disableRowSelectionOnClick
                      localeText={{
                        noRowsLabel: 'Project Data Is Not Avalible',
                      }}
                    />
                  </Box>
                  <Modal
                    open={isModelOpen}
                    onClose={handleCloseRow}
                    className="overlayLoading modaleWidth p-0"
                  >
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
                        p: isSubmiting ? 0 : 4,
                      }}
                    >
                      <div className="overlayLoading">
                        {isSubmiting && (
                          <div className="overlayLoadingItem1 y-3">
                            <ColorRing
                              visible={true}
                              height="40"
                              width="40"
                              ariaLabel="blocks-loading"
                              wrapperStyle={{}}
                              wrapperClass="blocks-wrapper"
                              colors={[
                                'rgba(0, 0, 0, 1) 0%',
                                'rgba(255, 255, 255, 1) 68%',
                                'rgba(0, 0, 0, 1) 93%',
                              ]}
                            />
                          </div>
                        )}

                        <Form
                          className={
                            isSubmiting
                              ? 'scrollInAdminproject p-4 '
                              : 'scrollInAdminproject p-3'
                          }
                          onSubmit={handleSubmit}
                        >
                          <ImCross
                            color="black"
                            className="formcrossbtn"
                            onClick={handleCloseRow}
                          />
                          <h4 className="d-flex justify-content-center">
                            Add Project
                          </h4>
                          <TextField
                            required
                            className="mb-3"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            label="Project Name"
                            fullWidth
                          />

                          <TextField
                            id="outlined-multiline-static"
                            onChange={(e) =>
                              setProjectDescription(e.target.value)
                            }
                            label="Project Description"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            className="mb-3"
                          />
                          <FormControl className="mb-3">
                            <InputLabel>Select Contractor </InputLabel>
                            <Select
                              value={projectOwner}
                              onChange={(e) => setProjectOwner(e.target.value)}
                              required
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
                            <div
                              className="moreFieldsDiv d-flex align-items-center gap-2"
                              key={index}
                            >
                              <FormControl>
                                <InputLabel>Category</InputLabel>
                                <Select
                                  required
                                  value={agent.categoryId}
                                  onChange={(e) =>
                                    handleAgentChange(
                                      index,
                                      'categoryId',
                                      e.target.value
                                    )
                                  }
                                >
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
                                <InputLabel>Agent</InputLabel>
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
                                  {assignedAgentByCateHandle(index).map(
                                    (agent) => (
                                      <MenuItem
                                        key={agent._id}
                                        value={agent._id}
                                        disabled={agents.some(
                                          (a) => a.agentId === agent._id
                                        )}
                                      >
                                        {agent.first_name}
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <div className="d-flex">
                                <MdRemoveCircleOutline
                                  color="black"
                                  className="text-bold text-danger fs-5 pointCursor "
                                  onClick={() => removeAgent(index)}
                                />

                                <MdAddCircleOutline
                                  color="black"
                                  className="text-success text-bold fs-5 pointCursor"
                                  onClick={addAgent}
                                />
                              </div>
                            </div>
                          ))}
                          <div className="my-2">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                className="marginDate"
                                label="Start Date"
                                value={startDate}
                                required
                                onChange={(newValue) =>
                                  validateDates(newValue, endDate)
                                }
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                              {startDateError && (
                                <div className="Datevalidation">
                                  {startDateError}
                                </div>
                              )}
                              <DatePicker
                                className="mb-3"
                                label="End Date"
                                value={endDate}
                                required
                                onChange={(newValue) =>
                                  validateDates(startDate, newValue)
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    style={{ color: 'white' }}
                                    autoComplete="off"
                                  />
                                )}
                              />
                              {endDateError && (
                                <div className="Datevalidation">
                                  {endDateError}
                                </div>
                              )}
                            </LocalizationProvider>
                          </div>

                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={errorAccured}
                            className="mt-2 formbtn updatingBtn globalbtnColor"
                          >
                            {isSubmiting ? 'SUBMITTING' : 'SUBMIT '}
                          </Button>
                        </Form>
                      </div>
                    </Box>
                  </Modal>
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Active"
                  title={
                    <span class="position-relative">
                      Active
                      <span class=" badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {projectActiveData.length}
                      </span>
                    </span>
                  }
                >
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme == 'light'
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
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
                                >
                                  Edit
                                </Button>

                                <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
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
                      // checkboxSelection
                      disableRowSelectionOnClick
                      localeText={{
                        noRowsLabel: 'Project Data Is Not Avalible',
                      }}
                    />
                  </Box>
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Completed"
                  title={
                    <span class="position-relative">
                      Completed
                      <span class=" badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {projectCompleteData.length}
                      </span>
                    </span>
                  }
                >
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme == 'light'
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
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
                                <Button
                                  variant="contained"
                                  className="mx-2 tableEditbtn"
                                  onClick={() => handleEdit(params.row._id)}
                                >
                                  Edit
                                </Button>

                                <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
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
                      // checkboxSelection
                      disableRowSelectionOnClick
                      localeText={{
                        noRowsLabel: 'Project Data Is Not Avalible',
                      }}
                    />
                  </Box>
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Qued"
                  title={
                    <span className="position-relative">
                      Qued
                      <span className="badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {projectQuedData.length}
                      </span>
                    </span>
                  }
                >
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme === 'light'
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
                      rows={projectQuedData}
                      columns={[
                        ...columns,
                        {
                          field: 'action',
                          headerName: 'Action',
                          width: 250,
                          renderCell: (params) => (
                            <Grid item xs={8}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                onClick={() => handleEdit(params.row._id)}
                              >
                                Edit
                              </Button>

                              <Button
                                variant="outlined"
                                className="mx-2 tableDeletebtn"
                                onClick={() => deleteHandle(params.row._id)}
                              >
                                Delete
                              </Button>
                            </Grid>
                          ),
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
                      // checkboxSelection
                      disableRowSelectionOnClick
                      localeText={{
                        noRowsLabel: 'Project Data Is Not Avalible',
                      }}
                    />
                  </Box>
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Assigned"
                  title={
                    <span class="position-relative">
                      Assigned
                      <span class=" badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {assignedAgent.length}
                      </span>
                    </span>
                  }
                >
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme == 'light'
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
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
                                  onClick={() =>
                                    handleAssigndment(params.row._id)
                                  }
                                >
                                  Assign
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
                      // checkboxSelection
                      disableRowSelectionOnClick
                      localeText={{
                        noRowsLabel: 'Project Data Is Not Avalible',
                      }}
                    />
                  </Box>
                </Tab>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </>
  );
}
