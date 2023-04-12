import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout } from "../../store/session";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [activeLink, setActiveLink] = useState(null);
 


  useEffect(() => {
    if (activeLink) {
      const pos = activeLink.offsetLeft;
      const width = activeLink.offsetWidth;
    }
  }, [activeLink]);

  const handleLinkClick = (e, link) => {
    setActiveLink(link);
  };

  const navLinkClass = (link) => {
    if (link === activeLink) {
      return "active";
    }
    return "";
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    window.location.href = "/";

  };

  return sessionUser ? (
    <div className="nav-bar">
    <nav>
       <div className="nav-links-container">
      <ul>
        <li className={navLinkClass('/')}>
          <NavLink to="/" onClick={e => handleLinkClick(e, "/")}>
            Home
          </NavLink>
        </li>
        <li className={navLinkClass("/journals")}>
          <NavLink
            to="/journals"
            className="navigation-journals"
            onClick={e => handleLinkClick(e, "/journals")}
          >
            Journals
          </NavLink>
        </li>
        <li className={navLinkClass("/profile")}>
          <NavLink
            to="/profile"
            className="navigation-journals"
            onClick={e => handleLinkClick(e, "/profile")}
          >
            Profile
          </NavLink>
        </li>
  
      </ul>
      </div>
      
    </nav>
    {isLoaded && (
          <button className="submit-button" id="logout-btn" onClick={handleLogout}>Log Out</button>
        )}

    </div>
  ): (
    <div></div>
  )
}

export default Navigation;