import React, { useContext } from 'react';
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
import { useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

function Sidebar({ sidebarVisible, setSidebarVisible }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);

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
        <Link className="text-decoration-none">
          <li>
            <AiFillHome className="me-3 fs-5" />
            Dashboard
          </li>
        </Link>
        <Link to="/adminList" className="text-decoration-none">
          <li>
            <HiClipboardList className="me-3 fs-5" />
            Admin List
          </li>
        </Link>
        <Link to="/adminAgentList" className="text-decoration-none">
          <li>
            <FaListAlt className="me-3 fs-5" />
            Agent List
          </li>
        </Link>
        <Link to="/adminContractorList" className="text-decoration-none">
          <li>
            <FaListUl className="me-3 fs-5" />
            Contractor List
          </li>
        </Link>
        <Link to="/ProfileScreen" className="text-decoration-none">
          <li>
            <CgProfile className="me-3 fs-5" />
            Profile
          </li>
        </Link>
        <Link to="/adminCategoriesList" className="text-decoration-none">
          <li>
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
        <Link to="/Dashboard" className="text-decoration-none">
          <li>
            <BsFillChatLeftQuoteFill className="me-3 fs-5" />
            Chat
          </li>
        </Link>
        <Link
          to="#Logout"
          onClick={signoutHandler}
          className="text-decoration-none">
          <li>
            <MdLogout className="me-3 fs-5" />
            Logout
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;
