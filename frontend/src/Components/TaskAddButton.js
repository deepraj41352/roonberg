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
import { GrAddCircle } from 'react-icons/gr';
import { MdRemoveCircleOutline } from 'react-icons/md';
import dayjs from 'dayjs';
import { ImCross } from 'react-icons/im';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { FiPlus } from 'react-icons/fi';

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

function TaskAddButton() {
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [agents, setAgents] = useState([{ categoryId: '' }]);
  const [projectStatus, setProjectStatus] = useState('active');
  const [projectOwner, setProjectOwner] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [errorAccured, setErrorAccured] = useState(false);
  const [endDateError, setEndDateError] = useState('');

  const navigate = useNavigate();

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

  const handleRedirectToContractorScreen = () => {
    navigate('/adminContractorList');
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };
  const handleNew = () => {
    setIsModelOpen(true);
  };
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

  const assignedAgentByCateHandle = (index) => {
    const category = agents[index].categoryId;
    if (category) {
      const selectedCategory = categoryData.find(
        (categoryItem) => categoryItem._id === category
      );
      const agentsForCategory = agentData.filter(
        (agentItem) => agentItem.agentCategory === selectedCategory._id
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
  const currentDate = dayjs();

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

  return (
    <div>
      {/* Add your button or content here */}
      <div onClick={handleNew} className="TaskAddButton">
        <FiPlus />
      </div>
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
              <h4 className="d-flex justify-content-center">Add Project</h4>
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
                onChange={(e) => setProjectDescription(e.target.value)}
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
                        handleAgentChange(index, 'categoryId', e.target.value)
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
                        handleAgentChange(index, 'agentId', e.target.value)
                      }
                    >
                      {assignedAgentByCateHandle(index).map((agent) => (
                        <MenuItem
                          key={agent._id}
                          value={agent._id}
                          disabled={agents.some((a) => a.agentId === agent._id)}
                        >
                          {agent.first_name}
                        </MenuItem>
                      ))}
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
                    onChange={(newValue) => validateDates(newValue, endDate)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {startDateError && (
                    <div className="Datevalidation">{startDateError}</div>
                  )}
                  <DatePicker
                    className="mb-3"
                    label="End Date"
                    value={endDate}
                    required
                    onChange={(newValue) => validateDates(startDate, newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ color: 'white' }}
                        autoComplete="off"
                      />
                    )}
                  />
                  {endDateError && (
                    <div className="Datevalidation">{endDateError}</div>
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
    </div>
  );
}

export default TaskAddButton;
