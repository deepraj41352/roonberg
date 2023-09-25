import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';

function NavbarLogin() {
  return (
    <Navbar expand="lg" className="main-div" >
      <Container>
        <Navbar.Brand href="#home">logo and name</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav className=" login-button">
            <Nav.Link className="Knowlege-Base " href="#home">
              Knowledge Base
            </Nav.Link>
            <Nav className="login-nav ">
              <Nav.Link className="login-admin" href="#link">
                <BsFillPersonFill className="fs-5 Icon-person " />
                Login
              </Nav.Link>
              <Nav.Link className="login-admin" href="#link">
                Admin Login
              </Nav.Link>
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarLogin;
