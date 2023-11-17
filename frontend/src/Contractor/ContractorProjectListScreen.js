import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
// import { AiFillDelete } from 'react-icons/ai';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Card, Dropdown, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ImCross } from 'react-icons/im';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SUCCESS_CATEGORY':
      return { ...state, categoryData: action.payload };
    case 'ERROR_CATEGORY':
      return { ...state, error: action.payload };
    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };

    default:
      return state;
  }
};

const columns = [
  { field: '_id', headerName: 'ID', width: 220 },
  {
    field: 'projectName',
    headerName: 'Project',
    width: 150,
  },
  {
    field: 'projectDescription',
    headerName: 'Description',
    width: 200,
  },
  {
    field: 'projectCategory',
    headerName: 'Category',
    width: 150,
  },
  {
    field: 'assignedAgent',
    headerName: 'Agent',
    width: 110,
  },
];

export default function ContractorProject() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [
    { loading, error, projectData, successDelete, successUpdate, categoryData },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    projectData: [],
    successDelete: false,
    successUpdate: false,
  });

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    console.log('handleNew called');
    setIsModelOpen(true);
  };

  useEffect(() => {
    const FatchProjectData = async () => {
      try {
        dispatch({ type: 'FATCH_REQUEST' });
        const response = await axios.get(
          `/api/project/getproject/${userInfo._id}`
        );
        if (response) {
          const datas = response.data.projects;
          const rowData = datas.map((items) => ({
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
          }));
          dispatch({ type: 'FATCH_SUCCESS', payload: rowData });
        }
      } catch (error) {
        console.error(error);
        dispatch({ type: 'FATCH_ERROR', payload: error });
        if (error.response && error.response.status === 404) {
          toast.error('You Dont Have Any Projects At The Moment.');
        } else {
          toast.error('An Error Occurred While Fetching Data');
        }
      }
    };

    if (successUpdate) {
      dispatch({ type: 'UPDATE_RESET' });
    } else {
      FatchProjectData();
    }
  }, [successDelete, successUpdate]);

  const projectActiveData = projectData.filter((item) => {
    return item.projectStatus === 'active';
  });
  const projectCompleteData = projectData.filter((item) => {
    return item.projectStatus === 'complete';
  });
  const projectQuedData = projectData.filter((item) => {
    return item.projectStatus === 'qued';
  });
  console.log("active", projectActiveData.length, "completed", projectCompleteData.length, "qued", projectQuedData.length, projectData.length)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const response = await axios.post(
        '/api/project/',
        {
          projectName: projectName,
          projectDescription: projectDescription,
          projectCategory: selectedOptions,
          createdDate: startDate,
          endDate: endDate,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        const datas = response.data;
        setIsModelOpen(false);
        setIsSubmiting(false);
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      }
    } catch (error) {
      toast.error(error);
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        dispatch('FETCH_REQUEST');
        const response = await axios.get(`/api/category`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const categoryData = response.data;
        const uniqueCategories = Array.from(
          new Set(
            categoryData.map((item) => ({
              _id: item._id,
              categoryName: item.categoryName,
            }))
          )
        );
        dispatch({ type: 'SUCCESS_CATEGORY', payload: uniqueCategories });
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const currentDate = dayjs();

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
        } else {
          setEndDateError(
            'End date must be greater than or equal to the Start Date.'
          );
        }
      }
    } else {
      setStartDateError(
        'Start date must be greater than or equal to the current date.'
      );
    }
  };
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <div className="px-3 mt-3">
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
        ) : projectData.length < 0 || error ? (
          <div>
            <Card>
              <Card.Text>You don't have any projects at the moment.</Card.Text>
              <Card.Text>Create new project.</Card.Text>
              <Button
                variant="outlined"
                className=" m-2 d-flex globalbtnColor"
                onClick={handleNew}
              >
                <BiPlusMedical className="mx-2" />
                Add Project
              </Button>
            </Card>

          </div>
        ) : (
          <>
            <div className="tabBorder mt-3">

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
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Tabs
                activeKey={selectedTab}
                onSelect={(tab) => handleTabSelect(tab)}
                id="uncontrolled-tab-example"
                className={`mb-0 dropTab tab-btn ${theme}Tab`}
              >
                <Tab className="tab-color"
                  eventKey="All"
                  title={
                    <span class="position-relative">
                      All
                      <span class=" badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {projectData.length}
                      </span>
                    </span>
                  }>
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
                                <Link
                                  to={`/contractorEditProject/${params.row._id}`}
                                >
                                  <Button
                                    variant="contained"
                                    className="mx-2 tableEditbtn"
                                  // onClick={() => handleEdit(params.row._id)}
                                  // startIcon={<MdEdit />}
                                  >
                                    Edit
                                  </Button>
                                </Link>
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
                      localeText={{
                        noRowsLabel: 'Project Data Is Not Avalible',
                      }}
                    />
                  </Box>

                </Tab>
                <Tab className="tab-color"
                  eventKey="Active"
                  title={
                    <span class="position-relative">
                      Active
                      <span class=" badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {projectActiveData.length}
                      </span>
                    </span>
                  }>
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
                                <Link
                                  to={`/projectSingleScreen/${params.row._id}`}
                                >
                                  <Button
                                    variant="contained"
                                    className="mx-2 tableEditbtn"
                                  // onClick={() => handleEdit(params.row._id)}
                                  // startIcon={<MdEdit />}
                                  >
                                    Edit
                                  </Button>
                                </Link>

                                {/* <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
                                // startIcon={<AiFillDelete />}
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
                                <Link
                                  to={`/projectSingleScreen/${params.row._id}`}
                                >
                                  <Button
                                    variant="contained"
                                    className="mx-2 tableEditbtn"
                                  // onClick={() => handleEdit(params.row._id)}
                                  // startIcon={<MdEdit />}
                                  >
                                    Edit
                                  </Button>
                                </Link>

                                {/* <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
                                // startIcon={<AiFillDelete />}
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
                <Tab className="tab-color"
                  eventKey="Qued"
                  title={
                    <span className="position-relative">
                      Qued
                      <span className="badgesclass top-0 start-112 translate-middle badge rounded-pill bg-danger">
                        {projectQuedData.length}
                      </span>
                    </span>
                  }>
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme == 'light'
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
                          renderCell: (params) => {
                            return (
                              <Grid item xs={8}>
                                <Link
                                  to={`/projectSingleScreen/${params.row._id}`}
                                >
                                  <Button
                                    variant="contained"
                                    className="mx-2 tableEditbtn"
                                  // onClick={() => handleEdit(params.row._id)}
                                  // startIcon={<MdEdit />}
                                  >
                                    Edit
                                  </Button>
                                </Link>
                                {/* <Button
                                  variant="outlined"
                                  className="mx-2 tableDeletebtn"
                                  onClick={() => deleteHandle(params.row._id)}
                                // startIcon={<AiFillDelete />}
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
          </>
        )}
      </div>
    </>
  );
}
