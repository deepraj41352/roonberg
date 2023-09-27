import React from 'react';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function NavbarLogin() {
  return (
    <Navbar expand="lg" className=" main-div">
      <Container>
        <Navbar.Brand href="#home">
          <Image className="border-0" src="../logo2.png" thumbnail />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="Toggle-button"
        />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav className=" login-button">
            <Nav className="login-nav ">
              <Link className="login-admin" to="/registration">
                <BsFillPersonFill className="fs-5 Icon-person " />
                Signup
              </Link>
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
