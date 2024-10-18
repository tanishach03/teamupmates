import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "../../context/auth-context";

const MainNavigation = (props) => {
  const context = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyGame</h1>
      </div>
      <div className="main-navigation__items">
        <ul>
          {!context.token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/games">Games</NavLink>
          </li>
          {context.token && (
            <React.Fragment>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={context.logout}>Logout</button>
              </li>
            </React.Fragment>
          )}
        </ul>
      </div>
    </header>
  );
};

export default MainNavigation;
