import React, { useContext, useState } from 'react';
import { HiClipboardList } from 'react-icons/hi';
import { CiBoxList } from 'react-icons/ci';
import { FaListAlt, FaListUl } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { AiFillHome, AiOutlineProject } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { MdLogout } from 'react-icons/md';
import { BsFillChatLeftQuoteFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

function Sidebar({ sidebarVisible, setSidebarVisible }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [selectedItem, setSelectedItem] = useState(null);

  const signoutHandler = () => {
    const userConfirm = window.confirm('Are you sure you want to logout?');
    if (userConfirm) {
      ctxDispatch({ type: 'USER_SIGNOUT' });
      localStorage.removeItem('userInfo');
      window.location.href = '/';
    }
  };

  return (
    <div className={`sidebar ${sidebarVisible ? 'visible' : ''} `}>
      <div className="blank-box"></div>
      <ul className="dash-list ">
        <Link to="/dashboard" className="text-decoration-none">
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
          <Link to="/adminList" className="text-decoration-none">
            <li
              className={selectedItem === 'adminList' ? 'selected' : ''}
              onClick={() => {
                setSelectedItem('adminList');
              }}
            >
              <HiClipboardList className="me-3 fs-5" />
              Admin List
            </li>
          </Link>
        ) : null}

        {userInfo.role === 'admin' || userInfo.role === 'superadmin' ? (
          <>
            <Link to="/adminAgentList" className="text-decoration-none">
              <li
                className={selectedItem === 'agentList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('agentList');
                }}
              >
                <FaListAlt className="me-3 fs-5" />
                Agent List
              </li>
            </Link>
            <Link to="/adminContractorList" className="text-decoration-none">
              <li
                className={selectedItem === 'contractorList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('contractorList');
                }}
              >
                <FaListUl className="me-3 fs-5" />
                Contractor List
              </li>
            </Link>
            <Link to="/adminCategoriesList" className="text-decoration-none">
              <li
                className={selectedItem === 'categoriesList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('categoriesList');
                }}
              >
                <CiBoxList className="me-3 fs-5" />
                Categories List
              </li>
            </Link>
            <Link to="/adminProjectList" className="text-decoration-none">
              <li>
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
          </>
        ) : null}

        <Link to="/profile-screen" className="text-decoration-none">
          <li
            className={selectedItem === 'profile' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('profile');
            }}
          >
            <CgProfile className="me-3 fs-5" />
            Profile
          </li>
        </Link>

        <Link to="/adminProjectList" className="text-decoration-none">
          <li
            className={selectedItem === 'profileList' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('profileList');
            }}
          >
            <AiOutlineProject className="me-3 fs-5" />
            Project List
          </li>
        </Link>
        <Link to="/ChatScreen" className="text-decoration-none">
          <li
            className={selectedItem === 'chat' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('chat');
            }}
          >
            <BsFillChatLeftQuoteFill className="me-3 fs-5" />
            Chat
          </li>
        </Link>
        {userInfo.role == 'contractor' ? (
          <>
            <Link to="/project-list-screen" className="text-decoration-none">
              <li>
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
            <Link to="/add-project" className="text-decoration-none">
              <li>
                <AiFillHome className="me-3 fs-5" />
                Add Project
              </li>
            </Link>
          </>
        ) : null}
        {userInfo.role == 'agent' ? (
          <>
            <Link to="/agentProjectList" className="text-decoration-none">
              <li>
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
            <Link to="/projectNotification" className="text-decoration-none">
              <li>
                <IoMdNotifications className="me-3 fs-5" />
                Project Notification
              </li>
            </Link>
          </>
        ) : null}
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
