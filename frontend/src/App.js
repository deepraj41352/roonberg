import './App.css';
import ForgetPassword from './Screens/ForgetPasswordScreen';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUpForm from './Screens/SignInScreen';
import RegistrationForm from './Screens/RegistrationScreen';
import AdminProjectListScreen from './Screens/AdminProjectListScreen';
import AdminAgentListScreen from './Screens/AdminAgentListScreen';
import AdminCategoriesListScreen from './Screens/AdminCategoriesListScreen';
import AdminListScreen from './Screens/AdminListScreen';
import AdminContractorListScreen from './Screens/AdminContractorListScreen';
import SearchScreen from './Screens/SearchScreen';
import ProjectSingleScreen from './Screens/ProjectSingleScreen';
import ChatWindowScreen from './Screens/ChatWindowScreen';
import { useContext, useState } from 'react';
import {
  Container,
  Form,
  Image,
  InputGroup,
  Nav,
  Navbar,
} from 'react-bootstrap';
import Sidebar from './Components/Sidebar';
import { AiOutlineAlignLeft, AiOutlineCheck } from 'react-icons/ai';
import { BsFillPersonFill, BsSearch } from 'react-icons/bs';
import { BiShareAlt } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FiClock } from 'react-icons/fi';
import { MdOutlineNotifications } from 'react-icons/md';
import { Store } from './Store';
import AdminDashboard from './Screens/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import ProfileScreen from './Screens/ProfileScreen';
import Theme from './Components/Theme';
import ProjectNotification from './Screens/ProjectNotification';
import AddProject from './Screens/AddProject';
import ChatScreen from './Screens/ChatScreen';
import AdminEditCategory from "./Screens/AdminEditCategoryScreen";
import AdminEditAgent from "./Screens/AdminEditAgentScreen";
import AdminEditProject from './Screens/AdminEditProjectScreen';
import AdminEditContractor from './Screens/AdminEditContractorScreen';
import ContractorProject from './Contractor/ContractorProjectListScreen';
import ContractorEditProject from './Contractor/ContractorEditProjectScreen';
import AgentProjectList from './Agent/AgentProjectListScreen';
import AdminAssignAgent from './Screens/AdminAssignAgentScreen';
import SuperadminEditAdmin from './Screens/SuperadminEditAdmin';
import AgentEditProject from './Agent/AgentEditProjectScreen';



function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const handleSearchScreen = () => {
    navigate('/searchScreen');
  };

  return (
    <div className={userInfo ? `App ${theme}` : `App`}>
      <ToastContainer position="bottom-center" limit={1} />
      <div>
        <Container fluid className="px-0">
          <div className="d-flex ">
            {userInfo ? (
              <Sidebar
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
              />
            ) : null}

            <div className="px-0 w-100">
              {userInfo ? (
                <Navbar expand="lg" className=" admin-navbar">
                  <Container fluid>
                    <div
                      className="p-2 me-3 fs-5 admin-btn-logo"
                      onClick={toggleSidebar}
                    >
                      <AiOutlineAlignLeft />
                    </div>
                    <Navbar.Brand href="#home">
                      <Image
                        className="Roonberg-logo me-3 ms-2"
                        src="./logo2.png"
                        thumbnail
                      />
                    </Navbar.Brand>
                    <Form className="d-flex">
                      <InputGroup className="search-bar-dash">
                        <Form.Control
                          type="search"
                          value={searchValue}
                          onChange={handleInputChange}
                          onClick={handleSearchScreen}
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
                      id="navbarScroll"
                    >
                      <Nav
                        className="gap-3"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                      >
                        <div className="py-2">
                          <Theme />
                        </div>

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
                    <Navbar.Collapse
                      className="justify-content-end"
                      id="basic-navbar-nav"
                    >
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
              )}
              <main>
                <div>
                  <Routes>
                    <Route path="/" element={<SignUpForm />} />
                    <Route
                      path="/registration"
                      element={<RegistrationForm />}
                    />
                    <Route
                      path="/ForgetPassword"
                      element={<ForgetPassword />}
                    />
                    <Route path="/add-project" element={<AddProject />} />
                    <Route
                      path="/reset-password/:token"
                      element={<ResetPasswordScreen />}
                    />
                    <Route
                      path="/projectNotification"
                      element={<ProjectNotification />}
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminProjectList"
                      element={
                        <ProtectedRoute>
                          <AdminProjectListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminAgentList/"
                      element={
                        <ProtectedRoute>
                          <AdminAgentListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/profile-screen" element={<ProfileScreen />} />
                    <Route
                      path="/adminCategoriesList"
                      element={
                        <ProtectedRoute>
                          <AdminCategoriesListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminList"
                      element={
                        <ProtectedRoute>
                          <AdminListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminContractorList"
                      element={
                        <ProtectedRoute>
                          <AdminContractorListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/searchScreen"
                      element={<SearchScreen searchFor={searchValue} />}
                    />

                    <Route
                      path="/projectSingleScreen/:id"
                      element={<ProjectSingleScreen />}
                    />
                    <Route
                      path="/adminEditProject/:id"
                      element={<AdminEditProject />}
                    />

                    <Route
                      path="/chatWindowScreen/:id"
                      element={<ChatWindowScreen />}
                    />

                    <Route
                      path="/adminEditCategory/:id"
                      element={<AdminEditCategory />}
                    />

                    <Route
                      path="/adminEditAgent/:id"
                      element={<AdminEditAgent />}
                    />

                    <Route
                      path="/adminEditContractor/:id"
                      element={<AdminEditContractor />}
                    />

                    <Route
                      path="/superadmineditadmin/:id"
                      element={<SuperadminEditAdmin />}
                    />

                    <Route
                      path="/AdminAssignAgent/:id"
                      element={<AdminAssignAgent />}
                    />
                    {/* Contractor */}
                    <Route
                      path="/contractorProjectList"
                      element={<ContractorProject />}
                    />

                    <Route
                      path="/contractorEditProject/:id"
                      element={<ContractorEditProject />}
                    />
                    {/* agent */}
                    <Route
                      path="/agentProjectList"
                      element={<AgentProjectList />}
                    />
                    <Route
                      path="/agentEditProject/:id"
                      element={<AgentEditProject />}
                    />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default App;
