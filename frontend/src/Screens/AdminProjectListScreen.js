import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import data from '../dummyData';
import { Button, Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
const columns = [
  { field: '_id', headerName: 'ID', width: 90 },
  {
    field: 'agentName',
    headerName: 'Agent Name',
    width: 150,
  },
  {
    field: 'contractorName',
    headerName: 'Contractor Name',
    width: 150,
  },
  {
    field: 'projectName',
    headerName: 'Project Name',
    width: 110,
  },
  {
    field: 'progress',
    headerName: 'Progress',
    width: 90,
  },
  {
    field: 'startDate',
    type: 'number',
    headerName: 'Start Date',
    width: 110,
  },

  {
    field: 'endDate',
    type: 'number',
    headerName: 'endDate',
    width: 110,
  },
];

const deleteHandle = async () => {
  if (window.confirm('Are you sure to delete ?')) {
    try {
    } catch (error) { }
  }
};

const getRowId = (row) => row._id;

export default function AdminProjectListScreen() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewProject, setIsNewProject] = React.useState(false);

  const handleEdit = (params) => {
    setSelectedRowData(params);
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

  const handleSubmitNewProject = () => {
    setIsModelOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}>
        Add Project
      </Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          className="tableBg mx-2"
          rows={data.projectList}
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
                      onClick={() => handleEdit(params.row)}
                      startIcon={<MdEdit />}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      className="mx-2 tableDeletebtn"
                      onClick={deleteHandle}
                      startIcon={<AiFillDelete />}>
                      Delete
                    </Button>
                  </Grid>
                );
              },
            },
          ]}
          getRowId={getRowId}
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
          <Form>
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
              value={
                isNewProject
                  ? ''
                  : selectedRowData
                    ? selectedRowData.agentName
                    : ''
              }
              label="Agent Name"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewProject
                  ? ''
                  : selectedRowData
                    ? selectedRowData.contractorName
                    : ''
              }
              label="Contractor Name"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewProject
                  ? ''
                  : selectedRowData
                    ? selectedRowData.projectName
                    : ''
              }
              label="Project Name"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewProject
                  ? ''
                  : selectedRowData
                    ? selectedRowData.progress
                    : ''
              }
              label="progress"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitNewProject}
              onChange={(e) => e.target.value}>
              {isNewProject ? 'Add Project' : 'Save Changes'}
            </Button>
          </Form>
        </Box>
      </Modal>
    </>
  );
}
