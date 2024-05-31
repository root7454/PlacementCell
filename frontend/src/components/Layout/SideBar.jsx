import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

export default function SideBar() {
    const [show, setShow] = useState(false);
    const { isAuthorized, setIsAuthorized, user } = useContext(Context);
    const navigateTo = useNavigate();
  
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
        toast.error(error.response.data.message), setIsAuthorized(true);
      }
    };

  return (
    <>

       <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
       <span id="header" class="header fixed-top d-flex align-items-center">
        <div className="container">
        <div >
          <img className="logo" src="/sbgi1.png" alt="logo" />
        </div>
        
		<div class="d-flex align-items-center justify-content-between">
		  <i class="bi bi-list toggle-sidebar-btn"></i>
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
              {user && user.role === "TPO"
                ? "All APPLICATIONS"
                : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role === "TPO" ? (
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
          ) : (
            <></>
          )}

          <button onClick={handleLogout}>LOGOUT</button>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
      </span>
    </nav>


    
    <aside className={isAuthorized ? "sidebar" : "sidebarHide"} id="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
            <li className="nav-item">
                <a className="nav-link" href="index.html">
                    <i className="bi bi-grid"></i>
                    <span className='btn-primary'>Dashboard</span>
                </a>
            </li>
  <li className="nav-item">
    <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
      <i className="bi bi-menu-button-wide"></i><span>Components</span><i className="bi bi-chevron-down ms-auto"></i>
    </a>
    <ul id="components-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
      <li>
        <a href="components-alerts.html">
          <i className="bi bi-circle"></i><span>Alerts</span>
        </a>
      </li>
      <li>
        <a href="components-accordion.html">
          <i className="bi bi-circle"></i><span>Accordion</span>
        </a>
      </li>
      <li>
        <a href="components-badges.html">
          <i className="bi bi-circle"></i><span>Badges</span>
        </a>
      </li>
      <li>
        <a href="components-breadcrumbs.html">
          <i className="bi bi-circle"></i><span>Breadcrumbs</span>
        </a>
      </li>
      <li>
        <a href="components-buttons.html">
          <i className="bi bi-circle"></i><span>Buttons</span>
        </a>
      </li>
      <li>
        <a href="components-cards.html">
          <i className="bi bi-circle"></i><span>Cards</span>
        </a>
      </li>
      <li>
        <a href="components-carousel.html">
          <i className="bi bi-circle"></i><span>Carousel</span>
        </a>
      </li>
      <li>
        <a href="components-list-group.html">
          <i className="bi bi-circle"></i><span>List group</span>
        </a>
      </li>
      <li>
        <a href="components-modal.html">
          <i className="bi bi-circle"></i><span>Modal</span>
        </a>
      </li>
      <li>
        <a href="components-tabs.html">
          <i className="bi bi-circle"></i><span>Tabs</span>
        </a>
      </li>
      <li>
        <a href="components-pagination.html">
          <i className="bi bi-circle"></i><span>Pagination</span>
        </a>
      </li>
      <li>
        <a href="components-progress.html">
          <i className="bi bi-circle"></i><span>Progress</span>
        </a>
      </li>
      <li>
        <a href="components-spinners.html">
          <i className="bi bi-circle"></i><span>Spinners</span>
        </a>
      </li>
      <li>
        <a href="components-tooltips.html">
          <i className="bi bi-circle"></i><span>Tooltips</span>
        </a>
      </li>
    </ul>
  </li>


  <li className="nav-item">
    <a className="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse" href="#">
      <i className="bi bi-gem"></i><span>Icons</span><i className="bi bi-chevron-down ms-auto"></i>
    </a>
    <ul id="icons-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
      <li>
        <a href="icons-bootstrap.html">
          <i className="bi bi-circle"></i><span>Bootstrap Icons</span>
        </a>
      </li>
      <li>
        <a href="icons-remix.html">
          <i className="bi bi-circle"></i><span>Remix Icons</span>
        </a>
      </li>
      <li>
        <a href="icons-boxicons.html">
          <i className="bi bi-circle"></i><span>Boxicons</span>
        </a>
      </li>
    </ul>
  </li>
  

</ul>

</aside>

    </>
  )
}
