import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Form, Toast } from "react-bootstrap";
import { BiPlusMedical } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { ImCross } from "react-icons/im";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true };
    case "FATCH_SUCCESS":
      return { ...state, AgentData: action.payload, loading: false };
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "DELETE_SUCCESS":
      return { ...state, successDelete: action.payload };

    case "DELETE_RESET":
      return { ...state, successDelete: false };
    case "FATCH_CATEGORY":
      return { ...state, categoryData: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: "_id", headerName: "ID", width: 150 },
  {
    field: "first_name",
    headerName: "Agent Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "agentCategory",
    headerName: "Category",
    width: 150,
  },
  {
    field: "userStatus",
    headerName: "Status",
    width: 150,
  },
];

export default function AdminAgentListScreen() {
  const role = "agent";
  const navigate = useNavigate();
  const { state } = React.useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  const [isModelOpen, setIsModelOpen] = React.useState(false);

  const [{ loading, error, AgentData, successDelete, categoryData }, dispatch] =
    React.useReducer(reducer, {
      loading: true,
      error: "",
      AgentData: [],
      successDelete: false,
      categoryData: [],
    });

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [selectcategory, setSelectCategory] = React.useState("");
  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setIsModelOpen(true);
  };

  const handleEdit = (userid) => {
    navigate(`/adminEditAgent/${userid}`);
  };

  React.useEffect(() => {
    const FatchAgentData = async () => {
      try {
        dispatch("FATCH_REQUEST");
        const response = await axios.post(`/api/user/`, { role: role });
        const datas = response.data;
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            first_name: items.first_name,
            email: items.email,
            userStatus: items.userStatus,
            agentCategory: items.agentCategory,
          };
        });
        dispatch({ type: "FATCH_SUCCESS", payload: rowData });
      } catch (error) {
        console.log(error);
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      FatchAgentData();
    }
  }, [successDelete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/user/add`,
        {
          first_name: name,
          email: email,
          password: password,
          role: role,
          userStatus: status,
          agentCategory: selectcategory,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Agent added Successfully !");
        const datas = response.data;
        setIsModelOpen(false);
        dispatch({ type: "FATCH_SUCCESS", payload: datas });
        dispatch({ type: "UPDATE_SUCCESS", payload: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const deleteHandle = async (userid) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        const response = await axios.delete(`/api/user/${userid}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success("Agent data deleted successfully!");
          dispatch({
            type: "DELETE_SUCCESS",
            payload: true,
          });
        } else {
          toast.error("Failed to delete agent data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting agent data.");
      }
    }
  };

  React.useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch("FATCH_REQUEST");
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        setSelectCategory(datas);
        dispatch({ type: "FATCH_CATEGORY", payload: datas });
      } catch (error) {
        console.log(error);
      }
    };
    FatchCategory();
  }, []);

  return (
    <>
      <div className="px-3 mt-3">
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
            <Button
              variant="outlined"
              className=" m-2 d-flex globalbtnColor"
              onClick={handleNew}
            >
              <BiPlusMedical className="mx-2" />
              Add Agent
            </Button>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                className={`tableBg mx-2 ${theme}DataGrid`}
                rows={AgentData}
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
                  <h4 className="d-flex justify-content-center text-dark">
                    Add Agent
                  </h4>
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
                    type="email"
                    fullWidth
                  />
                  <TextField
                    className="mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    type="password"
                    fullWidth
                  />

                  <FormControl>
                    <InputLabel>Choose Options</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  {/* <select className='formselect mb-2' value={category} onChange={(e) => setCategory(e.target.value)} >
                    <option value="" >
                      Select a category
                    </option>
                    {categoryData.map((items) => (
                      <option key={items._id} value={items._id} >{items.categoryName}</option>
                    ))}
                  </select> */}
                  <FormControl>
                    <InputLabel>Choose Category</InputLabel>
                    <Select
                      value={selectcategory}
                      onChange={(e) => setSelectCategory(e.target.value)}
                    >
                      {categoryData.map((items) => (
                        <MenuItem key={items._id} value={items._id}>
                          {items.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <br></br>
                  <Button
                    className="mt-2 formbtn"
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Form>
              </Box>
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
