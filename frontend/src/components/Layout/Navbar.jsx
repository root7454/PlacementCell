import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import "../Application/dj.css";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  const handleProfileClick = () => {
    navigateTo("/myaccount");
  };

  // Determine whether to hide the navbar based on the current location
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  if (hideNavbar) {
    return null; // If on login or register page, return null to hide the navbar
  }

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
        <div className="container">
          <div>
            <img className="logo" src="/sbgi1.png" alt="logo" />
          </div>
          <ul className={!show ? "menu" : "show-menu menu"}>
            <li>
              <Link to={"/"} onClick={() => setShow(false)}>
                HOME
              </Link>
            </li>
            <li>
              <Link to={"/job/getall"} onClick={() => setShow(false)}>
                ALL JOBS
              </Link>
            </li>
            <li>
              <Link to={"/applications/me"} onClick={() => setShow(false)}>
                {user && user.role === "TPO" ? "ALL APPLICATIONS" : "MY APPLICATIONS"}
              </Link>
            </li>
            {user && user.role === "TPO" && (
              <>
                <li>
                  <Link to={"/job/post"} onClick={() => setShow(false)}>
                    POST NEW JOB
                  </Link>
                </li>
                <li>
                  <Link to={"/job/me"} onClick={() => setShow(false)}>
                    VIEW YOUR JOBS
                  </Link>
                </li>
              </>
            )}
            {user && (
              <a className="navbar-brand" onClick={handleProfileClick}>
                <img
                  src="/demo.png"
                  width="70"
                  height="70"
                  alt="Profile"
                  className="profile-pic"
                  style={{ cursor: "pointer" }}
                />
              </a>
            )}
            {isAuthorized && (
              <li>
                <button onClick={handleLogout}>LOGOUT</button>
              </li>
            )}
          </ul>
          <div className="hamburger">
            <GiHamburgerMenu onClick={() => setShow(!show)} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
