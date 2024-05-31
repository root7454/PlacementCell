import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import "./Footer.css"

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <div id="main" className="main">
    <footer className={isAuthorized ? "footerShow fixed-bottom d-flex align-items-center" : "footerHide "}>
      <div>&copy; All Rights Reserved By SBGI</div>
      <div>
        <Link to={"https://www.facebook.com/"} target="_blank">
          <FaFacebookF />
        </Link>
        <Link to={"https://www.youtube.com/"} target="_blank">
          <FaYoutube />
        </Link>
        <Link to={"https://www.linkdin.com/"} target="_blank">
          <FaLinkedin />
        </Link>
        <Link to={"https://www.instagram.com/"} target="_blank">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
