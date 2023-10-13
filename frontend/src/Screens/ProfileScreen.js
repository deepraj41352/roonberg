import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import axios from "axios";
import Validations from "../Components/Validations";

function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(userInfo.first_name);
  const [lastName, setLastName] = useState(userInfo.last_name);
  const [email, setEmail] = useState(userInfo.email);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const formDatas = new FormData();

    formDatas.append("profile_picture", selectedFile);
    formDatas.append("first_name", firstName);
    formDatas.append("last_name", lastName);
    formDatas.append("email", email);
    formDatas.append("_id", userInfo._id);

    try {
      const { data } = await axios.put(`/api/user/profile`, formDatas, {
        headers: {
          "content-type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      toast.success(data.message);
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
      <div className="ProfileScreen-inner px-4 py-3 w-100">
        <Row className="mb-3">
          <Col>
            <h4>User Profile</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className={`${theme}CardBody`}>
              <Form onSubmit={submitHandler} className="p-4 w-100 formWidth ">
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Profile Picture</Form.Label>
                  <Form.Control
                    className="input-box-inner"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3 " controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">First Name</Form.Label>
                  <Form.Control
                    className="input-box-inner"
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    value={firstName}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box ">Last Name</Form.Label>
                  <Form.Control
                    className="input-box-inner"
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    value={lastName}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">
                    Email address
                  </Form.Label>
                  <Form.Control
                    className="input-box-inner"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Validations type="email" value={email} />
                </Form.Group>

                <div className="d-flex justify-content-start mt-4">
                  <Button
                    className=" py-1  globalbtnColor"
                    variant="primary"
                    type="submit"
                    disabled={isSubmiting}
                  >
                    {isSubmiting ? "Updateing..." : "Update"}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ProfileScreen;
