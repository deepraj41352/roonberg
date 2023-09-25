import React from "react";
import {
  Container,
  Nav,
  Navbar,
  Form,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { BiShareAlt } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FiClock } from "react-icons/fi";
import { MdOutlineNotifications } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";

import { BsFillPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";
function NavbarLogin() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">
              <BsFillPlusCircleFill />
            </Button>
          </Form>
          {/* <Navbar.Brand href="#">Navbar scroll</Navbar.Brand> */}
          {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="#action1">
                <BiShareAlt />
              </Nav.Link>
              <Nav.Link href="#action2">
                <AiOutlineCheck />
              </Nav.Link>

              <Nav.Link href="#">
                <CgProfile />
              </Nav.Link>
              <Nav.Link href="#">
                <FiClock />
              </Nav.Link>
              <Nav.Link href="#">
                <MdOutlineNotifications />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
    // <Navbar expand="lg" className=" main-div" >
    //   <Container>
    //     <Navbar.Brand href="#home">logo and name</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
    //       <Nav className=" login-button">
    //         <Nav.Link className="Knowlege-Base " href="#home">
    //           Knowledge Base
    //         </Nav.Link>
    //         <Nav className="login-nav ">

    //           <Nav.Link className="login-admin" to='/'>
    //             <BsFillPersonFill className="fs-5 Icon-person " />
    //             Login
    //           </Nav.Link>
    //           <Nav.Link className="login-admin" href="#link">
    //             Admin Login
    //           </Nav.Link>
    //         </Nav>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
  );
}

export default NavbarLogin;
