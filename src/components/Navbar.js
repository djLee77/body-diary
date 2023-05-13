import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [activeElement, setActiveElement] = useState(null);

  const handleItemClick = (e) => {
    setActiveElement(e.target);
  };

  const handleLogoutClick = (e) => {
    localStorage.setItem("isLogin", "false");
    navigate("/login");
  };

  const updateSelectorPosition = () => {
    if (activeElement) {
      const activeWidthHeight = activeElement.offsetHeight;
      const activeWidthWidth = activeElement.offsetWidth;
      const itemPosTop = activeElement.offsetTop;
      const itemPosLeft = activeElement.offsetLeft;
      const selector = document.querySelector(".hori-selector");

      selector.style.top = `${itemPosTop}px`;
      selector.style.left = `${itemPosLeft}px`;
      selector.style.height = `${activeWidthHeight}px`;
      selector.style.width = `${activeWidthWidth}px`;
    }
  };

  useEffect(() => {
    updateSelectorPosition();
    window.addEventListener("resize", updateSelectorPosition);

    return () => {
      window.removeEventListener("resize", updateSelectorPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeElement]);

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg">
      {/* <div style={{float:"left", color:"white", padding:"15px", paddingBottom:"0px"}}><p>Body Diary</p></div> */}
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <div className="hori-selector">
            <div className="left"></div>
            <div className="right"></div>
          </div>
          <li className="nav-item" onClick={handleItemClick}>
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item" onClick={handleItemClick}>
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/calendar"
            >
              Calendar
            </NavLink>
          </li>
          <li className="nav-item" onClick={handleItemClick}>
            <NavLink className="nav-link" activeClassName="active" to="/chart">
              Chart
            </NavLink>
          </li>
          <li className="nav-item" onClick={handleItemClick}>
            <NavLink className="nav-link" activeClassName="active" to="/mypage">
              Mypage
            </NavLink>
          </li>
          <div style={{float: "right"}}>
            {localStorage.getItem("isLogin") === "false" ? (
              <li>
                <a style={{padding :"0px"}}><Link to = "/login">Login</Link></a>
              </li>
            ) : (
              <li className="nav-item" onClick={handleLogoutClick}>
                <a style={{ cursor: "pointer" }}>Logout</a>
              </li>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
