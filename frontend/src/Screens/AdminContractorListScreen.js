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
    field: 'contractorName',
    headerName: 'Contractor Name',
    width: 150,
  },
  {
    field: 'projectName',
    headerName: 'Project Name',
    width: 150,
  },
  {
    field: 'progress',
    headerName: 'Progress',
    width: 90,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 110,
  },
  {
    field: 'endDate',
    headerName: 'End Date',
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

export default function AdminContractorListScreen() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewContractor, setIsNewContractor] = React.useState(false);

  const handleEdit = (params) => {
    setSelectedRowData(params);
    setIsModelOpen(true);
    setIsNewContractor(false);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewContractor(true);
  };

  const handleSubmitNewContractor = () => {
    setIsModelOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}>
        Add Contractor
      </Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          className="tableBg mx-2"
          rows={data.contractorData}
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
            {isNewContractor ? (
              <h4 className="d-flex justify-content-center">
                Add new Contractor Details
              </h4>
            ) : (
              <h4 className="d-flex justify-content-center">
                Edit Contractor Details
              </h4>
            )}
            <TextField
              className="mb-2"
              value={
                isNewContractor
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
                isNewContractor
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
                isNewContractor
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
                isNewContractor
                  ? ''
                  : selectedRowData
                    ? selectedRowData.progress
                    : ''
              }
              label="Progress"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewContractor
                  ? ''
                  : selectedRowData
                    ? selectedRowData.startDate
                    : ''
              }
              label="Start Date"
              fullWidth
            />
            <TextField
              className="mb-2"
              value={
                isNewContractor
                  ? ''
                  : selectedRowData
                    ? selectedRowData.endDate
                    : ''
              }
              label="End Date"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitNewContractor}
              onChange={(e) => e.target.value}>
              {isNewContractor ? 'Add Contractor' : 'Save Changes'}
            </Button>
          </Form>
        </Box>
      </Modal>
    </>
  );
}
