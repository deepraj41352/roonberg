import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row, Col, Card } from "react-bootstrap/";
import { Link } from "react-router-dom";
import Validations from "../Components/Validations";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="Sign-up-container d-flex  flex-column justify-content-center align-items-center">
      <div className="Sign-up-container-inner px-4 py-3">
        <Row className="mb-3">
          <Col>
            <h4>Login</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Form className="p-4 formWidth ">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">
                    Email address
                  </Form.Label>
                  <Form.Control
                    value={email}
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Validations type="email" value={email} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Password</Form.Label>
                  <div className="Password-input-eye rounded-2">
                    <Form.Control
                      className="pswd-input"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="btn "
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                  <Form.Check
                    className="mt-3"
                    type="checkbox"
                    label="Remember me"
                  />
                  <Validations type="password" value={password} />
                </Form.Group>
                <Button
                  className="w-100 py-1 globalbtnColor"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
                <Form.Group className="my-3">
                  <Link to="/ForgetPassword">Forgot Password?</Link>
                </Form.Group>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default SignUpForm;
