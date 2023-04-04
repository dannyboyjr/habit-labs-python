import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
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

  return (
    <nav>
      <ul>
        <li className="active">
          <NavLink to="/" onClick={e => handleLinkClick(e, e.target)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/journals"
            className="navigation-journals"
			      activeClassName="active"
            onClick={e => handleLinkClick(e, e.target)}
          >
            Journals
          </NavLink>
        </li>
    {/* <li>
      <NavLink
        to="/habits"
        className="navigation-journals"
        activeClassName="active"
        onClick={e => handleLinkClick(e, e.target)}
      >
        Habits
      </NavLink>
    </li> */}
        <li>
          <NavLink
            to="/profile"
            className="navigation-journals"
			      activeClassName="active"
            onClick={e => handleLinkClick(e, e.target)}
          >
            Profile
          </NavLink>
        </li>
        
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
      <div className="line" ref={lineRef}></div>
    </nav>
  );
}

export default Navigation;