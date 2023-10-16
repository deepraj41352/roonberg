import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
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
import MultiSelectDropdown from './ex';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SUCCESS_CATEGORY':
      return { ...state, categoryData: action.payload, loading: false };
    case 'ERROR_CATEGORY':
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
    headerName: 'project Category',
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
  const [isSubmiting, setIsSubmiting] = React.useState(false);

  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [
    { loading, error, projectData, successDelete, successUpdate },
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

  useEffect(() => {
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

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: 'contractor' });
        const datas = response.data;
        console.log(datas);
        setContractor(datas);
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

        setAssignedAgent(datas);
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
        console.log('karan', datas);
        const rowData = datas.map((items) => ({
          ...items,
          _id: items._id,
          projectName: items.projectName,
          projectDescription: items.projectDescription,
          projectCategory: items.projectCategory
            ? items.projectCategory.map((cat) => cat.categoryName)
            : '',
          assignedAgent: items.assignedAgent
            ? items.assignedAgent.map((agent) => agent.agentName)
            : '',
        }));
        console.log('sharam', rowData);
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
  }, [successDelete, successUpdate, dispatch, userInfo.token]);

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
    setIsSubmiting(true);

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
        setIsSubmiting(false);

        // dispatch({ type: 'FATCH_SUCCESS', payload: datas });
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      } else if (response.status === 500) {
        toast.error(response.data.error);
        setIsSubmiting(false);
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
        setIsSubmiting(false);

        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      } else if (response.status === 500) {
        toast.error(response.message);
        setIsSubmiting(false);
      }
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
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
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
                      required
                      className="mb-2"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      label="Project Name"
                      fullWidth
                    />
                    <TextField
                      required
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
                        required
                        multiple
                        value={selectedOptions}
                        onChange={handleChange}
                        // renderValue={(selected) => (
                        //   <div>
                        //     {categoryData && selected
                        //       ? selected.map((value) => (
                        //           <span key={value}>
                        //             {categoryData.find(
                        //               (option) => option._id === value
                        //             ).categoryName + ','}
                        //           </span>
                        //         ))
                        //       : ''}
                        //   </div>
                        // )}
                      >
                        {categoryData &&
                          categoryData.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                              {option.categoryName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>{' '}
                    */}
                    <FormControl>
                      <InputLabel>Choose Contractor</InputLabel>
                      <Select
                        value={contractor}
                        onChange={(e) => setContractor(e.target.value)}
                      >
                        <MenuItem>Select Contractor</MenuItem>
                        {contractorData.map((items) => (
                          <MenuItem key={items._id} value={items._id}>
                            {items.first_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <InputLabel>Choose Category</InputLabel>
                      <Select
                        value={selectCategory}
                        onChange={(e) => setSelectCategory(e.target.value)}
                      >
                        <MenuItem>Select Category</MenuItem>
                        {categoryData.map((items) => (
                          <MenuItem key={items._id} value={items._id}>
                            {items.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <InputLabel>Choose Agent</InputLabel>
                      <Select
                        value={assignedAgent}
                        onChange={(e) => setAssignedAgent(e.target.value)}
                      >
                        <MenuItem>Select Agent</MenuItem>
                        {assignedAgentByCateHandle().map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.first_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div className="d-flex align-items-start">
                      <BiPlusMedical
                        color="black"
                        className="mx-2"
                        onClick={() => {
                          handleAddfields();
                        }}
                      />
                      <p className="text-dark">Add more category and agent</p>
                    </div>
                    {moreFields.map((index) => (
                      <div key={index}>
                        <>
                          <FormControl>
                            <InputLabel>Choose Category</InputLabel>
                            <Select
                              value={selectCategory}
                              onChange={(e) =>
                                setSelectCategory(e.target.value)
                              }
                            >
                              <MenuItem>Select Category</MenuItem>
                              {categoryData.map((items) => (
                                <MenuItem key={items._id} value={items._id}>
                                  {items.categoryName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl>
                            <InputLabel>Choose Agent</InputLabel>
                            <Select
                              value={assignedAgent}
                              onChange={(e) => setAssignedAgent(e.target.value)}
                            >
                              <MenuItem>Select Agent</MenuItem>
                              {assignedAgentByCateHandle().map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                  {item.first_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </>
                      </div>
                    ))}
                    {/* {moreFields.map((index) => (
                    <div key={index}>
                      <>
                        <select className='formselect mb-2' value={category} onChange={(e) => setCategory(e.target.value)} >
                          <option value="" >
                            Select a category
                          </option>
                          {categoryData.map((items) => (
                            <option key={items._id} value={items._id} >{items.categoryName}</option>
                          ))}
                        </select>
                        <select className='formselect mb-2' value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)}>
                          <option value="" >
                            Select a Agent
                          </option>
                          {assignedAgenthandle().map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.first_name}
                            </option>
                          ))} */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateField
                        required
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        format="MM-DD-YYYY"
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
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
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
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
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
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
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
          </Tabs>
        </>
      )}
    </>
  );
}
