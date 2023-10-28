import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Store } from '../Store';
import { Button, Form } from 'react-bootstrap';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';
import { MdPlaylistAdd } from 'react-icons/md';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SUCCESS_CATEGORY':
      return { ...state, categoryData: action.payload, loading: false };
    case 'ERROR_CATEGORY':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };
    case "FATCH_AGENTS":
      return { ...state, agentData: action.payload };
    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case "FATCH_CONTRACTOR":
      return { ...state, contractorData: action.payload };
    case "FATCH_SUBMITTING":
      return { ...state, submitting: action.payload };
    case "REMOVE_SUBMITTING":
      return { ...state, agentCateRemoving: action.payload };
    case 'REMOVE_SUCCESS':
      return { ...state, successRemove: action.payload };
    default:
      return state;
  }
};

function AdminEditProject() {
  const { id } = useParams();
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const navigate = useNavigate();
  const [
    { loading, error, projectData, categoryData, successUpdate,
      agentData, contractorData, submitting, successRemove,
      agentCateRemoving },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    projectData: {},
    categoryData: {},
    successUpdate: false,
    agentData: [],
    contractorData: [],
    submitting: false,
    successRemove: false,
    agentCateRemoving: false
  });
  const [agentCateRemovingIndex, setAgentCateRemovingIndex] = useState(null);
  const [conversations, setConversation] = useState([]);
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState(projectData.projectCategory);
  const [projectStatus, setProjectStatus] = useState(null);
  const [projectOwner, setProjectOwner] = useState(null);
  const [createdDate, setCreatedDate] = useState();
  const [endDate, setEndDate] = useState();

  // get conversation
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/api/conversation/${id}`);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (successUpdate) {
      dispatch({ typr: "UPDATE_SUCCESS" })
    }
    else if (successRemove) {
      dispatch({ type: "REMOVE_SUCCESS" })
    }
    else {
      getConversations();
    }

  }, [successUpdate, successRemove]);

  // get project
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        dispatch('FETCH_REQUEST');
        const response = await axios.get(`/api/project/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const ProjectDatas = response.data;
        console.log('ProjectDatas', ProjectDatas);
        setEndDate(
          ProjectDatas.endDate ? ProjectDatas.endDate.split('T')[0] : null
        );
        setCreatedDate(
          ProjectDatas.createdDate
            ? ProjectDatas.createdDate.split('T')[0]
            : null
        );
        setCategories(ProjectDatas.projectCategory);
        console.log("ProjectDatas.projectCategory", ProjectDatas.projectCategory)
        setAgents(ProjectDatas.assignedAgent);
        setProjectStatus(projectData.projectStatus);
        setProjectOwner(projectData.projectOwner);
        dispatch({ type: 'FATCH_SUCCESS', payload: ProjectDatas });
      } catch (error) {
        console.error('Error fetching project data:', error);

      }
    };
    if (successUpdate) {
      dispatch({ typr: "UPDATE_SUCCESS" })
    }
    else if (successRemove) {
      dispatch({ type: "REMOVE_SUCCESS" })
    }
    else {
      fetchProjectData();
    }

  }, [successUpdate, successRemove, contractorData]);

  // get category
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        dispatch('FETCH_REQUEST');
        const response = await axios.get(`/api/category`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const category = response.data;
        dispatch({ type: 'SUCCESS_CATEGORY', payload: category });
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  // get contractor
  useEffect(() => {

    const FatchContractorData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "contractor" });
        const datas = response.data;
        dispatch({ type: "FATCH_CONTRACTOR", payload: datas })

      } catch (error) {
      }
    }
    FatchContractorData();

  }, [])

  // get agent
  useEffect(() => {

    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "agent" });
        const datas = response.data;
        dispatch({ type: "FATCH_AGENTS", payload: datas })

      } catch (error) {
      }
    }
    FatchAgentData();

  }, [])

  const selectAgentByCateHandle = (index) => {
    const category = agents[index].categoryId;
    if (Array.isArray(categoryData)) {
      if (category) {
        const selectedCategory1 = categoryData.find(categoryItem => categoryItem._id === category);
        if (selectedCategory1) {
          const agentForCategory = agentData.filter(agentItem => agentItem.agentCategory === selectedCategory1._id);
          if (agentForCategory) {
            return agentForCategory
          }
        }
      }
    }
    return [];
  }

  const addDynamicFields = () => {
    setAgents([...agents, {}]);
  };

  // const removeDynamicFields = (index) => {
  //   if (window.confirm("Are you sure to delete?")) {
  //     const updatedAgents = [...agents];
  //     updatedAgents.splice(index, 1);
  //     setAgents(updatedAgents);
  //   }
  // };


  const selectedCateAgent = (index, key, value) => {
    console.log("Value received:", value);
    const updatedAgents = [...agents];
    updatedAgents[index] = {
      ...updatedAgents[index],
      [key]: value,
    };

    const agentName = agentData.find((agentItem) => agentItem._id === value);
    if (agentName) {
      updatedAgents[index].agentName = agentName.first_name;
    }


    const categoryName = categoryData.find((categoryItem) => categoryItem._id === value);
    if (categoryName) {
      updatedAgents[index].categoryName = categoryName.categoryName;
    }
    if (key === 'categoryId' && value !== '') {

      const selectedCategory = categoryData.find((categoryItem) => categoryItem._id === value);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'FATCH_SUCCESS',
      payload: {
        ...projectData,
        [name]: value,
      },
    });
  };

  const handleRemoveAgentCategory = async (agentIndex) => {
    setAgentCateRemovingIndex(agentIndex)
    if (window.confirm('are you sure to delete ?'))
      dispatch({ type: "REMOVE_SUBMITTING", payload: true })
    try {
      const response = await axios.put(
        `/api/project/remove-agentCategoryPair/${id}`,
        { agentIndex },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.success("Agent and Category Remove Successfully !");
        dispatch({ type: "REMOVE_SUCCESS", payload: true });
        dispatch({ type: "REMOVE_SUBMITTING", payload: false })
      }
    } catch (error) {
      console.error('API Error:', error);
      dispatch({ type: "REMOVE_SUBMITTING", payload: false })
    }

  };
  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("categoryid", categories)
    dispatch({ type: "FATCH_SUBMITTING", payload: true })
    try {
      console.log("categoryid", categories)
      const response = await axios.put(
        `/api/project/assign-update/${id}`,
        {
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,

          createdDate: createdDate,
          endDate: endDate,
          assignedAgent: agents,
          projectStatus: projectStatus || projectData.projectStatus,
          projectOwner: projectOwner || projectData.projectOwner,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        toast.success('Project updated Successfully !');
        // navigate('/adminProjectList')
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
        dispatch({ type: "FATCH_SUBMITTING", payload: false })

      }
    } catch (error) {
      console.error('API Error:', error);
      dispatch({ type: "FATCH_SUBMITTING", payload: false })
    }
  };

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
                <Form className="px-3" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Project Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="projectName"
                      value={projectData.projectName}
                      onChange={handleInputChange}
                    />
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
                      name="projectDescription"
                      value={projectData.projectDescription}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="mb-1">Contractor</Form.Label>

                    <Form.Select value={projectOwner || projectData.projectOwner} onChange={(e) => setProjectOwner(e.target.value)}>
                      <option value="">SELECT CONTRACTOR</option>
                      {contractorData.map((items) => (
                        <option key={items._id} value={items._id} >{items.first_name}</option>

                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="mb-1">Project Status</Form.Label>
                    <Form.Select value={projectStatus || projectData.projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                      <option value="active">Active </option>
                      <option value="inactive">Inactive </option>
                      <option value="queue">In Proccess </option>
                    </Form.Select>
                  </Form.Group>
                  <div className="d-flex gap-3 mb-3">
                    <Form.Group className="w-100" controlId="start-date">
                      <Form.Label className="fw-bold">Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="createdDate"
                        value={createdDate}
                        onChange={(e) => setCreatedDate(e.target.value)}
                        placeholder="Start Date"
                      />
                    </Form.Group>
                    <Form.Group className="w-100" controlId="end-date">
                      <Form.Label className="fw-bold">End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                      />
                    </Form.Group>
                  </div>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? "submitting" : "Submit"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className='projectScreenCard2 d-flex flex-column gap-4'>
              <Card className={`projectScreenCard2 ${theme}CardBody`}>
                <Card.Header className={`${theme}CardHeader`}>Chats</Card.Header>
                <Card.Body className="d-flex flex-wrap gap-3 ">
                  <div
                    className="text-center w-100"
                    style={{
                      display:
                        projectData &&
                          projectData.conversions &&
                          projectData.conversions.length < 1
                          ? 'block'
                          : 'none',
                    }}
                  >
                    No Chat Available
                  </div>

                  {projectData?.conversions?.map((conversion) => {
                    const assignedAgent = projectData.assignedAgent.find(
                      (assignedAgent) =>
                        assignedAgent.agentId === conversion.members[0]
                    );
                    return (
                      <>
                        {userInfo.role == 'agent' ? (
                          <>
                            {conversion.members.includes(userInfo._id) && (
                              <>
                                <Card className="chatboxes">
                                  {/* <Card.Header>{assignedAgent.categoryId}</Card.Header> */}
                                  <Card.Body>
                                    <Link
                                      to={`/chatWindowScreen/${conversion._id}`}
                                    >
                                      <Button
                                        className="chatBtn"
                                        type="button"
                                      // onClick={conversionHandler(conversion._id)}
                                      >
                                        Chat Now
                                      </Button>
                                    </Link>
                                  </Card.Body>
                                </Card>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {categoryData && assignedAgent && assignedAgent.categoryName && (
                              <Card className="chatboxes">
                                <Card.Header>
                                  {assignedAgent.categoryName}
                                </Card.Header>
                                <Card.Body>
                                  <Link to={`/chatWindowScreen/${conversion._id}`}>
                                    <Button
                                      className="chatBtn"
                                      type="button"
                                    // onClick={conversionHandler(conversion._id)}
                                    >
                                      {assignedAgent.agentName}
                                    </Button>
                                  </Link>
                                </Card.Body>
                              </Card>
                            )}

                          </>
                        )}
                      </>
                    );
                  })}
                </Card.Body>
              </Card>
              <Card className={`projectScreenCard2 ${theme}CardBody`}>
                <Card.Header className={`${theme}CardHeader`}>Assigned</Card.Header>
                <Card.Body className="d-flex justify-content-center flex-wrap gap-3 ">
                  <Form className='scrollInAdminproject' onSubmit={handleSubmit}>
                    {Array.isArray(agents) ? (
                      agents.map((agentCatData, index) => (

                        <div key={index} className='d-flex justify-content-between align-items-center' >
                          <Form.Group className="mb-3 mx-2" controlId="formBasicPassword">
                            <Form.Label className="mb-1">Category</Form.Label>
                            {console.log('agentCatData ', agentCatData)}
                            <Form.Select
                              value={agentCatData.categoryId}
                              onChange={(e) => selectedCateAgent(index, 'categoryId', e.target.value)}
                            >
                              <option value="">SELECT</option>
                              {Array.isArray(categoryData) ? (
                                categoryData.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                  </option>
                                ))
                              ) : (
                                <option value="">Loading agents...</option>
                              )}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group className="mb-3 mx-2" controlId="formBasicPassword">
                            <Form.Label className="mb-1">Agent</Form.Label>
                            <Form.Select
                              value={agentCatData.agentId}
                              onChange={(e) => selectedCateAgent(index, 'agentId', e.target.value)}
                            >
                              <option >SELECT AGENT</option>
                              {selectAgentByCateHandle(index).map((agent) => (
                                <option key={agent._id} value={agent._id}
                                // disabled={agents.some((a) => a.agentId === agent._id)}
                                >
                                  {agent.first_name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                          <div className='d-flex align-items-center mx-2'>
                            <Button className=' mt-2 ' onClick={() => handleRemoveAgentCategory(index)} disabled={agentCateRemoving && agentCateRemovingIndex == index} >
                              <AiFillDelete className='mx-1' />
                              {agentCateRemoving && agentCateRemovingIndex === index ? 'Removing' : 'Remove'}
                            </Button>
                          </div>
                        </div>
                      ))
                    )
                      : (
                        <option value="">Loading categories...</option>
                      )}
                    <div className='d-flex align-items-center'>
                      <div className='mb-2 mx-2' onClick={addDynamicFields} >
                        <MdPlaylistAdd className='mx-2 fs-3' />
                        Add Category and Agent
                      </div>
                    </div>
                  </Form>
                  {/* -------- */}
                </Card.Body>
              </Card>
            </div>

          </div>
        </div>
      )
      }
    </div >
  );
}

export default AdminEditProject;