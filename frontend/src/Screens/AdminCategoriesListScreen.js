import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import data from "../dummyData";
import { Button, Grid } from "@mui/material";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Form } from "react-bootstrap";
import { BiPlusMedical } from "react-icons/bi";
import { Store } from "../Store";

const columns = [
  { field: "_id", headerName: "ID", width: 90 },
  {
    field: "categoryName",
    headerName: "categoryName",
    width: 250,
  },
  {
    field: "sortDesc",
    headerName: "sortDesc",
    width: 250,
  },
  {
    field: "categoryImg",
    headerName: "categoryImg",
    width: 210,
  },
];

const deleteHandle = async () => {
  if (window.confirm("Are you sure to delete ?")) {
    try {
    } catch (error) {}
  }
};

const getRowId = (row) => row._id;

export default function AdminContractorListScreen() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewCategory, setIsNewCategory] = React.useState(false);

  const handleEdit = (params) => {
    setSelectedRowData(params);
    setIsModelOpen(true);
    setIsNewCategory(false);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewCategory(true);
  };

  const handleSubmitNewCategory = () => {
    setIsModelOpen(false);
  };
  const { state, dispatch: ctxDispatch } = React.useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  return (
    <>
      <div className="px-3 mt-3">
        <Button
          variant="outlined"
          className=" m-2 d-flex globalbtnColor"
          onClick={handleNew}
        >
          <BiPlusMedical className="mx-2" />
          Add Category
        </Button>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            className={`tableBg mx-2 ${theme}DataGrid`}
            rows={data.categories}
            columns={[
              ...columns,
              {
                field: "action",
                headerName: "Action",
                width: 250,
                renderCell: (params) => {
                  return (
                    <Grid item xs={8}>
                      <Button
                        variant="contained"
                        className="mx-2 tableEditbtn"
                        onClick={() => handleEdit(params.row)}
                        startIcon={<MdEdit />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        className="mx-2 tableDeletebtn"
                        onClick={deleteHandle}
                        startIcon={<AiFillDelete />}
                      >
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
            className="modelBg modalRespnsive"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Form>
              {isNewCategory ? (
                <h4 className="d-flex justify-content-center">
                  Add new Category Details
                </h4>
              ) : (
                <h4 className="d-flex justify-content-center">
                  Edit Category Details
                </h4>
              )}
              <TextField
                className="mb-2"
                value={
                  isNewCategory
                    ? ""
                    : selectedRowData
                    ? selectedRowData.categoryName
                    : ""
                }
                label="Category Name"
                fullWidth
              />
              <TextField
                className="mb-2"
                value={
                  isNewCategory
                    ? ""
                    : selectedRowData
                    ? selectedRowData.sortDesc
                    : ""
                }
                label="Add description"
                fullWidth
              />
              <TextField
                className="mb-2"
                value={
                  isNewCategory
                    ? ""
                    : selectedRowData
                    ? selectedRowData.categoryImg
                    : ""
                }
                label="Add Image"
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitNewCategory}
                onChange={(e) => e.target.value}
              >
                {isNewCategory ? "Add Project" : "Save Changes"}
              </Button>
            </Form>
          </Box>
        </Modal>
      </div>
    </>
  );
}
