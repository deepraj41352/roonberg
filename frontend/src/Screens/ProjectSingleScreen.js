import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Store } from "../Store";
import { Button, Form } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true };
    case "FATCH_SUCCESS":
      return { ...state, projectData: action.payload, loading: false };
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SUCCESS_CATEGORY":
      return { ...state, categoryData: action.payload, loading: false };
    case "ERROR_CATEGORY":
      return { ...state, error: action.payload, loading: false };
    case "UPDATE_SUCCESS":
      return { ...state, successUpdate: action.payload };

    case "UPDATE_RESET":
      return { ...state, successUpdate: false };

    default:
      return state;
  }
};

function ProjectSingleScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("param:", id);
  const { state } = useContext(Store);
  // const { userInfo } = state;
  // const { state, dispatch: ctxDispatch } = React.useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  const [
    { loading, error, projectData, categoryData, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    error: "",
    projectData: {},
    categoryData: {},
    successUpdate: false,
  });
  const [conversations, setConversation] = useState([]);
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/api/conversation/${id}`);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
        
      }
    };
    getConversations();
  }, []);
  console.log("convsrsation",conversations)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        dispatch("FETCH_REQUEST");
        const response = await axios.get(`/api/project/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        console.log("datasss",datas)
        dispatch({ type: "FETCH_SUCCESS", payload: datas });
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    fetchProjectData();
  }, []);
console.log('project datass',projectData)
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        dispatch("FETCH_REQUEST");
        const response = await axios.get(`/api/category`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const category = response.data;
        console.log(category);
        dispatch({ type: "SUCCESS_CATEGORY", payload: category });
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, []);

  const [value, setvalue] = useState("");
  const [placeholder, setPlaceholder] = useState("Categories");

  const handleOnchange = (val) => {
    console.log("val", val);
    setvalue(val);
    setPlaceholder("");
  };
  console.log("categoryData", categoryData);
  const options = {};
  // const options = categoryData.map((item) => ({
  //   label: item.categoryName,
  //   value: item.categoryName,
  // }));
  console.log("options", options);

  return (
    <div>
      {loading ? (
        <div>Loading ...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <div className="d-flex w-100 my-3 gap-4 justify-content-center align-item-center projectScreenCard-outer ">
            <Card className={`projectScreenCard ${theme}CardBody`}>
              <Card.Header className={`${theme}CardHeader`}>
                Project Details
              </Card.Header>
              <Card.Body className="text-start">
                <Form className="px-3">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Project Name</Form.Label>
                    <Form.Control type="text" value={projectData.projectName} />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label className="fw-bold">
                      Project Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={projectData.projectDescription}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Categories</Form.Label>
                    <MultiSelect
                      className="categorieslist"
                      onChange={handleOnchange}
                      options={options}
                      placeholder={placeholder}
                    />
                  </Form.Group>
                  <div className="d-flex gap-3 mb-3">
                    <Form.Group className="w-100" controlId="duedate">
                      <Form.Label className="fw-bold">Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="duedate"
                        value={projectData.createdDate}
                        placeholder="Due date"
                      />
                    </Form.Group>
                    <Form.Group className="w-100" controlId="duedate">
                      <Form.Label className="fw-bold">End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="duedate"
                        placeholder="Due date"
                      />
                    </Form.Group>
                  </div>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <Card className={`projectScreenCard2 ${theme}CardBody`}>
              <Card.Header className={`${theme}CardHeader`}>Chats</Card.Header>
              <Card.Body className="d-flex flex-wrap gap-3 ">
                {conversations.map((conversion) => {
                  return (
                    <>
                    {userInfo.role == "agent" ? (
                      <>
                      {conversion.members.includes(userInfo._id) && (     
                        <Card className="chatboxes">
                        <Card.Header>Chat</Card.Header>
                        <Card.Body>
                         <Link to={`/chatWindowScreen/${conversion._id}`}>
                          <Button
                            className="chatBtn"
                            type="button"
                            // onClick={conversionHandler(conversion._id)}
                          >
                            {conversion._id}
                          </Button>
                        </Link>
                        </Card.Body>
                        </Card>
                      )}
                      </>
                      ):(
                        <>
                          <Card className="chatboxes">
                          <Card.Header>Chat</Card.Header>
                          <Card.Body>
                           <Link to={`/chatWindowScreen/${conversion._id}`}>
                            <Button
                              className="chatBtn"
                              type="button"
                              // onClick={conversionHandler(conversion._id)}
                            >
                              {conversion._id}
                            </Button>
                          </Link>
                          </Card.Body>
                          </Card>
                        </>
                        )}

                    </>
                  );
                })}
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSingleScreen;
