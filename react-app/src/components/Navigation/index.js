import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout } from "../../store/session";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [activeLink, setActiveLink] = useState(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (activeLink) {
      const pos = activeLink.offsetLeft;
      const width = activeLink.offsetWidth;
      lineRef.current.style.left = `${pos}px`;
      lineRef.current.style.width = `${width}px`;
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
  };

  return (
    <nav>
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
        
        {isLoaded && (
          <li>
          <button onClick={handleLogout}>Log Out</button>
        </li>
        )}
      </ul>
      <div className="line" ref={lineRef}></div>
    </nav>
  );
}

export default Navigation;