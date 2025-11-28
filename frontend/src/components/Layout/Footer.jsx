import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; JobSeekingApp - All rights reserved to N Gourav</div>
      <div>
        <Link to={"https://github.com/gnutulapati"} target="_blank">
          <FaGithub />
        </Link>
        <Link
          to={"https://www.linkedin.com/in/gourav-nutulapati-5433342a4/"}
          target="_blank"
        >
          <FaLinkedin />
        </Link>
        <Link
          to={"https://nutulapati-gourav-potfolio.netlify.app/"}
          target="_blank"
        >
          <FaGlobe />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
