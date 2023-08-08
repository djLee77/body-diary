import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");

  const navigate = useNavigate();

  // const [isLogin, setIsLogin] = useState(false);
  // input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };

  // const onClickSignUp = (e) => {
  //   navigate("/signup");
  // };

  // login 버튼 클릭 이벤트
  const onClickLogin = () => {
    console.log("click login");
    const data = {
      userid: inputId,
      password: inputPw,
    };

    axios
      .post("http://localhost:3001/login", data)
      .then((response) => {
        //console.log(response.data);
        localStorage.setItem("isLogin", response.data.success);
        console.log(
          "is Login in localstorage : " + localStorage.getItem("isLogin")
        );

        if (localStorage.getItem("isLogin") === "true") {
          console.log("Login success");
          localStorage.setItem("userid", inputId);
          navigate("/calendar");
        } else {
          alert("ID 혹은 Password를 확인해주세요.");
        }
      })
      .catch((error) => {
        console.log(error);
        // 에러가 발생했을 때 처리할 코드
      });
  };

  const handleOnKeyDown = e => {
    if (e.key === 'Enter') {
      onClickLogin(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  // 페이지 렌더링 후 가장 처음 호출되는 함수
  useEffect(
    () => {
      if (localStorage.getItem("isLogin") === "true") {
        console.log("Login success");
      }
    }
    // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가
  );

  const changeColor = (e) => {
    e.target.style.color = "blue";
  }

  const removeColor = (e) => {
    e.target.style.color = "#24292f";
  }
  return (
    <div className="login_body">
      <div class="login-page">
        <div class="form">
          <form class="login-form">
            <input
              type="text"
              placeholder="username"
              value={inputId}
              onChange={handleInputId}
            />
            <input
              type="password"
              placeholder="password"
              value={inputPw}
              onChange={handleInputPw}
              onKeyDown={handleOnKeyDown}
            />
            <button type="button" onClick={onClickLogin}>
              login
            </button>
            <p class="message" onMouseOver={changeColor} onMouseOut={removeColor}>
              Not registered? <Link to={'/signup'}>Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
