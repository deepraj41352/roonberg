import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { MdPlaylistRemove, MdPlaylistAdd } from "react-icons/md";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Form } from "react-bootstrap";
import { BiPlusMedical } from "react-icons/bi";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";
import Tab from "react-bootstrap/Tab";
import { ThreeDots } from "react-loader-spinner";
import Tabs from "react-bootstrap/Tabs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer, useState } from "react";
import { GrAddCircle } from "react-icons/gr";
import { MdRemoveCircleOutline } from "react-icons/md";
import dayjs from "dayjs";
import { ImCross } from "react-icons/im";
const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true };
    case "FATCH_SUCCESS":
      return { ...state, projectData: action.payload, loading: false };
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
    case "FATCH_CATEGORY":
      return { ...state, categoryData: action.payload };
    case "FATCH_AGENTS":
      return { ...state, agentData: action.payload };
    case "FATCH_CONTRACTOR":
      return { ...state, contractorData: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: "_id", headerName: "ID", width: 90 },
  {
    field: "projectName",
    headerName: "Project Name",
    width: 150,
  },
  {
    field: "projectDescription",
    headerName: "Description",
    width: 150,
  },
  {
    field: "projectCategory",
    headerName: "Category",
    width: 150,
  },

  {
    field: "projectOwner",
    headerName: "Contractor",
    width: 90,
  },
  {
    field: "assignedAgent",
    headerName: "Agent",
    width: 90,
  },
];

export default function AdminProjectListScreen() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [morefieldsModel, setMorefieldsModel] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
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
    error: "",
    projectData: [],
    successDelete: false,
    successUpdate: false,
    categoryData: [],
    contractorData: [],
    agentData: [],
  });

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const navigate = useNavigate();
  const [agents, setAgents] = useState([
    { categoryId: "", categoryName: "", agentName: "", agentId: "" },
  ]);
  console.log(agents, "agents2");
  const categoryNames = agents.map((agent) => agent.categoryName);
  const agentNames = agents.map((agent) => agent.agentName);
  console.log(categoryNames);
  console.log(agentNames);
  const pairedValues = categoryNames.map((categoryNames, index) => (
    <div className="d-flex category-agent-block rounded-1 mb-2">
      <p className="flex-1 mb-1 ps-1">{categoryNames}</p>
      <p className="flex-1 mb-1">{agentNames[index]}</p>
    </div>
  ));

  const [categories, setCategories] = useState([]);
  const [projectStatus, setProjectStatus] = useState();

  const assignedAgentByCateHandle = (index) => {
    const category = agents[index].categoryId;
    if (category) {
      const selectedCategory1 = categoryData.find(
        (categoryItem) => categoryItem._id === category
      );
      const agentsForCategory = agentData.filter(
        (agentItem) => agentItem.agentCategory === selectedCategory1._id
      );
      if (agentsForCategory.length > 0) {
        return agentsForCategory;
      }
    }
    return [];
  };

  const handleAgentChange = (index, key, value) => {
    console.log("Value received:", value);
    const updatedAgents = [...agents];
    updatedAgents[index] = {
      ...updatedAgents[index],
      [key]: value,
    };

    const categoryName = categoryData.find(
      (categoryItem) => categoryItem._id === value
    );
    if (categoryName) {
      updatedAgents[index].categoryName = categoryName.categoryName;
    }

    const agentName = agentData.find((agentItem) => agentItem._id === value);
    if (agentName) {
      updatedAgents[index].agentName = agentName.first_name;
    }

    if (key === "categoryId" && value !== "") {
      const selectedCategory = categoryData.find(
        (categoryItem) => categoryItem._id === value
      );

      if (selectedCategory) {
        const categoryObject = {
          categoryId: selectedCategory._id,
          categoryName: selectedCategory.categoryName,
        };
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[index] = categoryObject;
          return updatedCategories;
        });
      }
    }

    setAgents(updatedAgents);
  };

  const addAgent = () => {
    setAgents([...agents, { categoryId: "", agentId: "" }]);
  };
  const removeAgent = (index) => {
    const updatedAgents = [...agents];
    updatedAgents.splice(index, 1);
    setAgents(updatedAgents);
  };

  const handleEdit = (userid) => {
    navigate(`/adminEditProject/${userid}`);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };
  const HandelClose = () => {
    setMorefieldsModel(false);
  };
  const handleNew = () => {
    setIsModelOpen(true);
    setIsNewProject(true);
  };

  useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch("FATCH_REQUEST");
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        dispatch({ type: "FATCH_CATEGORY", payload: datas });
      } catch (error) {
        console.log(error);
      }
    };
    FatchCategory();
  }, []);

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "contractor" });
        const datas = response.data;
        dispatch({ type: "FATCH_CONTRACTOR", payload: datas });
      } catch (error) {}
    };
    FatchContractorData();
  }, []);

  useEffect(() => {
    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "agent" });
        const datas = response.data;
        dispatch({ type: "FATCH_AGENTS", payload: datas });
      } catch (error) {}
    };
    FatchAgentData();
  }, []);

  useEffect(() => {
    const FatchProjectData = async () => {
      try {
        dispatch({ type: "FATCH_REQUEST" });
        const response = await axios.get("/api/project", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        const rowData = datas.map((items) => {
          const contractor = contractorData.find(
            (contractor) => contractor._id === items.projectOwner
          );

          return {
            ...items,
            _id: items._id,
            projectName: items.projectName,
            projectDescription:
              items.projectDescription == ""
                ? "No Description"
                : items.projectDescription,
            projectCategory: items.projectCategory
              ? items.projectCategory.map((cat) => cat.categoryName)
              : "",
            assignedAgent: items.assignedAgent
              ? items.assignedAgent.map((agent) => agent.agentName)
              : "",
            projectOwner: contractor ? contractor.first_name : "",
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
      FatchProjectData();
    }
  }, [successDelete, successUpdate, dispatch, userInfo.token, contractorData]);

  const projectActiveData = projectData.filter((item) => {
    return item.projectStatus === "active";
  });
  const projectCompleteData = projectData.filter((item) => {
    return item.projectStatus === "complete";
  });
  const projectQuedData = projectData.filter((item) => {
    return item.projectStatus === "qued";
  });
  const assignedAgent = projectData.filter((item) => {
    return item.assignedAgent.length === 0;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const response = await axios.post(
        "/api/project/admin/addproject",
        {
          projectName: projectName,
          projectDescription: projectDescription,
          createdDate: startDate,
          endDate: endDate,
          assignedAgent: agents,
          projectCategory: categories,
          projectOwner: projectOwner,
          projectStatus: projectStatus,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(response.data.message);
      console.log(response);
      dispatch({ type: "UPDATE_SUCCESS", payload: true });
      dispatch({ type: "UPDATE_SUCCESS", payload: true });
      if (response.status === 201) {
        toast.success(response.data.message);
        const datas = response.data;
        setIsModelOpen(false);
        setIsSubmiting(false);
        setProjectName("");
        setProjectDescription("");
        startDate();
        endDate();
        setAgents([{}]);
        setProjectStatus("");
        setProjectOwner("");
      }
    } catch (error) {
      toast.error(error.response);
      console.log(error);
      setIsSubmiting(false);
    }
  };

  const deleteHandle = async (productId) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        const response = await axios.delete(`/api/project/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success("Data deleted successfully!");
          dispatch({
            type: "DELETE_SUCCESS",
            payload: true,
          });
        } else {
          toast.error("Failed to delete data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting data.");
      }
    }
  };

  const handleRedirectToContractorScreen = () => {
    navigate("/adminEditProject");
  };

  const handleAssigndment = (userid) => {
    navigate(`/AdminAssignAgent/${userid}`);
  };

  const currentDate = dayjs();

  const validateDates = (newStartDate, newEndDate) => {
    const selectedStartDate = dayjs(newStartDate);
    const selectedEndDate = dayjs(newEndDate);

    if (
      selectedStartDate.isAfter(currentDate, "day") ||
      selectedStartDate.isSame(currentDate, "day")
    ) {
      setStartDate(newStartDate);
      setStartDateError("");

      if (newEndDate) {
        if (
          selectedEndDate.isAfter(selectedStartDate, "day") ||
          selectedEndDate.isSame(selectedStartDate, "day")
        ) {
          setEndDate(newEndDate);
          setEndDateError("");
        } else {
          setEndDateError(
            "End date must be greater than or equal to the Start Date."
          );
        }
      }
    } else {
      setStartDateError(
        "Start date must be greater than or equal to the current date."
      );
    }
  };

  const moreFieldsopen = () => {
    setMorefieldsModel(true);
  };

  return (
    <>
      <div className="px-3 mt-3">
        <Button
          variant="outlined"
          className=" m-2 d-flex globalbtnColor"
          onClick={handleNew}
        >
          <BiPlusMedical className="mx-2" />
          Add Project
        </Button>
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
            <Tabs
              defaultActiveKey="All"
              id="uncontrolled-tab-example"
              className={`mb-0  tab-btn ${theme}Tab`}
            >
              <Tab className="tab-color" eventKey="All" title="All">
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    className={
                      theme == "light"
                        ? `${theme}DataGrid`
                        : `tableBg ${theme}DataGrid`
                    }
                    rows={projectData}
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
                              >
                                Edit
                              </Button>

                              <Button
                                variant="outlined"
                                className="mx-2 tableDeletebtn"
                                onClick={() => deleteHandle(params.row._id)}
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
                    <Form
                      className="scrollInAdminproject"
                      onSubmit={handleSubmit}
                    >
                      <ImCross
                        color="black"
                        className="formcrossbtn"
                        onClick={handleCloseRow}
                      />
                      <h4 className="d-flex justify-content-center">
                        Add Project
                      </h4>
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
                        <InputLabel>Select Contractor</InputLabel>
                        <Select
                          value={projectOwner}
                          onChange={(e) => setProjectOwner(e.target.value)}
                        >
                          <MenuItem
                            onClick={() => {
                              handleRedirectToContractorScreen();
                            }}
                          >
                            {" "}
                            <BiPlusMedical /> add new Contractor
                          </MenuItem>
                          {contractorData.map((items) => (
                            <MenuItem key={items._id} value={items._id}>
                              {items.first_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {/* Remove the existing mapping */}
                      {/* <div>
                        <FormControl className="mb-3">
                          <InputLabel>Select Category</InputLabel>
                          <Select
                            value={agents[0].categoryId}
                            onChange={(e) => handleAgentChange(0, 'categoryId', e.target.value)}
                          >
                            <MenuItem disabled={agents[0].categoryId !== ''}>Select Category</MenuItem>
                            {categoryData.map((category) => (
                              <MenuItem key={category._id} value={category._id}
                                disabled={agents.some((a) => a.categoryId === category._id)}
                              >
                                {category.categoryName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl className="mb-3">
                          <InputLabel>Select Agent</InputLabel>
                          <Select
                            value={agents[0].agentId}
                            onChange={(e) => handleAgentChange(0, 'agentId', e.target.value)}
                          >
                            <MenuItem disabled={agents[0].agentId !== ''}>Select Agent</MenuItem>
                            {assignedAgentByCateHandle(0).map((agent) => 
                              <MenuItem key={agent._id} value={agent._id}
                                disabled={agents.some((a) => a.agentId === agent._id)}
                              >
                                {agent.first_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div> */}

                      {/* {agents.map((agent, index) => (
                        <div key={index}>
                          <FormControl className="mb-3">
                            <InputLabel>Select Category</InputLabel>
                            <Select
                              value={agent.categoryId}
                              onChange={(e) => handleAgentChange(index, 'categoryId', e.target.value)}
                            >
                              <MenuItem disabled={agent.categoryId !== ''}>Select Category</MenuItem>
                              {categoryData.map((category) => (
                                <MenuItem key={category._id} value={category._id}
                                  disabled={agents.some((a) => a.categoryId === category._id)}
                                >
                                  {category.categoryName}

                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl className="mb-3">
                            <InputLabel>Select Agent</InputLabel>
                            <Select
                              value={agent.agentId}
                              onChange={(e) => handleAgentChange(index, 'agentId', e.target.value)}
                            >
                              <MenuItem disabled={agent.agentId !== ''}>Select Agent</MenuItem>
                              {assignedAgentByCateHandle(index).map((agent) => (
                                <MenuItem key={agent._id} value={agent._id}
                                  disabled={agents.some((a) => a.agentId === agent._id)}
                                >
                                  {agent.first_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      ))} */}
                      <div
                        className="p-2"
                        style={{
                          display:
                            categoryNames.length === 0 ? "none" : "block",
                        }}
                      >
                        <div className="d-flex mb-1">
                          <div className="flex-1 fw-bold">Category</div>
                          <div className="flex-1  fw-bold">Agent</div>
                        </div>
                        {pairedValues}
                      </div>
                      {/* <div>{pairedValues}</div> */}

                      {/* ------- */}
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="d-flex align-items-center"
                          onClick={moreFieldsopen}
                        >
                          <MdPlaylistAdd color="black" className="mx-2 " />
                          Add Category/Agent
                        </div>
                        <div className="d-flex align-items-center">
                          <MdPlaylistRemove
                            color="black"
                            className="mx-2"
                            onClick={moreFieldsopen}
                          />
                          <p className="text-dark m-0 ">Remove</p>
                        </div>
                      </div>
                      <FormControl className="mb-3">
                        <InputLabel>Select Status</InputLabel>
                        <Select
                          value={projectStatus}
                          onChange={(e) => setProjectStatus(e.target.value)}
                        >
                          <MenuItem value=""> Select Status </MenuItem>
                          <MenuItem value="active"> Active </MenuItem>
                          <MenuItem value="inactive"> Inactive </MenuItem>
                          <MenuItem value="queue"> In Proccess </MenuItem>
                        </Select>
                      </FormControl>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        className="mb-3"
                      >
                        <DateField
                          required
                          label="Start Date"
                          value={startDate}
                          onChange={(newValue) =>
                            validateDates(newValue, endDate)
                          }
                          format="MM-DD-YYYY"
                        />
                        {startDateError && (
                          <div style={{ color: "red" }}>{startDateError}</div>
                        )}
                        <DateField
                          required
                          label="End Date"
                          value={endDate}
                          onChange={(newValue) =>
                            validateDates(startDate, newValue)
                          }
                          format="MM-DD-YYYY"
                        />
                        {endDateError && (
                          <div style={{ color: "red" }}>{endDateError}</div>
                        )}
                      </LocalizationProvider>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmiting}
                      >
                        {isSubmiting ? "Submitting" : "Submit"}
                      </Button>
                    </Form>
                  </Box>
                </Modal>
                <Modal open={morefieldsModel} onClose={HandelClose}>
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
                    <Form
                      className="scrollInAdminproject"
                      onSubmit={handleSubmit}
                    >
                      <ImCross
                        color="black"
                        className="formcrossbtn"
                        onClick={HandelClose}
                      />
                      <h4 className="d-flex justify-content-center">Assign</h4>
                      {agents.map((agent, index) => (
                        <div
                          className="moreFieldsDiv d-flex align-items-center gap-2"
                          key={index}
                        >
                          <FormControl className="mb-3">
                            <InputLabel>Category</InputLabel>
                            <Select
                              value={agent.categoryId}
                              onChange={(e) =>
                                handleAgentChange(
                                  index,
                                  "categoryId",
                                  e.target.value
                                )
                              }
                              required
                            >
                              <MenuItem disabled={agent.categoryId !== ""}>
                                Category
                              </MenuItem>
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
                          <FormControl className="mb-3">
                            <InputLabel>Agent</InputLabel>
                            <Select
                              value={agent.agentId}
                              onChange={(e) =>
                                handleAgentChange(
                                  index,
                                  "agentId",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem disabled={agent.agentId !== ""}>
                                Agent
                              </MenuItem>
                              {assignedAgentByCateHandle(index).map((agent) => (
                                <MenuItem
                                  key={agent._id}
                                  value={agent._id}
                                  disabled={agents.some(
                                    (a) => a.agentId === agent._id
                                  )}
                                >
                                  {agent.first_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <div className="">
                            <MdRemoveCircleOutline
                              color="black"
                              className="mx-2"
                              onClick={() => removeAgent(index)}
                            />
                          </div>
                        </div>
                      ))}

                      <div className="d-flex align-items-center">
                        <div className="mb-3" onClick={addAgent}>
                          <MdPlaylistAdd color="black" className="mx-2" />
                          Add Category and Agent
                        </div>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={HandelClose}
                      >
                        Save
                      </Button>
                    </Form>
                  </Box>
                </Modal>
              </Tab>
              <Tab className="tab-color" eventKey="Active" title="Active">
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    className={
                      theme == "light"
                        ? `${theme}DataGrid`
                        : `tableBg ${theme}DataGrid`
                    }
                    rows={projectActiveData}
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
                              >
                                Edit
                              </Button>

                              <Button
                                variant="outlined"
                                className="mx-2 tableDeletebtn"
                                onClick={() => deleteHandle(params.row._id)}
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
              </Tab>
              <Tab className="tab-color" eventKey="Completed" title="Completed">
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    className={
                      theme == "light"
                        ? `${theme}DataGrid`
                        : `tableBg ${theme}DataGrid`
                    }
                    rows={projectCompleteData}
                    columns={[
                      ...columns,
                      {
                        field: "action",
                        headerName: "Action",
                        width: 250,
                        renderCell: (params) => {
                          return (
                            <Grid item xs={8}>
                              <Link
                                to={`/projectSingleScreen/${params.row._id}`}
                              >
                                <Button
                                  variant="contained"
                                  className="mx-2 tableEditbtn"
                                  onClick={() => handleEdit(params.row._id)}
                                >
                                  Edit
                                </Button>
                              </Link>

                              <Button
                                variant="outlined"
                                className="mx-2 tableDeletebtn"
                                onClick={() => deleteHandle(params.row._id)}
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
              </Tab>
              <Tab className="tab-color" eventKey="Qued" title="Qued">
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    className={
                      theme == "light"
                        ? `${theme}DataGrid`
                        : `tableBg ${theme}DataGrid`
                    }
                    rows={projectQuedData}
                    columns={[
                      ...columns,
                      {
                        field: "action",
                        headerName: "Action",
                        width: 250,
                        renderCell: (params) => {
                          return (
                            <Grid item xs={8}>
                              <Link
                                to={`/projectSingleScreen/${params.row._id}`}
                              >
                                <Button
                                  variant="contained"
                                  className="mx-2 tableEditbtn"
                                  onClick={() => handleEdit(params.row._id)}
                                >
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outlined"
                                className="mx-2 tableDeletebtn"
                                onClick={() => deleteHandle(params.row._id)}
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
              </Tab>
              <Tab className="tab-color" eventKey="Assigned" title="Assigned">
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    className={
                      theme == "light"
                        ? `${theme}DataGrid`
                        : `tableBg ${theme}DataGrid`
                    }
                    rows={assignedAgent}
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
                                variant="danger"
                                className="mx-2  bg-danger"
                                onClick={() =>
                                  handleAssigndment(params.row._id)
                                }
                              >
                                Assign
                              </Button>

                              {/* <Button
                              variant="outlined"
                              className="mx-2 tableDeletebtn"
                              onClick={() => deleteHandle(params.row._id)}
                              
                            >
                              Delete
                            </Button> */}
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
              </Tab>
            </Tabs>
          </>
        )}
      </div>
    </>
  );
}

// const [agents, setAgents] = useState([
//   { categoryId: '', agentName: '', agentId: '' },
// ]);

// // Function to add a new category and agent to the agents array
// const addCategoryAndAgent = () => {
//   // You can replace the default values ('' and '') with the values you want to add.
//   const newCategoryAndAgent = { categoryId: 'YourCategoryId', agentName: 'YourAgentName', agentId: 'YourAgentId' };

//   // Use the spread operator to create a new array with the new category and agent added.
//   setAgents([...agents, newCategoryAndAgent]);
// };

// // Call this function to add a new category and agent to the agents array
// addCategoryAndAgent();
