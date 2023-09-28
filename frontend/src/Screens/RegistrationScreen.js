import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card } from 'react-bootstrap/';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Validations from '../Components/Validations';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';

function RegistrationForm() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('isAdmin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    if (password !== confirmPassword) {
      toast.error('password do not match');
      setIsSubmiting(false);
      return;
    }

    try {
      const { data } = await axios.post('/api/user/signup', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        role: role,
      });
      navigate('/');
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/adminDashboard")
    }

  }, [userInfo, navigate])

  return (
    <Container className="Sign-up-container-regis d-flex  flex-column justify-content-center align-items-center">
      <div className="Sign-up-container-inner px-4 py-3">
        <Row className="mb-3">
          <Col>
            <h4>Registration</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Form onSubmit={submitHandler} className="p-4 formWidth ">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">First Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
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
                  <Form.Label className="mb-1">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Validations type="password" value={password} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </Form.Group>
                <Button
                  className="w-100 py-1 globalbtnColor"
                  variant="primary"
                  type="submit"
                  disabled={isSubmiting}>
                  {isSubmiting ? 'Submiting...' : 'Submit'}
                </Button>
                <Form.Group className="my-3">
                  <Link to="/">Signin ?</Link>
                </Form.Group>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default RegistrationForm;
