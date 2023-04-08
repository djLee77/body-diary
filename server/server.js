const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");
const bodyParser = require("body-parser");
const util = require("util");

app.use(bodyParser.json());

app.use(cors());

app.get("/mysql", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const sqlQuery = "SELECT * FROM usertable";

  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//로그인
//---------------------------------------------------------------------------------------//
app.post("/login", async (req, res) => {                                                 //
  const { username, password } = req.body;                                               //
  try {                                                                                  //
    // username과 password를 인증 처리하고, 결과를 리턴하는 비동기 함수                    //
    const result = await authenticate(username, password);                               //
                                                                                         //
    if (result.success) {                                                                //
      res.send({ success: true, message: "인증되었습니다." });                            //
    } else {                                                                             //
      res.send({ success: false, message: "인증에 실패했습니다." });                      //
    }                                                                                    //
  } catch (error) {                                                                      //
    console.error(error);                                                                //
    res.status(500).send({ success: false, message: "서버 오류입니다." });                //
  }                                                                                      //
});                                                                                      //
//---------------------------------------------------------------------------------------//

// 회원가입
//-------------------------------------------------------------------------------------------------------//
app.post("/register", async (req, res) => {                                                              //
  const { username, password } = req.body;                                                               //
  try {                                                                                                  //
    const userExists = await checkIfUserExists(username);                                                //
    if (userExists) {                                                                                    //
      res.send({ success: false, message: "이미 존재하는 유저입니다." });                                 //
    } else {                                                                                             //
      const query = `INSERT INTO usertable (username, password) VALUES ('${username}', '${password}')`;  //
      // db.query를 Promise로 변경                                                                       //
      const queryPromise = util.promisify(db.query).bind(db);                                            //
      await queryPromise(query);                                                                         //
      res.send({ success: true, message: "회원가입에 성공했습니다." });                                   //
    }                                                                                                    //
  } catch (error) {                                                                                      //
    console.error(error);                                                                                //
    res.status(500).send({ success: false, message: "서버 오류입니다." });                                //
  }                                                                                                      //
});                                                                                                      //
//-------------------------------------------------------------------------------------------------------//

//회원가입 처리
//--------------------------------------------------------------------------------------------------------//
async function registerUser(username, password) {                                                         //
  const query = `INSERT INTO usertable (username, password) VALUES ('${username}', '${password}')`;       //
                                                                                                          //
  // db.query를 Promise로 변경                                                                            //
  const queryPromise = util.promisify(db.query).bind(db);                                                 //
                                                                                                          //
  try {                                                                                                   //
    const result = await queryPromise(query);                                                             //
    if (result.affectedRows === 1) {                                                                      //
      return { success: true };                                                                           //
    }                                                                                                     //
    return { success: false };                                                                            //
  } catch (error) {                                                                                       //
    return {success: false};                                                                              //
  }                                                                                                       //
}                                                                                                         //
//--------------------------------------------------------------------------------------------------------//

// 회원가입 시 기존에 존재하는 유저인지 확인하는 함수
//--------------------------------------------------------------------------------------------------------//
async function checkIfUserExists(username) {                                                              //
  const query = `SELECT * FROM usertable WHERE username = '${username}'`;                                 //
                                                                                                          //
  // db.query를 Promise로 변경                                                                            //
  const queryPromise = util.promisify(db.query).bind(db);                                                 //
                                                                                                          //
  try {                                                                                                   //
    const result = await queryPromise(query);                                                             //
    // 검색 결과가 없거나 에러가 발생한 경우                                                               //
    if (result.length === 0) {                                                                            //
      return false;                                                                                       //
    } else {                                                                                              //
      return true;                                                                                        //
    }                                                                                                     //
  } catch (error) {                                                                                       //
    console.error(error);                                                                                 //
    return true;                                                                                          //
  }                                                                                                       //
}                                                                                                         //
//--------------------------------------------------------------------------------------------------------//


const port = 3001;
app.listen(port, () =>
  console.log(`Node.js Server is running on port ${port}...`)
);
