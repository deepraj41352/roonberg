import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import axios from 'axios';
import Validations from '../Components/Validations';
import { ColorRing } from 'react-loader-spinner';
import { TextField } from '@mui/material';
import { RiImageEditFill } from 'react-icons/ri';

function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(userInfo.first_name);
  const [lastName, setLastName] = useState(userInfo.last_name);
  const [email, setEmail] = useState(userInfo.email);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    if (isSubmiting == false) {
      setFirstName(userInfo.first_name);
      setFirstName(userInfo.last_name);
      setEmail(userInfo.email);
    }
  }, [isSubmiting, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const formDatas = new FormData();

    formDatas.append('file', selectedFile);
    formDatas.append('first_name', firstName);
    formDatas.append('last_name', lastName);
    formDatas.append('email', email);
    formDatas.append('_id', userInfo._id);

    try {
      const { data } = await axios.put(`/api/user/profile`, formDatas, {
        headers: {
          'content-type': 'multipart/form-data',

          authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success('Profile Updated Successfully !');
      ctxDispatch({ type: 'USER_UPDATE', payload: data.userData });
      localStorage.setItem('userInfo', JSON.stringify(data.userData));
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

  return (
    <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
      <div className="ProfileScreen-inner px-4 py-3 w-100 d-flex justify-content-center align-items-center flex-column">
        <Row className="mb-3">
          <Col>
            <h4>User Profile</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="overlayLoading">
              <Card className={`${theme}CardBody editCartForm`}>
                <div className="FormContainerEdit">
                  {isSubmiting && (
                    <div className="overlayLoadingItem1">
                      <ColorRing
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={[
                          'rgba(0, 0, 0, 1) 0%',
                          'rgba(255, 255, 255, 1) 68%',
                          'rgba(0, 0, 0, 1) 93%',
                        ]}
                      />
                    </div>
                  )}
                  <Form
                    onSubmit={submitHandler}
                    className="p-4 w-100 editFormWidth "
                  >
                    <div className="classforprofile">
                      <Form.Group
                        className="mb-2"
                        controlId="formBasicPassword"
                      >
                        {/* <div className="d-flex gap-3">
                          <div>
                            <Form.Label className="mb-1">
                              <img className="profile-icon-inner " src={userInfo.profile_picture} alt="user-image"></img>
                            </Form.Label>
                          </div>
                          <div>
                            <Form.Label className="mb-1">
                              Profile Picture
                            </Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                          </div>
                        </div> */}

                        <Row className="editImgParent">
                          <Col className="">
                            <img
                              className="profile-icon-inner editCateImgContainer"
                              src={userInfo.profile_picture}
                              alt="user-image"
                            ></img>
                          </Col>
                          <Col className="editImgChild">
                            <div className="mb-3">
                              <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="file-input"
                              />
                              <label
                                htmlFor="file-input"
                                className="editImgBtn "
                              >
                                <RiImageEditFill />
                              </label>
                            </div>
                          </Col>
                        </Row>
                      </Form.Group>
                    </div>
                    <TextField
                      className="my-3"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      label="First Name"
                      fullWidth
                      required
                    />

                    <TextField
                      className="mb-3"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      label="Last Name"
                      fullWidth
                    />
                    <TextField
                      className="mb-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      label="Email"
                      type="email"
                      fullWidth
                      disabled
                    />

                    <div className="d-flex justify-content-start mt-4">
                      <Button
                        className=" py-1  globalbtnColor"
                        variant="primary"
                        type="submit"
                        disabled={isSubmiting}
                      >
                        {isSubmiting ? 'UPDATING' : 'UPDATE'}
                      </Button>
                    </div>
                  </Form>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ProfileScreen;
