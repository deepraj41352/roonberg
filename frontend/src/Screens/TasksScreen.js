import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';

import Modal from '@mui/material/Modal';
import { Dropdown } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';

import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';

import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext, useReducer, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import datas from '../dummyData';
import { FaRegClock } from 'react-icons/fa';
import Avatar from '../Components/Avatar';
import { CiSettings } from 'react-icons/ci';

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

      const name = params.row.projectName[0].toLowerCase();
      const color = generateColorFromAscii(name);
      return (
        <>
          {/* {params.row.categoryImage !== 'null' ? (
            <Avatar src={params.row.categoryImage} />
          ) : ( */}
          <Avatar name={name} bgColor={color} />
          {/* )} */}
        </>
      );
    },
  },
  {
    field: 'projectName',
    width: 300,
    renderCell: (params) => (
      <div className="text-start">
        <div>{params.row.projectName}</div>
        <div>Task ID {params.row._id}</div>
      </div>
    ),
  },
  {
    field: 'agentName',
    width: 100,
    renderCell: (params) => (
      <div className="text-start">
        <div>{params.row.agentName}</div>
        <div>Raised By</div>
      </div>
    ),
  },
  {
    field: 'contractorName',
    width: 100,
    renderCell: (params) => (
      <div className="text-start">
        <div>{params.row.contractorName}</div>
        <div>Assigned By</div>
      </div>
    ),
  },
];

export default function TasksScreen() {
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
    loading: false,
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
  const [selectedTab, setSelectedTab] = useState('Active Task');
  const [selectedProjects, setSelectedProjects] = useState('Projects');
  const [data, SetData] = useState(datas.projectList);
  console.log(data);

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };
  const handleProjectsSelect = (Projects) => {
    setSelectedProjects(Projects);
  };
  const handleEdit = (userid) => {
    navigate(`/adminEditProject/${userid}`);
  };
  const handleCloseRow = () => {
    setIsModelOpen(false);
  };
  const handleRedirectToContractorScreen = () => {
    navigate('/adminContractorList');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Done');
    } catch (error) {
      console.log('ERROR');
    }
  };
  return (
    <>
      <div className="px-3 mt-3">
        <Button
          variant="outlined"
          className="my-2 d-flex globalbtnColor"
          //   onClick={handleNew}
        >
          <BiPlusMedical className="mx-2" />
          Add Task
        </Button>
        <Dropdown className={`mb-0 tab-btn text-start `}>
          <Dropdown.Toggle id="dropdown-tabs" className="globalbtnColor">
            {selectedProjects}
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropMenu ">
            {data.map((project) => (
              <Dropdown.Item
                key={project.id} // Don't forget to add a unique key for each item
                className="dropMenuCon"
                onClick={() => handleProjectsSelect(`${project.projectName}`)}
              >
                <span className="position-relative">{project.projectName}</span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

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
                    <div className="lastLogin">
                      <FaRegClock className="clockIcon" /> Last Login : 4 Hours,
                      55 minutes ago
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        // className={
                        //   theme == 'light'
                        //     ? `${theme}DataGrid`
                        //     : `tableBg ${theme}DataGrid`
                        // }
                        className="tableGrid actionCenter"
                        rows={data}
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
                                    className="tableInProgressBtn"
                                    onClick={() => handleEdit(params.row._id)}
                                  >
                                    <CiSettings className="px-2" /> In Progress
                                  </Button>

                                  {/* <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
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

                          {/* <Form
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
                        </Form> */}
                        </div>
                      </Box>
                    </Modal>
                  </Tab>
                  <Tab
                    className="tab-color"
                    eventKey="Parked Task"
                    title={<span class="position-relative">Parked Task</span>}
                  >
                    <div className="lastLogin">
                      <FaRegClock className="clockIcon" /> Last Login : 4 Hours,
                      55 minutes ago
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        // className={
                        //   theme == 'light'
                        //     ? `${theme}DataGrid`
                        //     : `tableBg ${theme}DataGrid`
                        // }
                        className="tableGrid actionCenter"
                        rows={data}
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
                                    className="tableInProgressBtn"
                                    onClick={() => handleEdit(params.row._id)}
                                  >
                                    <CiSettings className="px-2" /> In Progress
                                  </Button>

                                  {/* <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
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
                  <Tab
                    className="tab-color"
                    eventKey="Completed Task"
                    title={
                      <span class="position-relative">Completed Task</span>
                    }
                  >
                    <div className="lastLogin">
                      <FaRegClock className="clockIcon" /> Last Login : 4 Hours,
                      55 minutes ago
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        // className={
                        //   theme == 'light'
                        //     ? `${theme}DataGrid`
                        //     : `tableBg ${theme}DataGrid`
                        // }
                        className="tableGrid actionCenter"
                        rows={data}
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
                                    className="tableInProgressBtn"
                                    onClick={() => handleEdit(params.row._id)}
                                  >
                                    <CiSettings className="px-2" /> In Progress
                                  </Button>

                                  {/* <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
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
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
