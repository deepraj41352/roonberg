import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ImCross } from 'react-icons/im';

import Modal from '@mui/material/Modal';
import { Dropdown, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import datas from '../dummyData';
import { FaRegClock } from 'react-icons/fa';
import AvatarImage from '../Components/Avatar';
import { CiSettings } from 'react-icons/ci';
import axios from 'axios';
import { toast } from 'react-toastify';

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

export default function ContractorTaskScreen() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [morefieldsModel, setMorefieldsModel] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [selectedRowId, setSelectedRowId] = useState(null);
  const handleCheckboxSelection = (rowId) => {
    setSelectedRowId(rowId === selectedRowId ? null : rowId);
  };
  const columns = [
    {
      field: 'categoryImage',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => {
        function generateColorFromAscii(str) {
          let color = '#';
          const combination = str
            .split('')
            .map((char) => char.charCodeAt(0))
            .reduce((acc, value) => acc + value, 0);
          color += (combination * 12345).toString(16).slice(0, 6);
          return color;
        }

        const name = params.row.taskName[0].toLowerCase();
        const color = generateColorFromAscii(name);
        return (
          <>
            {/* {params.row.categoryImage !== 'null' ? (
              <Avatar src={params.row.categoryImage} />
            ) : ( */}
            <AvatarImage name={name} bgColor={color} />
            {/* )} */}
          </>
        );
      },
    },
    {
      field: 'checkbox',
      headerName: 'Select',
      width: 100,
      renderCell: (params) => (
        <input
          className="Check_box-For-Select"
          type="checkbox"
          checked={selectedRowId === params.row._id}
          onChange={() => handleCheckboxSelection(params.row._id)}
        />
      ),
    },
    {
      field: 'taskName',
      headerName: 'Task Name',
      width: 300,
      renderCell: (params) => (
        <div className="text-start">
          <div>{params.row.taskName}</div>
          <div>Task ID {params.row._id}</div>
        </div>
      ),
    },
    {
      field: 'userName',
      headerName: 'Contractor Name',
      width: 100,
      renderCell: (params) => (
        <div className="text-start">
          <div>{params.row.userName}</div>
          <div>Raised By</div>
        </div>
      ),
    },
    {
      field: 'agentName',
      headerName: 'Agent Name',
      width: 100,
      renderCell: (params) => (
        <div className="text-start">
          <div>{params.row.agentName}</div>
          <div>Assigned By</div>
        </div>
      ),
    },
  ];
  const [
    {
      // loading,
      error,
      projectData,
      successDelete,
      successUpdate,
      // categoryData,
      agentData,
      contractorData,
    },
    dispatch,
  ] = useReducer(reducer, {
    // loading: false,
    error: '',
    projectData: [],
    successDelete: false,
    successUpdate: false,
    // categoryData: [],
    contractorData: [],
    agentData: [],
  });
  console.log('selectedRowId', selectedRowId);
  const [projectName, setProjectName] = useState('');
  const [SelectProjectName, setSelectProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [ProjectData, setProjectData] = useState([]);

  const navigate = useNavigate();
  const [errorAccured, setErrorAccured] = useState(false);
  const [agents, setAgents] = useState([{ categoryId: '' }]);
  const [categories, setCategories] = useState([]);
  const [projectStatus, setProjectStatus] = useState('active');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active Task');
  const [selectedProjects, setSelectedProjects] = useState('All Project');
  const [selectedProjectsId, setSelectedProjectsId] = useState();
  const [dynamicfield, setDynamicfield] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectStatuDrop, setProjectStatuDrop] = useState(null);
  const [data, SetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddNewProject = () => {
    setDynamicfield(true);
  };
  const removeDymanic = () => {
    setDynamicfield(false);
  };
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  const handleProjectsSelect = (id, Projects) => {
    setSelectedProjects(Projects);
    setSelectedProjectsId(id);
  };
  const handleEdit = (userid) => {
    navigate(`/adminEditProject/${userid}`);
  };
  const handleCloseRow = () => {
    setIsModelOpen(false);
    setShowModal(false);
  };
  const handleNew = () => {
    setIsModelOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    const FatchcategoryData = async () => {
      try {
        const { data } = await axios.get(`/api/task/tasks`);
        SetData(data);
      } catch (error) {
        toast.error(error.data?.message);
      } finally {
        setLoading(false);
      }
    };

    FatchcategoryData();
  }, [success]);
  console.log('data', data);

  const ModelOpen = () => {
    setShowModal(true);
  };
  const deleteTask = async () => {
    setIsSubmiting(true);
    try {
      const data = await axios.delete(`/api/task/${selectedRowId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (data.status === 200) {
        setSuccess(!success);
        toast.success(data.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmiting(false);
    }
  };
  const handleStatusUpdate = async (e) => {
    const taskStatus = e.target.value;
    try {
      const data = await axios.put(
        `/api/task/updateStatus/${selectedRowId}`,
        { taskStatus: taskStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.status === 200) {
        setSuccess(!success);
        setShowModal(false);
        toast.success('Task Status updated Successfully !');
      }
      setProjectStatus(data.projectStatus);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setLoading(true);
    const FatchCategory = async () => {
      try {
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        setCategoryData(datas);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FatchCategory();
  }, []);

  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log('dataofCOntractor', data);
        const ContractorProject = data.filter((item) => {
          return item.userId === userInfo._id;
        });

        setProjectData(ContractorProject);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [success]);
  console.log('ProjectData', ProjectData);

  const ContractorTask = data.filter((item) => {
    return item.userId === userInfo._id;
  });

  console.log('ContractorTask', ContractorTask);

  const taskData = ContractorTask.filter((item) => {
    if (selectedProjects == 'All Project') {
      return item;
    } else {
      return item.projectId === selectedProjectsId;
    }
  });
  const ActiveData = taskData.filter((item) => {
    return item.taskStatus === 'active' || item.taskStatus === 'waiting';
  });
  const CompleteData = taskData.filter((item) => {
    return item.taskStatus === 'completed';
  });
  const PendingData = taskData.filter((item) => {
    return item.taskStatus === 'pending';
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    try {
      const data = await axios.post(
        `/api/task/contractor`,
        {
          selectProjectName: SelectProjectName,
          projectName: projectName,
          taskName: taskName,
          taskDescription: taskDesc,
          taskCategory: category,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.status === 201) {
        setSuccess(!success);
        toast.success(data.data.message);
        setDynamicfield(false);
        setIsSubmiting(false);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setSelectProjectName('');
      }
      if (data.status === 200) {
        setDynamicfield(false);
        toast.error(data.data.message);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setSelectProjectName('');
      }
    } catch (error) {
      toast.error(error.message);
      setIsModelOpen(false);
      setDynamicfield(false);
    } finally {
      setIsSubmiting(false);
    }
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
              className="my-2 d-flex globalbtnColor"
              onClick={handleNew}
            >
              <BiPlusMedical className="mx-2" />
              Add Task
            </Button>
            <Dropdown className={`mb-0 tab-btn text-start `}>
              <Dropdown.Toggle
                id="dropdown-tabs"
                className="my-2 globalbtnColor selectButton"
              >
                {selectedProjects}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropMenu ">
                <Dropdown.Item
                  className="dropMenuCon"
                  onClick={() => handleProjectsSelect('', 'All Project')}
                >
                  All Project
                </Dropdown.Item>
                {ProjectData.map((project, key) => (
                  <Dropdown.Item
                    key={project._id} // Make sure to use a unique key for each item
                    className="dropMenuCon"
                    onClick={() =>
                      handleProjectsSelect(project._id, project.projectName)
                    }
                  >
                    <span className="position-relative">
                      {project.projectName}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <div className="tableScreen">
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

                <Dropdown className={`mb-0 dropTab1 tab-btn`}>
                  <Dropdown.Toggle variant="secondary" id="dropdown-tabs">
                    {selectedTab}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropMenu">
                    <Dropdown.Item
                      className="dropMenuCon"
                      onClick={() => handleTabSelect('Active Task')}
                    >
                      <span class="position-relative">Active Task</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropMenuCon"
                      onClick={() => handleTabSelect('Parked Task')}
                    >
                      <span class="position-relative">Parked Task</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      active
                      className="dropMenuCon"
                      onClick={() => handleTabSelect('Completed Task')}
                    >
                      <span class="position-relative">Completed Task</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Tabs
                  activeKey={selectedTab}
                  onSelect={(tab) => handleTabSelect(tab)}
                  id="uncontrolled-tab-example"
                  className={`mb-0 tab-btn tabBack dropTab`}
                >
                  <Tab
                    className="tab-color"
                    eventKey="Active Task"
                    title={<span class="position-relative">Active Task</span>}
                  >
                    {selectedRowId && (
                      <div className="btn-for-update">
                        <Button className=" btn-color" onClick={ModelOpen}>
                          <span class="position-relative ">Update Status</span>
                        </Button>
                        <Button
                          className=" btn-color"
                          // onClick={}
                        >
                          <span class="position-relative">Assigned Agent</span>
                        </Button>
                        <Button
                          active
                          className=" btn-color"
                          onClick={deleteTask}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                        <Modal
                          open={showModal}
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

                              <Form>
                                <Form.Group
                                  className="mb-3 "
                                  controlId="formBasicPassword"
                                >
                                  <Form.Label className="mb-1 fw-bold">
                                    Project Status
                                  </Form.Label>
                                  <Form.Select
                                    value={projectStatus}
                                    onChange={handleStatusUpdate}
                                  >
                                    <option value="waiting">Waiting</option>
                                    <option value="active">Running</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                  </Form.Select>
                                </Form.Group>
                              </Form>
                            </div>
                          </Box>
                        </Modal>
                      </div>
                    )}
                    <div className="lastLogin">
                      <FaRegClock className="clockIcon" /> Last Login : 4 Hours,
                      55 minutes ago
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        className="tableGrid actionCenter"
                        rows={ActiveData}
                        columns={[
                          ...columns,
                          {
                            field: 'action',
                            headerName: 'Action',
                            width: 200,
                            renderCell: (params) => {
                              return (
                                <Grid item xs={8}>
                                  <Button
                                    variant="contained"
                                    className={
                                      params.row.taskStatus === 'active'
                                        ? 'tableInProgressBtn'
                                        : 'tableInwaitingBtn'
                                    }
                                    // onClick={() => handleEdit(params.row._id)}
                                  >
                                    <CiSettings className="clockIcon" />
                                    {params.row.taskStatus === 'waiting'
                                      ? 'Waiting On You'
                                      : params.row.taskStatus === 'active'
                                      ? 'In Progress'
                                      : params.row.taskStatus === 'completed'
                                      ? 'Completed'
                                      : params.row.taskStatus === 'pending'
                                      ? 'Ready To Completed'
                                      : ''}
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
                          noRowsLabel: 'Task Is Not Avalible',
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
                            <FormControl
                              className={dynamicfield ? 'disable mb-3' : 'mb-3'}
                            >
                              <InputLabel>Select Project </InputLabel>
                              <Select
                                value={SelectProjectName}
                                onChange={(e) =>
                                  setSelectProjectName(e.target.value)
                                }
                                required
                                disabled={dynamicfield}
                              >
                                <MenuItem
                                  onClick={() => {
                                    handleAddNewProject();
                                  }}
                                >
                                  <MdAddCircleOutline /> add new Project
                                </MenuItem>
                                {ProjectData.map((items) => (
                                  <MenuItem
                                    key={items}
                                    value={items.projectName}
                                  >
                                    {items.projectName}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {dynamicfield ? (
                              <div className="d-flex align-items-center gap-1">
                                <TextField
                                  required
                                  className="mb-3"
                                  value={projectName}
                                  onChange={(e) =>
                                    setProjectName(e.target.value)
                                  }
                                  label="Project Name"
                                  fullWidth
                                />
                                <MdRemoveCircleOutline
                                  color="black"
                                  className="text-bold text-danger fs-5 pointCursor "
                                  onClick={() => removeDymanic()}
                                />
                              </div>
                            ) : null}
                            <TextField
                              required
                              className="mb-3"
                              value={taskName}
                              onChange={(e) => setTaskName(e.target.value)}
                              label="Task Name"
                              fullWidth
                            />

                            <TextField
                              required
                              className="mb-3"
                              value={taskDesc}
                              onChange={(e) => setTaskDesc(e.target.value)}
                              label="Description"
                              fullWidth
                            />
                            <div className="d-flex align-items-center flex-wrap justify-content-between cateContainer">
                              {categoryData.map((category) => (
                                <div
                                  key={category._id}
                                  className="d-flex flex-row cateItems"
                                >
                                  <Form.Check
                                    className="d-flex align-items-center"
                                    type="radio"
                                    id={`category-${category._id}`}
                                    name="category"
                                    value={category.categoryName}
                                    label={
                                      <div className="d-flex align-items-center">
                                        <Avatar
                                          src={category.categoryImage}
                                          alt={category.categoryName}
                                        />
                                        <span className="ms-2 spanForCate">
                                          {category.categoryName}
                                        </span>
                                      </div>
                                    }
                                    onChange={(e) =>
                                      setCategory(e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                            </div>

                            <Button
                              variant="contained"
                              color="primary"
                              type="submit"
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
                    eventKey="Parked Task"
                    title={<span class="position-relative">Parked Task</span>}
                  >
                    {selectedRowId && (
                      <div className="btn-for-update">
                        <Button className=" btn-color" onClick={ModelOpen}>
                          <span class="position-relative">Update Status</span>
                        </Button>
                        <Button
                          className=" btn-color"
                          // onClick={}
                        >
                          <span class="position-relative">Assigned Agent</span>
                        </Button>
                        <Button
                          active
                          className=" btn-color"
                          onClick={deleteTask}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                      </div>
                    )}
                    <div className="lastLogin">
                      <FaRegClock className="clockIcon" /> Last Login : 4 Hours,
                      55 minutes ago
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        className="tableGrid actionCenter"
                        rows={PendingData}
                        columns={[
                          ...columns,
                          {
                            field: 'action',
                            headerName: 'Action',
                            width: 160,
                            renderCell: (params) => {
                              return (
                                <Grid item xs={8}>
                                  <Button
                                    variant="contained"
                                    className={
                                      params.row.taskStatus === 'active'
                                        ? 'tableInProgressBtn'
                                        : 'tableInwaitingBtn'
                                    }
                                    // onClick={() => handleEdit(params.row._id)}
                                  >
                                    <CiSettings className="clockIcon" />
                                    {params.row.taskStatus === 'waiting'
                                      ? 'Waiting On You'
                                      : params.row.taskStatus === 'active'
                                      ? 'In Progress'
                                      : params.row.taskStatus === 'completed'
                                      ? 'Completed'
                                      : params.row.taskStatus === 'pending'
                                      ? 'Ready To Completed'
                                      : ''}
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
                          noRowsLabel: 'Task Is Not Avalible',
                        }}
                      />
                    </Box>
                  </Tab>
                  <Tab
                    className="tab-color"
                    eventKey="Completed Task"
                    title={
                      <span class="position-relative">Completed Task</span>
                    }
                  >
                    {selectedRowId && (
                      <div className="btn-for-update">
                        <Button className=" btn-color" onClick={ModelOpen}>
                          <span class="position-relative">Update Status</span>
                        </Button>
                        <Button
                          className=" btn-color"
                          // onClick={}
                        >
                          <span class="position-relative">Assigned Agent</span>
                        </Button>
                        <Button
                          active
                          className=" btn-color"
                          onClick={deleteTask}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                      </div>
                    )}
                    <div className="lastLogin">
                      <FaRegClock className="clockIcon" /> Last Login : 4 Hours,
                      55 minutes ago
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        className="tableGrid actionCenter"
                        rows={CompleteData}
                        columns={[
                          ...columns,
                          {
                            field: 'action',
                            headerName: 'Action',
                            width: 160,
                            renderCell: (params) => {
                              return (
                                <Grid item xs={8}>
                                  <Button
                                    variant="contained"
                                    className={
                                      params.row.taskStatus === 'active'
                                        ? 'tableInProgressBtn'
                                        : 'tableInwaitingBtn'
                                    }
                                    // onClick={() => handleEdit(params.row._id)}
                                  >
                                    <CiSettings className="clockIcon" />
                                    {params.row.taskStatus === 'waiting'
                                      ? 'Waiting On You'
                                      : params.row.taskStatus === 'active'
                                      ? 'In Progress'
                                      : params.row.taskStatus === 'completed'
                                      ? 'Completed'
                                      : params.row.taskStatus === 'pending'
                                      ? 'Ready To Completed'
                                      : ''}
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
                          noRowsLabel: 'Task Is Not Avalible',
                        }}
                      />
                    </Box>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
