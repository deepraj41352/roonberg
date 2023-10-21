import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Toast,
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true };
    case "FATCH_SUCCESS":
      return { ...state, agentData: action.payload, loading: false };
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "UPDATE_SUCCESS":
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case 'FATCH_CATEGORY':
      return { ...state, categoryDatas: action.payload };
    //   case "CATEGORY_CRATED_REQ":
    //     return { ...state, isSubmiting: true }
    default:
      return state;
  }
};

function AdminEditAgent() {

  const [selectcategory, setSelectCategory] = React.useState();
  const { id } = useParams();
  if (id) {
    console.log("id exists:", id);
  } else {
    console.log("id does not exist");
  }

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  const [
    { loading, error, agentData, categoryDatas, successDelete, successUpdate, },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    agentData: {},
    successDelete: false,
    successUpdate: false,
    isSubmiting: false,
    categoryDatas: []
  });


  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // const [status, setStatus] = useState(userInfo.email);
  // const [selectedFile, setSelectedFile] = useState("");

  const [isSubmiting, setIsSubmiting] = useState(false);

  // State variable to hold the selected status
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  // useEffect to update the status when the API data changes

  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/user/${id}`);
        const datas = response.data;
        setFirstName(datas.first_name);
        setLastName(datas.last_name || 'Last Name');
        setEmail(datas.email);
        setStatus(datas.userStatus);
        setCategory(datas.agentCategory);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    FatchcategoryData();
  }, []);

  React.useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch("FATCH_REQUEST")
        const response = await axios.get(`/api/category/`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const datas = response.data;

        dispatch({ type: "FATCH_CATEGORY", payload: datas });
      } catch (error) {
        console.log(error)
      }
    }
    FatchCategory();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const data = await axios.put(
        `/api/user/update/${id}`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          userStatus: status,
          agentCategory: selectcategory || agentData.agentCategory
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" })
      toast.success(data.data);
      console.log(data)
      navigate('/adminAgentList')

    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <>
      <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
        <div className="ProfileScreen-inner px-4 py-3 w-100">
          <Row className="mb-3">
            <Col>
              <h4>Update Agent</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className={`${theme}CardBody`}>
                <Form onSubmit={submitHandler} className="p-4 w-100 formWidth ">
                  <Form.Group className="mb-3 " controlId="formBasicEmail">
                    <Form.Label className="mb-1 input-box">Name</Form.Label>
                    <Form.Control className="input-box-inner"
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      value={firstName}

                      required
                    />
                  </Form.Group>
                  {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className="mb-1 input-box">Last Name</Form.Label>
                                        <Form.Control className="input-box-inner"
                                            onChange={(e) => setLastName(e.target.value)}
                                            type="text"
                                            value={lastName}
                                            required
                                        />
                                    </Form.Group> */}
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="mb-1 input-box" >Email</Form.Label>
                    <Form.Control className="input-box-inner"
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      value={email}
                      required
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="mb-1">Status</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="">SELECT STATUS</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="mb-1">Category</Form.Label>
                    <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categoryDatas.map((items) => (
                        <option key={items._id} value={items._id} >{items.categoryName}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <div className="d-flex justify-content-start mt-4">
                    <Button
                      className=" py-1 w-25 globalbtnColor updatingBtn"
                      variant="primary"
                      type="submit"
                      disabled={isSubmiting}
                    >
                      {isSubmiting ? "Updateing" : "Update"}
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default AdminEditAgent;
