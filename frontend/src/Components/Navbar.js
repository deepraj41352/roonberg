import React from 'react';
import { Nav } from 'react-bootstrap';
import { Person } from '@mui/icons-material';

function Navbar() {
  return (
    <div className="Navbar-outer">
      <Nav
        className="Nav-login justify-content-end gap-3  "
        variant="pills"
        defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link className="Knowledge-base py-1 px-2">
            Knowledge Base
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="navi-tem">
          <Nav.Link href="/home" className="py-1 px-3">
            <Person className="Icon-person" />
            Login
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="navi-tem">
          <Nav.Link href="/home" className="py-1 px-3">
            Admin Login
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default Navbar;
