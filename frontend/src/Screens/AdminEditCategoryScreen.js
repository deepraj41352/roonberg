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
import { Avatar } from '@mui/material';
import AvatarImage from '../Components/Avatar';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, categoryData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    //   case "CATEGORY_CRATED_REQ":
    //     return { ...state, isSubmiting: true }
    default:
      return state;
  }
};

function AdminEditCategory() {
  const { id } = useParams();
  if (id) {
    console.log('id exists:', id);
  } else {
    console.log('id does not exist');
  }

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [
    { loading, error, categoryData, successDelete, successUpdate },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    categoryData: {},
    successDelete: false,
    successUpdate: false,
    isSubmiting: false,
  });

  const navigate = useNavigate();
  const [category, setCatogry] = useState(categoryData.categoryName);
  const [status, setStatus] = useState(categoryData.categoryStatus || '');
  const [categoryDesc, setCatogryDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [color, setColor] = useState('');

  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/category/${id}`);
        const datas = response.data;
        setCatogry(datas.categoryName);
        setCatogryDesc(datas.categoryDescription);
        setSelectedFile(datas.categoryImage);
        setStatus(datas.categoryStatus);
        dispatch({ type: 'FATCH_SUCCESS', payload: datas });
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    FatchcategoryData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const formDatas = new FormData();

    formDatas.append("file", selectedFile);
    formDatas.append("categoryName", category);
    formDatas.append("categoryDescription", categoryDesc);
    formDatas.append("categoryStatus", status);
    try {
      const data = await axios.put(
        `/api/category/CategoryUpdate/${id}`,
        formDatas,
        {
          headers: {
            "content-type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" })
      toast.success("Category updated successfully");
      navigate('/adminCategoriesList')

    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    function generateColorFromAscii(str) {
      let color = '#';
      const combination = str
        .split('')
        .map((char) => char.charCodeAt(0))
        .reduce((acc, value) => acc + value, 0);
      color += (combination * 12345).toString(16).slice(0, 6);
      return color;
    }

    if (categoryData && categoryData.categoryName) {
      const name = categoryData.categoryName.toLowerCase().charAt(0);
      const generatedColor = generateColorFromAscii(name);
      setColor(generatedColor);
    }
  }, [categoryData]);

  return (
    <>
      <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
        <div className="ProfileScreen-inner px-4 py-3 w-100">
          <Row className="mb-3">
            <Col>
              <h4>Update Category</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className={`${theme}CardBody`}>
                <Form onSubmit={submitHandler} className="p-4 w-100 formWidth ">
                  <Row>
                    <Col>
                      {categoryData.categoryImage !== 'null' ? (
                        <Avatar src={categoryData.categoryImage} />
                      ) : (
                        <AvatarImage name={category} bgColor={color} />
                      )}
                    </Col>
                    <Col>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Control
                          className="input-box-inner"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3 " controlId="formBasicEmail">
                    <Form.Label className="mb-1 input-box">
                      Category Name
                    </Form.Label>
                    <Form.Control
                      className="input-box-inner"
                      onChange={(e) => setCatogry(e.target.value)}
                      type="text"
                      value={category}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="mb-1 input-box">
                      Description
                    </Form.Label>
                    <Form.Control
                      className="input-box-inner"
                      onChange={(e) => setCatogryDesc(e.target.value)}
                      type="text"
                      value={categoryDesc}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="mb-1">Status</Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">SELECT STATUS</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                  <div className="d-flex justify-content-start mt-4">
                    <Button
                      className=" py-1 w-25 globalbtnColor"
                      variant="primary"
                      type="submit"
                      disabled={isSubmiting}
                    >
                      {isSubmiting ? 'Updateing...' : 'Update'}
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

export default AdminEditCategory;
