import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import Validations from '../Components/Validations';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log('error');
      toast.error('password and confirm password not match!');
      return;
    }
    // else {
    //     try {
    //         const { data } = await axios.get(``, { password: password });
    //         toast.success(data.message);

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
  };
  return (
    <>
      <Container className="fullContainer d-flex flex-column justify-content-center align-items-center">
        <Row>
          <Col>
            <h4 className="mb-3 heading4">Reset Password</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="p-4 formColor">
              <Form
                onSubmit={handleSubmit}
                className="formWidth d-flex flex-column">
                <Form.Label className="textLeft text-left">
                  Email Address
                </Form.Label>
                <Form.Control
                  className="px-2  py-1 mb-3"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Validations type="email" value={email} />

                <Form.Label className="textLeft text-left">Password</Form.Label>
                <Form.Control
                  className="px-2  py-1 mb-3"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Validations type="password" value={password} />

                <Form.Label className="textLeft text-left">
                  Confirm Password
                </Form.Label>
                <Form.Control
                  className="px-2  py-1 mb-3"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button className="globalbtnColor px-2 py-1">Submit</Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
