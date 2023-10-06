import * as React from 'react';
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
import Tabs from 'react-bootstrap/Tabs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import MultiSelectDropdown from './ex';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

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
    field: 'projectOwner',
    headerName: 'Project Owner',
    width: 90,
  },
  {
    field: 'assignedAgent',
    headerName: 'Assigned Agent',
    width: 110,
  },
];

export default function AdminProjectListScreen() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewProject, setIsNewProject] = React.useState(false);

  const { state } = React.useContext(Store);
  const { userInfo } = state;
  const [
    { loading, error, projectData, successDelete, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    error: '',
    projectData: [],
    successDelete: false,
    successUpdate: false,
  });

  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [projectOwner, setProjectOwner] = React.useState('');
  const [assignedAgent, setAssignedAgent] = React.useState('');
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const handleEdit = (userid) => {
    const constractorToEdit = projectData.find(
      (constractor) => constractor && constractor._id === userid
    );
    setProjectName(constractorToEdit ? constractorToEdit.projectName : '');
    setProjectDescription(
      constractorToEdit ? constractorToEdit.projectDescription : ''
    );
    setProjectOwner(constractorToEdit ? constractorToEdit.projectOwner : '');
    setAssignedAgent(constractorToEdit ? constractorToEdit.assignedAgent : '');
    setSelectedRowData(constractorToEdit);
    setIsModelOpen(true);
    setIsNewProject(false);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewProject(true);
  };

  React.useEffect(() => {
    const fetchProjectData = async () => {
      try {
        dispatch({ type: 'FATCH_REQUEST' }); // Dispatch an action instead of calling it as a function
        const response = await axios.get('/api/project', {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Use template literals to interpolate the token
        });
        const datas = response.data;
        console.log(datas);
        const rowData = datas.map((items) => ({
          ...items,
          _id: items._id,
          projectName: items.projectName,
          projectDescription: items.projectDescription,
          projectOwner: items.projectOwner,
          assignedAgent: items.assignedAgent,
        }));
        dispatch({ type: 'FATCH_SUCCESS', payload: rowData });
      } catch (error) {
        console.error(error); // Log errors using console.error
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else if (successUpdate) {
      dispatch({ type: 'UPDATE_RESET' });
    } else {
      fetchProjectData(); // Call the function to fetch project data
    }
  }, [successDelete, successUpdate, dispatch, userInfo.token]); // Add dependencies to the dependency array

  const projectActiveData = projectData.filter((item) => {
    return item.projectStatus === 'active';
  });
  const projectCompleteData = projectData.filter((item) => {
    return item.projectStatus === 'complete';
  });
  const projectQuedData = projectData.filter((item) => {
    return item.projectStatus === 'qued';
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNewProject) {
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
      console.log(response.data.message);
      if (response.status === 201) {
        toast.success(response.data.message);
        const datas = response.data;
        setIsModelOpen(false);
        dispatch({ type: 'FATCH_SUCCESS', payload: datas });
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      } else if (response.status === 500) {
        toast.error(response.data.error);
      }
    } else {
      const response = await axios.put(
        `/api/project/update/${selectedRowData._id}`,
        {
          projectName: projectName,
          projectDescription: projectDescription,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        toast.success(response.data);
        setIsModelOpen(false);
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      } else if (response.status === 500) {
        toast.error(response.message);
      }
    }
  };

  // const handleFieldClick = () => {
  //   setInputType('date');
  // };
  // const handleFieldClickEnd = () => {
  //   setinputTypeEnd('date');
  // };

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
        <div>Loading .....</div>
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
                  className="tableBg mx-2"
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
                  <Form onSubmit={handleSubmit}>
                    {isNewProject ? (
                      <h4 className="d-flex justify-content-center">
                        Add new Project Details
                      </h4>
                    ) : (
                      <h4 className="d-flex justify-content-center">
                        Edit Project Details
                      </h4>
                    )}
                    <TextField
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
                      // value={'text'}
                      // onChange={handleChange}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Choose Options</InputLabel>
                      <Select
                        multiple
                        value={selectedOptions}
                        onChange={handleChange}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <span key={value}>{value}, </span>
                            ))}
                          </div>
                        )}
                      >
                        {options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateField
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        format="MM-DD-YYYY"
                      />
                      <DateField
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="MM-DD-YYYY"
                      />
                    </LocalizationProvider>
                    <Button variant="contained" color="primary" type="submit">
                      {isNewProject ? 'Add Project' : 'Save Changes'}
                    </Button>
                  </Form>
                </Box>
              </Modal>
            </Tab>
            <Tab className="tab-color" eventKey="Active" title="Active">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className="tableBg mx-2"
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
                  className="tableBg mx-2"
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
            <Tab className="tab-color" eventKey="Qued" title="Qued">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className="tableBg mx-2"
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
          </Tabs>
        </>
      )}
    </>
  );
}
