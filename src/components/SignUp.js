import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function SignUp() {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [inputName, setInputName] = useState("");
  const navigate = useNavigate();

  // input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };

  const handleInputName = (e) => {
    setInputName(e.target.value);
  };

  const onClickSignIn = () =>{
    navigate("/login");
  }

  // 회원가입 버튼 클릭 이벤트
  const onClickSignUp = () => {
    console.log("click SignUp");
    const data = {
      userid: inputId,
      password: inputPw,
      name: inputName,
    };
    axios
      .post("http://localhost:3001/register", data)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          alert("회원가입에 성공했습니다!");
          navigate("/login");
        } else {
          alert("이미 존재하는 회원정보입니다.");
        }
      })
      .catch((error) => {
        console.log(error);
        // 에러가 발생했을 때 처리할 코드
      });
  };

  // 페이지 렌더링 후 가장 처음 호출되는 함수
  useEffect(
    () => {
      axios
        .get("http://localhost:3001/mysql")
        .then((res) => console.log(res.data))
        .catch();
    },
    // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가
    []
  );

  const changeColor = (e) => {
    e.target.style.color = "blue";
  }

  const removeColor = (e) => {
    e.target.style.color = "#24292f";
  }
  return (
    <div>
      <div class="login-page">
        <div class="form">
          <form class="register-form">
            <input
              type="text"
              name="input_id"
              value={inputId}
              onChange={handleInputId}
              placeholder="id"
            />
            <input
              type="password"
              name="input_pw"
              value={inputPw}
              onChange={handleInputPw}
              placeholder="password"
            />
            <input
              type="name"
              name="input_name"
              value={inputName}
              onChange={handleInputName}
              placeholder="name"
            />
            <button type="button" onClick={onClickSignUp}>
              create
            </button>
            <p class="message" onMouseOver={changeColor} onMouseOut={removeColor}>
              Already registered? <Link to={"/login"}>Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
