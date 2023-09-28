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
  { field: '_id', headerName: 'ID', width: 80 },
  {
    field: 'username',
    headerName: 'Username',
    width: 100,
  },
  {
    field: 'firstName',
    headerName: 'First Name',
    width: 100,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    width: 100,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 180,
  },
  {
    field: 'userStatus',
    headerName: 'User Status',
    width: 120,
  },
  {
    field: 'assignedCategory',
    headerName: 'Assigned Category',
    width: 150,
  },
];

const deleteHandle = async () => {
  if (window.confirm('Are you sure to delete ?')) {
    try {
    } catch (error) { }
  }
};

const getRowId = (row) => row._id;

export default function AdminAgentListScreen() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewAgent, setIsNewAgent] = React.useState(false);

  const handleEdit = (params) => {
    setSelectedRowData(params);
    setIsModelOpen(true);
    setIsNewAgent(false);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewAgent(true);
  };

  const handleSaveAgent = () => {
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
          rows={data.agentData}
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
            {isNewAgent ? (
              <h4 className="d-flex justify-content-center">
                Add new Agent Details
              </h4>
            ) : (
              <h4 className="d-flex justify-content-center">
                Edit Agent Details
              </h4>
            )}
            <TextField
              className="mb-2"
              value={
                isNewAgent
                  ? ''
                  : selectedRowData
                    ? selectedRowData.username
                    : ''
              }
              label="Username"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewAgent
                  ? ''
                  : selectedRowData
                    ? selectedRowData.firstName
                    : ''
              }
              label="First Name"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewAgent
                  ? ''
                  : selectedRowData
                    ? selectedRowData.lastName
                    : ''
              }
              label="Last Name"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewAgent ? '' : selectedRowData ? selectedRowData.email : ''
              }
              label="Email"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewAgent
                  ? ''
                  : selectedRowData
                    ? selectedRowData.userStatus
                    : ''
              }
              label="User Status"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewAgent
                  ? ''
                  : selectedRowData
                    ? selectedRowData.assignedCategory
                    : ''
              }
              label="Assigned Category"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAgent}
              onChange={(e) => e.target.value}>
              {isNewAgent ? 'Add Agent' : 'Save Changes'}
            </Button>
          </Form>
        </Box>
      </Modal>
    </>
  );
}
