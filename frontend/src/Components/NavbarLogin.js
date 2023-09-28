import {
  Container,
  Image,
  Nav,
  Navbar,
  Form,
  NavDropdown,
  Button,
  InputGroup,
  Col,
  Row,
} from 'react-bootstrap';
import { BiShareAlt } from 'react-icons/bi';
import { HiClipboardList } from 'react-icons/hi';
import { CiBoxList } from 'react-icons/ci';
import { FaListAlt, FaListUl } from 'react-icons/fa';
import {
  AiOutlineCheck,
  AiOutlineAlignLeft,
  AiFillHome,
  AiOutlineProject,
} from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FiClock } from 'react-icons/fi';
import { MdOutlineNotifications, MdLogout } from 'react-icons/md';
import {
  BsFillPlusCircleFill,
  BsSearch,
  BsFillChatLeftQuoteFill,
} from 'react-icons/bs';
import { useContext, useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Store } from '../Store';
function NavbarLogin() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  return userInfo ? (
    <Container fluid className="px-0">
      <div className="d-flex ">
        <Sidebar
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
        />
        <div className="px-0 w-100">
          <Navbar expand="lg" className=" admin-navbar">
            <Container fluid>
              <div
                className="p-2 me-3 fs-5 admin-btn-logo"
                onClick={toggleSidebar}>
                <AiOutlineAlignLeft />
              </div>
              <Form className="d-flex">
                <InputGroup className="search-bar-dash">
                  <Form.Control
                    type="search"
                    className="search-bar-dash-inner"
                    placeholder="Search..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
                  <InputGroup.Text id="basic-addon2">
                    <BsSearch className="fs-4" />
                  </InputGroup.Text>
                </InputGroup>
              </Form>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse
                className="justify-content-end"
                id="navbarScroll">
                <Nav
                  className="gap-3"
                  style={{ maxHeight: '100px' }}
                  navbarScroll>
                  <Nav.Link href="#action1">
                    <BiShareAlt className="fs-4 admin-btn-logo" />
                  </Nav.Link>
                  <Nav.Link href="#action2">
                    <AiOutlineCheck className="fs-4 admin-btn-logo  " />
                  </Nav.Link>
                  <Nav.Link href="#">
                    <CgProfile className="fs-4 admin-btn-logo " />
                  </Nav.Link>
                  <Nav.Link href="#">
                    <FiClock className="fs-4 admin-btn-logo " />
                  </Nav.Link>
                  <Nav.Link href="#">
                    <MdOutlineNotifications className="fs-4 admin-btn-logo  " />
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>
    </Container>
  ) : (
    <Navbar expand="lg" className=" main-div">
      <Container>
        <Navbar.Brand href="#home">
          <Image className="border-0" src="./logo2.png" thumbnail />
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
              <Link className="login-admin" href="#link">
                Admin Login
              </Link>
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarLogin;