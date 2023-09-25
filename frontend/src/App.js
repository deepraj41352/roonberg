import './App.css';
import ForgetPassword from './Screens/ForgetPasswordScreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">My Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#services">Services</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action1">Action 1</NavDropdown.Item>
              <NavDropdown.Item href="#action2">Action 2</NavDropdown.Item>
              <NavDropdown.Item href="#action3">Action 3</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <ToastContainer position='bottom-center' limit={1} />

      <BrowserRouter>
        <Routes>
          <Route path='/ForgetPassword' element={<ForgetPassword />} />
          <Route path='/resetPassword' element={<ResetPasswordScreen />} />
          <Route />
        </Routes>

      </BrowserRouter>
      <ForgetPassword />
    </div>
  );
}

export default App;
