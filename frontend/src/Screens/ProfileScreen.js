import React, { useContext, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import axios from 'axios';
import Validations from '../Components/Validations';

function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(userInfo.first_name);
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(userInfo.email);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    try {
      const { data } = await axios.post('/api/user/', {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
      <div className="Sign-up-container-inner px-4 py-3 w-100">
        <Row className="mb-3">
          <Col>
            <h4>User Profile</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Form onSubmit={submitHandler} className="p-4 w-100 formWidth ">
                <Form.Group className="mb-3 " controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">First Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    value={firstName}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">Last Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Validations type="email" value={email} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Profile Picture</Form.Label>
                  <Form.Control type="file" onChange={(e) => {}} />
                </Form.Group>
                <Button
                  className="w-100 py-1 mt-3 globalbtnColor"
                  variant="primary"
                  type="submit"
                  disabled={isSubmiting}>
                  {isSubmiting ? 'Updateing...' : 'Update'}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ProfileScreen;
