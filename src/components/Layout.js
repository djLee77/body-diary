import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Layout() {
  const navigate = useNavigate();
  const onClickLogout = () => {
    localStorage.setItem("isLogin", "false");
    navigate("/login");
  };

  useEffect(
    () => {
      if (localStorage.getItem("isLogin") !== "true") {
        navigate("/login");
      }
    }
    // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가
  );
  return (
    <div>
      메인페이지
      <button onClick={onClickLogout}>로그아웃</button>
    </div>
  );
}

export default Layout;
