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
import AdminContractorListScreen from './Screens/AdminContractorListScreen';
import SearchScreen from './Screens/SearchScreen';
import ProjectSingleScreen from './Screens/ProjectSingleScreen';
import ChatWindowScreen from './Screens/ChatWindowScreen';
import AdminEditAgent from './Screens/AdminEditAgentScreen';
import { useContext, useState, useEffect } from 'react';
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
import axios from 'axios';
import { Store } from './Store';
import AdminDashboard from './Screens/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import ProfileScreen from './Screens/ProfileScreen';
import Theme from './Components/Theme';
import ProjectNotification from './Screens/ProjectNotification';
import AddProject from './Screens/AddProject';
import ChatScreen from './Screens/ChatScreen';
import AdminEditCategory from './Screens/AdminEditCategoryScreen';
import AdminEditProject from './Screens/AdminEditProjectScreen';
import AdminEditContractor from './Screens/AdminEditContractorScreen';
import ContractorProject from './Contractor/ContractorProjectListScreen';
import ContractorEditProject from './Contractor/ContractorEditProjectScreen';
import AgentProjectList from './Agent/AgentProjectListScreen';
import AdminAssignAgent from './Screens/AdminAssignAgentScreen';
import AgentEditProject from './Agent/AgentEditProjectScreen';
// import ContractorProjectScreen from './Components/Contractor/contractorProjectScreen';
import SuperadminEditAdmin from './Screens/SuperadminEditAdmin';
import NotificationScreen from './Screens/NotificationScreen';
import AdminListScreen from './Screens/AdminListScreen';
import SuperadminAdminList from './Screens/SuperadminAdminList';
import MyComponent from './Components/MyComponent';
import Footer from './Components/footer';
import ConfirmRegistration from './Screens/ConfirmRegistration';
import TasksScreen from './Screens/TasksScreen';
import TaskAddButton from './Components/TaskAddButton';
import ContractorTaskScreen from './Screens/ContractorTaskScreen';
import AgentTaskScreen from './Agent/AgentTaskScreen';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pathName, setPathName] = useState();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo, NotificationData } = state;
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
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  const handelforNOtification = () => {
    ctxDispatch({ type: 'NOTIFICATION-NULL' });
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    setPathName(pathname);
    console.log('Pathname:', pathname);
  }, []);

  return (
    <div className={userInfo ? `App ${theme}` : `App`}>
      <ToastContainer position="bottom-center" autoClose={500} limit={1} />

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
                <Navbar expand="lg" className="admin-navbar">
                  <Container fluid>
                    <div
                      className="p-2 me-3 fs-5 admin-btn-logo"
                      onClick={toggleSidebar}
                    >
                      <AiOutlineAlignLeft />
                    </div>
                    <Navbar.Brand href="/dashboard">
                      <Image
                        className="Roonberg-logo me-3 ms-2"
                        src="/logo2.png"
                        thumbnail
                      />
                    </Navbar.Brand>
                    {/* <div className="searchbar">
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
                    </div> */}

                    {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}

                    <Navbar.Collapse
                      className="justify-content-end disNone"
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

                        {/* {/* <Link href="#action1">
                          <BiShareAlt className="fs-4 admin-btn-logo" />
                        </Link>

                        <Link href="#">
                          <FiClock className="fs-4 admin-btn-logo" />
                        </Link> */}

                        <Link
                          to="/notificationScreen"
                          className="position-relative"
                        >
                          <MdOutlineNotifications
                            className="fs-4 admin-btn-logo"
                            title="Notifications"
                          />
                          {NotificationData.length > 0 && (
                            <span className="position-absolute notification-badgeApp top-0 start-110 translate-middle badge rounded-pill bg-danger">
                              {NotificationData.length}
                            </span>
                          )}
                        </Link>
                      </Nav>
                    </Navbar.Collapse>

                    <div
                      className="profile-icon me-1 ms-3"
                      onClick={toggleDropdown}
                    >
                      <img
                        className="w-100 h-100 profile-icon-inner img-fornavs"
                        src={
                          userInfo.profile_picture
                            ? userInfo.profile_picture
                            : './avatar.png'
                        }
                        alt="userimg"
                      />
                      {isDropdownOpen && (
                        <div
                          className="dropdown-content"
                          onClick={closeDropdown}
                        >
                          <Link to="/profile-screen">Profile</Link>
                          <Link
                            to="/notificationScreen"
                            className="position-relative"
                          >
                            Notification
                            {NotificationData.length > 0 && (
                              <span className="position-absolute notification-badgeApp top-0 start-110 translate-middle badge rounded-pill bg-danger">
                                {NotificationData.length}
                              </span>
                            )}
                          </Link>
                          {/* <Link to="/projectNotification">Notification</Link> */}
                          {/* <Link to="#">Setting</Link> */}
                          <hr />
                          <Link onClick={signoutHandler} to="#">
                            Logout
                          </Link>
                          {/* Add more options as needed */}
                        </div>
                      )}
                    </div>

                    <div
                      className="p-2 me-3 fs-5 admin-btn-logo2"
                      onClick={toggleSidebar}
                    >
                      <AiOutlineAlignLeft />
                    </div>
                  </Container>
                </Navbar>
              ) : (
                <Navbar expand="lg" className="main-div">
                  <Container className="loginPageNav">
                    <Navbar.Brand href="/">
                      <Image className="border-0" src="/logo2.png" thumbnail />
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
                          {pathName && pathName === '/registration' ? (
                            <a className="login-admin" href="/">
                              {/* <BsFillPersonFill className="fs-5 Icon-person me-1 " /> */}
                              Login
                            </a>
                          ) : (
                            <a className="login-admin" href="/registration">
                              Singnup
                            </a>
                          )}
                        </Nav>
                      </Nav>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              )}
              <main className="windowCal">
                <div className="mainfordata">
                  <Routes>
                    <Route path="/" element={<SignUpForm />} />
                    <Route path="/test" element={<MyComponent />} />
                    <Route
                      path="/confirm/:token"
                      element={<ConfirmRegistration />}
                    />
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
                    {/* <Route
                      path="/superadmineditadmin/:id"
                      element={<SuperadminEditAdmin />}
                    /> */}

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
                      path="/tasksScreen"
                      element={
                        <ProtectedRoute>
                          <TasksScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/contractor-tasksScreen"
                      element={
                        <ProtectedRoute>
                          <ContractorTaskScreen />
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
                    <Route
                      path="/profile-screen"
                      element={
                        <ProtectedRoute>
                          <ProfileScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminCategoriesList"
                      element={
                        <ProtectedRoute>
                          <AdminCategoriesListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/taskScreen-agent"
                      element={
                        <ProtectedRoute>
                          <AgentTaskScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminList-screen"
                      element={
                        <ProtectedRoute>
                          <SuperadminAdminList />
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
                      element={
                        <ProtectedRoute>
                          <ProjectSingleScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminEditProject/:id"
                      element={
                        <ProtectedRoute>
                          <AdminEditProject />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/chatWindowScreen/:id"
                      element={
                        <ProtectedRoute>
                          <ChatWindowScreen />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/adminEditCategory/:id"
                      element={
                        <ProtectedRoute>
                          <AdminEditCategory />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/adminEditAgent/:id"
                      element={
                        <ProtectedRoute>
                          <AdminEditAgent />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/adminEditContractor/:id"
                      element={
                        <ProtectedRoute>
                          <AdminEditContractor />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/superadmineditadmin/:id"
                      element={
                        <ProtectedRoute>
                          <SuperadminEditAdmin />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/AdminAssignAgent/:id"
                      element={
                        <ProtectedRoute>
                          <AdminAssignAgent />
                        </ProtectedRoute>
                      }
                    />
                    {/* Contractor */}
                    <Route
                      path="/project-list-screen"
                      element={
                        <ProtectedRoute>
                          <ContractorProject />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/contractorEditProject/:id"
                      element={
                        <ProtectedRoute>
                          <ContractorEditProject />
                        </ProtectedRoute>
                      }
                    />
                    {/* agent */}
                    <Route
                      path="/agentProjectList"
                      element={
                        <ProtectedRoute>
                          <AgentProjectList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agentEditProject/:id"
                      element={
                        <ProtectedRoute>
                          <AgentEditProject />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/notificationScreen"
                      element={
                        <ProtectedRoute>
                          <NotificationScreen />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
              </main>
              {userInfo && <TaskAddButton />}
              <Footer />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default App;
