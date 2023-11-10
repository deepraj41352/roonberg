import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { HiClipboardList, HiUserGroup } from 'react-icons/hi';
import { CiBoxList } from 'react-icons/ci';
import { FaListAlt, FaListUl } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa';

import { IoMdNotifications } from 'react-icons/io';
import { AiFillHome, AiOutlineProject } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { MdGroup, MdGroups2, MdLogout, MdOutlineGroups2 } from 'react-icons/md';
import { BsFillChatLeftQuoteFill, BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { ImCross } from 'react-icons/im';
import axios from 'axios';
import { Form, InputGroup } from 'react-bootstrap';

function Sidebar({ sidebarVisible, setSidebarVisible }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, NotificationData } = state;
  const [unseeNote, setUnseenNote] = useState(NotificationData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const socketUrl = process.env.REACT_APP_SOCKETURL;
  const socket = io(socketUrl); // Replace with your server URL

  // const SocketUrl = process.env.SOCKETURL;
  // const socket = io(SocketUrl);
  // const socket = io('https://roonsocket.onrender.com'); // Replace with your server URL

  console.log('socket ', socket);
  socket.emit('connectionForNotify', () => {
    console.log('oiuhjioyhi');
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleNotification = (notifyUser, message) => {
      if (notifyUser == userInfo._id) {
        console.log('notifyProjectFrontend', notifyUser, message);
        ctxDispatch({ type: 'NOTIFICATION', payload: { notifyUser, message } });
      }
    };
    socket.on('notifyProjectFrontend', handleNotification);
    return () => {
      socket.off('notifyProjectFrontend', handleNotification);
    };
  }, []);

  useEffect(() => {
    const handleNotification = async (notifyUser, message) => {
      console.log('notificationformsocke');

      const { data } = await axios.get(`/api/notification/${userInfo._id}`, {
        headers: { Authorization: ` Bearer ${userInfo.token}` },
      });
      ctxDispatch({ type: 'NOTIFICATION-NULL' });
      data.map((item) => {
        if (item.status == 'unseen')
          ctxDispatch({ type: 'NOTIFICATION', payload: { item } });
      });
    };
    socket.on('notifyUserFrontend', handleNotification);
  }, []);

  console.log('NotificationData', NotificationData);

  const signoutHandler = () => {
    const userConfirm = window.confirm('Are you sure you want to logout?');
    if (userConfirm) {
      ctxDispatch({ type: 'USER_SIGNOUT' });
      localStorage.removeItem('userInfo');
      window.location.href = '/';
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1179);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleResponsiveSidebarVisable = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const handlSmallScreeneClick = () => {
    if (isSmallScreen) {
      setSidebarVisible(!sidebarVisible);
    }
  };
  // const handelforNOtification = () => {
  //   ctxDispatch({ type: 'NOTIFICATION-NULL' });

  // };
  useEffect(() => {
    const fetchNotificationData = async () => {
      ctxDispatch({ type: 'NOTIFICATION-NULL' });
      try {
        const response = await axios.get(`/api/notification/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const NotifyData = response.data;
        ctxDispatch({ type: 'NOTIFICATION-NULL' });

        NotifyData.map((item) => {
          if (item.status == 'unseen')
            ctxDispatch({ type: 'NOTIFICATION', payload: { item } });
        });
      } catch (error) {
        console.error('Error fetching notification data:', error);
      }
    };

    fetchNotificationData();
  }, []);

  const uniqueNotificationData = [...new Set(NotificationData)];
  console.log('uniqueNotificationData ', uniqueNotificationData);
  useEffect(() => {
    const noteData = [...NotificationData];
    const data = noteData.filter((note) => {
      if (note.notificationId) {
      }
    });
  }, []);
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleSearchScreen = () => {
    navigate('/searchScreen');
  };

  return (
    <div className={`sidebar ${sidebarVisible ? 'visible' : ''} `}>
      <div className="blank-box"></div>
      <ImCross
        className="sidebarCrossBtn"
        onClick={handleResponsiveSidebarVisable}
      />
      <ul className="dash-list ">
        <div className="searchbar1">
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
        </div>
        <Link
          to="/dashboard"
          className="text-decoration-none"
          onClick={handlSmallScreeneClick}
        >
          <li
            className={selectedItem === 'dashboard' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('dashboard');
            }}
          >
            <AiFillHome className="me-3 fs-5" />
            Dashboard
          </li>
        </Link>
        {userInfo.role == 'superadmin' ? (
          <Link
            to="/adminList-screen"
            className="text-decoration-none"
            onClick={handlSmallScreeneClick}
          >
            <li
              className={selectedItem === 'adminList' ? 'selected' : ''}
              onClick={() => {
                setSelectedItem('adminList');
              }}
            >
              <MdOutlineGroups2 className="me-3 fs-5" />
              Admin List
            </li>
          </Link>
        ) : null}

        {userInfo.role === 'admin' || userInfo.role === 'superadmin' ? (
          <>
            <Link
              to="/adminAgentList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'agentList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('agentList');
                }}
              >
                <HiUserGroup className="me-3 fs-5" />
                Agent List
              </li>
            </Link>
            <Link
              to="/adminContractorList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'contractorList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('contractorList');
                }}
              >
                <MdGroup className="me-3 fs-5" />
                Contractor List
              </li>
            </Link>
            <Link
              to="/adminCategoriesList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'categoriesList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('categoriesList');
                }}
              >
                <FaListUl className="me-3 fs-5" />
                Categories List
              </li>
            </Link>
            <Link
              to="/adminProjectList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={
                  selectedItem === 'ProjectListAdmin' ? 'selected' : ''
                }
                onClick={() => {
                  setSelectedItem('ProjectListAdmin');
                }}
              >
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
          </>
        ) : null}

        {userInfo.role == 'contractor' ? (
          <>
            <Link
              to="/project-list-screen"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'addProjects' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('addProjects');
                }}
              >
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
            {/* <Link
              to="/add-project"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'addProject' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('addProject');
                }}
              >
                <AiFillHome className="me-3 fs-5" />
                Add Project
              </li>
            </Link> */}
          </>
        ) : null}
        {userInfo.role == 'agent' ? (
          <>
            <Link
              to="/agentProjectList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li>
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
          </>
        ) : null}
        <Link
          to="/notificationScreen"
          className="text-decoration-none"
          onClick={handlSmallScreeneClick}
        >
          <li
            className={
              selectedItem === 'notificationScreen'
                ? 'selected d-flex'
                : 'd-flex'
            }
            onClick={() => {
              setSelectedItem('notificationScreen');
            }}
          >
            <IoMdNotifications className="me-3 fs-5 " />
            <div className="position-relative">
              Notification
              {uniqueNotificationData.length > 0 && (
                <span className="position-absolute notification-badge top-0 start-110 translate-middle badge rounded-pill bg-danger">
                  {uniqueNotificationData.length}
                </span>
              )}
            </div>
          </li>
        </Link>
        <Link to="/profile-screen" className="text-decoration-none disNonePro">
          <li
            className={selectedItem === 'categoriesList' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('categoriesList');
            }}
          >
            <img
              className="profile-icon2 profile-icon-inner fs-5 img-fornavs"
              src={
                userInfo.profile_picture
                  ? userInfo.profile_picture
                  : './avatar.png'
              }
              alt="userimg"
            />
            Profile
          </li>
        </Link>
        {/* <div className="profile-icon" onClick={toggleDropdown}>
          <img
            className="w-100 h-100 profile-icon-inner fs-5 img-fornavs"
            src={
              userInfo.profile_picture
                ? userInfo.profile_picture
                : './avatar.png'
            }
            alt="userimg"
          />
          {isDropdownOpen && (
            <div className="dropdown-content" onClick={closeDropdown}>
              <Link to="/profile-screen">Profile</Link>
              <Link to="/projectNotification">Notification</Link>
              <Link to="#">Setting</Link>
              <hr />
              <Link onClick={signoutHandler} to="#">
                Logout
              </Link>
              {/* Add more options as needed *
            </div>
          )}
        </div> */}

        <Link
          to="#Logout"
          onClick={signoutHandler}
          className="text-decoration-none"
        >
          <li
            className={selectedItem === 'logout' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('logout');
            }}
          >
            <MdLogout className="me-3 fs-5" />
            Logout
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;
