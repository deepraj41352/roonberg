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
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import datas from '../dummyData';
import { FaRegClock } from 'react-icons/fa';
import AvatarImage from '../Components/Avatar';
import { CiSettings } from 'react-icons/ci';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TaskAddButton() {
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const [loading, setLoading] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [dynamicfield, setDynamicfield] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [ProjectData, setProjectData] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [SelectProjectName, setSelectProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [contractorData, setContractorData] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
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

  // {Get Project .........
  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (userInfo.role == 'contractor') {
          const ContractorProject = data.filter((item) => {
            return item.userId === userInfo._id;
          });
          setProjectData(ContractorProject);
        } else {
          setProjectData(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, []);

  // {Get  Contractor User.........
  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
        setContractorData(data);
      } catch (error) {}
    };
    FatchContractorData();
  }, []);
  const handleAdminSubmit = async () => {
    setIsSubmiting(true);
    try {
      const data = await axios.post(
        `/api/task/admin`,
        {
          selectProjectName: SelectProjectName,
          projectName: projectName,
          contractorName: contractorName,
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
        setContractorName('');
        setSelectProjectName('');
        navigate('/tasksScreen');
      }
      if (data.status === 200) {
        setDynamicfield(false);
        toast.error(data.data.message);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setContractorName('');
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

  const handleContractorSubmit = async () => {
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
        navigate('/tasksScreen');
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

  const handleNew = () => {
    setIsModelOpen(true);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleAddNewProject = () => {
    setDynamicfield(true);
  };
  const removeDymanic = () => {
    setDynamicfield(false);
  };

  const handelBothSubmit = (e) => {
    e.preventDefault();
    if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
      handleAdminSubmit();
    } else if (userInfo.role === 'contractor') {
      handleContractorSubmit();
    }
  };

  return (
    <div>
      <div onClick={handleNew} className="TaskAddButton">
        <BiPlusMedical className="" />{' '}
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
              onSubmit={(e) => handelBothSubmit(e)}
            >
              <ImCross
                color="black"
                className="formcrossbtn"
                onClick={handleCloseRow}
              />
              <h4 className="d-flex justify-content-center">Add Task</h4>
              <FormControl className={dynamicfield ? 'disable mb-3' : 'mb-3'}>
                <InputLabel>Select Project </InputLabel>
                <Select
                  value={SelectProjectName}
                  onChange={(e) => setSelectProjectName(e.target.value)}
                  required
                  disabled={dynamicfield}
                >
                  <MenuItem
                    onClick={() => {
                      handleAddNewProject();
                    }}
                  >
                    <MdAddCircleOutline /> Add New Project
                  </MenuItem>
                  {ProjectData.map((items) => (
                    <MenuItem key={items} value={items.projectName}>
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
                    onChange={(e) => setProjectName(e.target.value)}
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

              {userInfo.role == 'admin' ||
                (userInfo.role == 'superadmin' && (
                  <FormControl className={'mb-3'}>
                    <InputLabel>Select Contractor </InputLabel>
                    <Select
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      required
                    >
                      <MenuItem>
                        <Link to={`/adminContractorList`} className="addCont">
                          <MdAddCircleOutline /> Add New Contractor
                        </Link>
                      </MenuItem>
                      {contractorData.map((items) => (
                        <MenuItem key={items} value={items.first_name}>
                          {items.first_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}

              <div className="d-flex align-items-center flex-wrap justify-content-between cateContainer">
                {categoryData.map((category) => (
                  <div key={category._id} className="d-flex flex-row cateItems">
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
                      onChange={(e) => setCategory(e.target.value)}
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
    </div>
  );
}
