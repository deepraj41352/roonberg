import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import data from "../dummyData";
import { Button, FormControl, Grid, MenuItem, Select } from "@mui/material";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Form } from "react-bootstrap";
import { BiPlusMedical } from "react-icons/bi";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true };
    case "FATCH_SUCCESS":
      return { ...state, adminData: action.payload, loading: false };
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false };

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
  }
};

const columns = [
  { field: "_id", headerName: "ID", width: 80 },
  {
    field: "first_name",
    headerName: "Admin Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
  },
];

export default function AdminListScreen() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [isNewAdmin, setIsNewAdmin] = React.useState(false);
  const role = "admin";
  const { state } = React.useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  const [
    { loading, error, adminData, successDelete, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    error: "",
    adminData: [],
    successDelete: false,
    successUpdate: false,
  });

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewAdmin(true);
  };

  const handleEdit = (userid) => {
    const adminToEdit = adminData.find(
      (admin) => admin && admin._id === userid
    );
    setName(adminToEdit ? adminToEdit.first_name : "");
    setEmail(adminToEdit ? adminToEdit.email : "");
    setStatus(adminToEdit ? adminToEdit.status : "active");
    setSelectedRowData(adminToEdit);
    setIsModelOpen(true);
    setIsNewAdmin(false);
  };

  React.useEffect(() => {
    const FatchadminData = async () => {
      try {
        dispatch("FATCH_REQUEST");
        const response = await axios.post(
          `/api/user/`,
          { role: role },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const datas = response.data;
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            first_name: items.first_name,
            email: items.email,
            status: items.status,
          };
        });
        dispatch({ type: "FATCH_SUCCESS", payload: rowData });
      } catch (error) {
        console.log(error);
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else if (successUpdate) {
      dispatch({ type: "UPDATE_RESET" });
    } else {
      FatchadminData();
    }
  }, [successDelete, successUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNewAdmin) {
      const response = await axios.post(`/api/user/signup`, {
        first_name: name,
        email: email,
        password: password,
        role: role,
      });
      if (response.status === 201) {
        toast.success("admin added Successfully !");
        const datas = response.data;
        setIsModelOpen(false);
        dispatch({ type: "FATCH_SUCCESS", payload: datas });
        dispatch({ type: "UPDATE_SUCCESS", payload: true });
      }
    } else {
      const response = await axios.put(
        `/api/user/update/${selectedRowData._id}`,
        {
          first_name: name,
          email: email,
          role: role,
        },

        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (response.status === 200) {
        toast.success(response.data);
        setIsModelOpen(false);
        dispatch({ type: "UPDATE_SUCCESS", payload: true });
      }
    }
  };

  const deleteHandle = async (userid) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        const response = await axios.delete(`/api/user/${userid}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success("admin data deleted successfully!");
          dispatch({
            type: "DELETE_SUCCESS",
            payload: true,
          });
        } else {
          toast.error("Failed to delete admin data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting admin data.");
      }
    }
  };

  const handleSubmitNewAdmin = () => {
    setIsModelOpen(false);
  };

  return (
    <>
      {loading ? (
        <div>Loading .....</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <Button
            variant="outlined"
            className=" m-2 d-flex globalbtnColor"
            onClick={handleNew}
          >
            <BiPlusMedical className="mx-2" />
            Add Admin
          </Button>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              className={`tableBg mx-2 ${theme}DataGrid`}
              rows={adminData}
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
              <Form onSubmit={handleSubmit}>
                <ImCross
                  color="black"
                  className="formcrossbtn"
                  onClick={handleCloseRow}
                />
                {isNewAdmin ? (
                  <h4 className="d-flex justify-content-center">
                    Add new Admin Details
                  </h4>
                ) : (
                  <h4 className="d-flex justify-content-center">
                    Edit Admin Details
                  </h4>
                )}
                <TextField
                  className="mb-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Username"
                  fullWidth
                />

                <TextField
                  className="mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  fullWidth
                />
                {isNewAdmin && (
                  <TextField
                    className="mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    fullWidth
                  />
                )}

                <FormControl className="formselect">
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <br></br>
                <Button
                  className="mt-2 formbtn"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {isNewAdmin ? "Add admin" : "Save Changes"}
                </Button>
              </Form>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
}
