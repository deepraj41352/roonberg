import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card } from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import Validations from '../Components/Validations';

function RegistrationForm() {
  return (
    <Container className="Sign-up-container d-flex  flex-column justify-content-center align-items-center">
      <div className="Sign-up-container-inner px-4 py-3">
        <Row className="mb-3">
          <Col>
            <h4>Registration</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Form className="p-4 formWidth ">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">First Name</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">Last Name</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">
                    Email address
                  </Form.Label>
                  <Form.Control type="email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Confirm Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Button
                  className="w-100 py-1 globalbtnColor"
                  variant="primary"
                  type="submit">
                  Submit
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default RegistrationForm;
