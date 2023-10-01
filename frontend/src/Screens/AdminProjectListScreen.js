import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [{ loading, error, projectData, successDelete, successUpdate }, dispatch] = React.useReducer(reducer,
    {
      loading: true,
      error: '',
      projectData: [],
      successDelete: false,
      successUpdate: false
    })

  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [projectOwner, setProjectOwner] = React.useState('');
  const [assignedAgent, setAssignedAgent] = React.useState('');

  const handleEdit = (userid) => {
    const constractorToEdit = projectData.find((constractor) => constractor && constractor._id === userid);
    setProjectName(constractorToEdit ? constractorToEdit.projectName : '');
    setProjectDescription(constractorToEdit ? constractorToEdit.projectDescription : '');
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
    const FatchProjectData = async () => {
      try {
        dispatch("FATCH_REQUEST")
        const response = await axios.get(`/api/project/`);
        const datas = response.data
        console.log(datas)
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
        projectName: projectName, projectDescription: projectDescription
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

  return (
    <>
      {loading ? (
        <div>Loading .....</div>
      ) : (error ? (
        <div>{error}</div>
      ) : (
        <>
          <Button
            variant="outlined"
            className=" m-2 d-flex globalbtnColor"
            onClick={handleNew}>
            <BiPlusMedical className='mx-2' />
            Add Project
          </Button>
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
              }}>
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
                  value={isNewProject ? '' : projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  label="Project Name"
                  fullWidth
                />
                <TextField
                  className="mb-2"
                  value={isNewProject ? '' : projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  label="Project Description"
                  fullWidth
                />
                <TextField
                  className="mb-2"
                  value={
                    isNewProject ? '' : projectOwner
                  }
                  onChange={(e) => setProjectOwner(e.target.value)}
                  label="Project Owner"
                  fullWidth
                />

                <TextField
                  className="mb-2"
                  value={
                    isNewProject ? '' : assignedAgent
                  }
                  onChange={(e) => setAssignedAgent(e.target.value)}
                  label="Assigned Agent"
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  type='submit'
                >
                  {isNewProject ? 'Add Project' : 'Save Changes'}
                </Button>
              </Form>
            </Box>
          </Modal>
        </>))}

    </>
  );
}
