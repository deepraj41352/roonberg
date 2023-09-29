import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row, Col, Card } from "react-bootstrap/";
import { Link, useNavigate } from "react-router-dom";
import Validations from "../Components/Validations";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useContext, useState } from "react";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";
function SignUpForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    try {
      const { data } = await axios.post("/api/user/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));

      console.log(data);
      toast.success("SignUp successful");
      navigate("/Dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
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
              <Form onSubmit={submitHandler} className="p-4 formWidth ">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">
                    Email address
                  </Form.Label>
                  <Form.Control
                    value={email}
                    type="email"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Validations type="email" value={email} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Password</Form.Label>
                  <div className="Password-input-eye">
                    <div className=" rounded-2">
                      <Form.Control
                        className="pswd-input"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div
                      className="eye-bttn "
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                    </div>
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
                  disabled={isSubmiting}
                >
                  {isSubmiting ? "Submiting..." : "Submit"}
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
