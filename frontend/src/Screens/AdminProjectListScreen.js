import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Grid, MenuItem, Select, TextareaAutosize } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true }
    case "FATCH_SUCCESS":
      return { ...state, projectData: action.payload, loading: false }
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "DELETE_SUCCESS":
      return { ...state, successDelete: action.payload };

    case "DELETE_RESET":
      return { ...state, successDelete: false };

    case "UPDATE_SUCCESS":
      return { ...state, successUpdate: action.payload };

    case "UPDATE_RESET":
      return { ...state, successUpdate: false };
    case "FATCH_CATEGORY":
      return { ...state, categoryData: action.payload };
    case "FATCH_AGENTS":
      return { ...state, agentData: action.payload };
    case "FATCH_CONTRACTOR":
      return { ...state, contractorData: action.payload };
    default:
      return state;
  };
}

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
  const [{ loading, error, projectData, successDelete, successUpdate, categoryData, agentData, contractorData }, dispatch] = React.useReducer(reducer,
    {
      loading: true,
      error: '',
      projectData: [],
      categoryData: [],
      contractorData: [],
      agentData: [],
      successDelete: false,
      successUpdate: false
    })

  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [assignedAgent, setAssignedAgent] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [contractor, setContractor] = React.useState('');
  const [moreFields, setMoreFields] = React.useState([]);

  const [categoryAgentPairs, setCategoryAgentPairs] = React.useState([]);

  const handleAddCategoryAgentPair = () => {
    if (category && assignedAgent) {
      const newPair = { category, assignedAgent };
      setCategoryAgentPairs([...categoryAgentPairs, newPair]);
      setCategory('');
      setAssignedAgent('');
    }
  };

  const handleEdit = (userid) => {
    const constractorToEdit = projectData.find((constractor) => constractor && constractor._id === userid);
    setProjectName(constractorToEdit ? constractorToEdit.projectName : '');
    setProjectDescription(constractorToEdit ? constractorToEdit.projectDescription : '');
    setCategory(constractorToEdit ? constractorToEdit.category : '');
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
    const FatchProjectData = async () => {
      try {
        dispatch("FATCH_REQUEST")
        const response = await axios.get(`/api/project/`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const datas = response.data;
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            projectName: items.projectName,
            projectDescription: items.projectDescription,
            projectOwner: items.projectOwner,
            assignedAgent: items.assignedAgent,
          }
        })
        dispatch({ type: "FATCH_SUCCESS", payload: rowData });
      } catch (error) {
        console.log(error)
      }
    }
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" })
    }
    else if (successUpdate) {
      dispatch({ type: "UPDATE_RESET" })
    }
    else {
      FatchProjectData()
    }


  }, [successDelete, successUpdate]);


  const handleSubmit = async (e) => {

    e.preventDefault()
    if (isNewProject) {
      const response = await axios.post(`/api/project/`, {
        projectName: projectName, projectDescription: projectDescription,
      }, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      console.log(response.data.message)
      if (response.status === 201) {
        toast.success(response.data.message);
        const datas = response.data;
        setIsModelOpen(false)
        dispatch({ type: "FATCH_SUCCESS", payload: datas })
        dispatch({ type: "UPDATE_SUCCESS", payload: true })
      }
      else if (response.status === 500) {
        toast.error(response.data.error)
      }
    }
    else {
      const response = await axios.put(`/api/project/update/${selectedRowData._id}`,
        {
          projectName: projectName, projectDescription: projectDescription
        },

        { headers: { Authorization: `Bearer ${userInfo.token}` } }


      );

      if (response.status === 200) {
        toast.success(response.data);
        setIsModelOpen(false)
        dispatch({ type: "UPDATE_SUCCESS", payload: true })
      }
      else if (response.status === 500) {
        toast.error(response.message)
      }
    }

  }

  const deleteHandle = async (productId) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/project/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        if (response.status === 200) {
          toast.success(" data deleted successfully!");
          dispatch({
            type: "DELETE_SUCCESS", payload: true
          })
        } else {
          toast.error("Failed to delete data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting  data.");
      }
    }
  };

  React.useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch("FATCH_REQUEST")
        const response = await axios.get(`/api/category/`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const datas = response.data;
        setCategory(datas)
        dispatch({ type: "FATCH_CATEGORY", payload: datas });
      } catch (error) {
        console.log(error)
      }
    }
    FatchCategory();
  }, []);

  React.useEffect(() => {

    const FatchCatagoryData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "contractor" });
        const datas = response.data;
        console.log(datas)
        setContractor(datas);
        dispatch({ type: "FATCH_CONTRACTOR", payload: datas })

      } catch (error) {
      }
    }
    FatchCatagoryData();

  }, [])

  React.useEffect(() => {

    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "agent" });
        const datas = response.data;

        setAssignedAgent(datas);
        dispatch({ type: "FATCH_AGENTS", payload: datas })

      } catch (error) {
      }
    }
    FatchAgentData();

  }, [])

  const assignedAgenthandle = () => {
    if (category) {
      const selectedCategory = categoryData.find(categoryItem => categoryItem._id === category);
      if (selectedCategory) {
        const agentForCategory = agentData.find(agentItem => agentItem.agentCategory === selectedCategory._id);
        if (agentForCategory) {
          return [agentForCategory]
        }
      }
    }
    return [];
  }
  const handleAddfields = () => {
    setMoreFields([...moreFields, {}]);
  }

  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}>
        <BiPlusMedical className='mx-2' />
        Add Project
      </Button>
      {loading ? (
        <div>Loading .....</div>
      ) : (error ? (
        <div>{error}</div>
      ) : (
        <>
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
                          startIcon={<MdEdit />}>
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          className="mx-2 tableDeletebtn"
                          onClick={() => deleteHandle(params.row._id)}
                          startIcon={<AiFillDelete />}>
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
              className="modelBg scroll-form"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}>
              <div className="">
                <Form onSubmit={handleSubmit}>


                  <ImCross color='black' className='formcrossbtn' onClick={handleCloseRow} />
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
                  <select className='formselect mb-2' value={contractor} onChange={(e) => setContractor(e.target.value)}>
                    <option value="" >
                      Select a Contractor
                    </option>
                    {contractorData.map((items) => (
                      <option key={items._id} value={items._id} >{items.first_name}</option>
                    ))}
                  </select>

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
                    ))}
                  </select>
                  <div className='d-flex align-items-start'>
                    <BiPlusMedical color="black" className='mx-2' onClick={() => { handleAddfields(); handleAddCategoryAgentPair() }} />
                    <p className='text-dark'>Add more category and agent</p>
                  </div>
                  <ul>
                    {categoryAgentPairs.map((pair, index) => (
                      <li key={index}>
                        Category: {pair.category}, Agent: {pair.assignedAgent}
                      </li>
                    ))}
                  </ul>
                  {moreFields.map((index) => (
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
                          ))}
                        </select>
                        <hr className='bg-dark' />
                      </>
                    </div>
                  ))}

                  <textarea
                    className="mb-2 textArea"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    type="textarea"
                    rows="3"
                    placeholder='Project Description'
                  />
                  <Button className='formbtn'
                    variant="contained"
                    color="primary"
                    type='submit'
                  >
                    {isNewProject ? 'Add Project' : 'Save Changes'}
                  </Button>
                  <>
                  </>
                </Form>
              </div>

            </Box>
          </Modal>
        </>
      ))}
    </>
  );
}
