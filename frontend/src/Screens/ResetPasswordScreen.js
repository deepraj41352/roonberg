import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Validations from "../Components/Validations";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, validationMsg } = state;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    if (validationMsg) {
      toast.error("Please set valid password");
      setIsSubmiting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("password do not match");
      setIsSubmiting(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/user/reset-password", {
        password,
        token,
      });
      toast.success(data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
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
                onSubmit={submitHandler}
                className="formWidth d-flex flex-column"
              >
                {/* <Form.Label className="textLeft text-left">
                  Email Address
                </Form.Label>
                <Form.Control
                  className="px-2  py-1 mb-3"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Validations type="email" value={email} /> */}

                <Form.Label className="textLeft text-left">Password</Form.Label>

                <div className="Password-input-eye">
                  <div className=" rounded-2">
                    <Form.Control
                      id="password"
                      value={password}
                      className="pswd-input"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="eye-bttn " onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                  </div>
                </div>
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
                <Button
                  type="submit"
                  className="globalbtnColor px-2 py-1"
                  disabled={isSubmiting}
                >
                  {isSubmiting ? "Submiting..." : "Submit"}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
