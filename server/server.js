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
  const { userid, password } = req.body;                                                 //
  try {                                                                                  //
    // username과 password를 인증 처리하고, 결과를 리턴하는 비동기 함수                    //
    const result = await authenticate(userid, password);                                 //
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

//로그인검사
//--------------------------------------------------------------------------------------------------------//
async function authenticate(userid, password) {                                                           //
  const query = `SELECT * FROM usertable WHERE userid = '${userid}' AND password = '${password}'`;        //
                                                                                                          //
  // db.query를 Promise로 변경                                                                            //
  const queryPromise = util.promisify(db.query).bind(db);                                                 //
                                                                                                          //
  try {                                                                                                   //
    const result = await queryPromise(query);                                                             //
    // 검색 결과가 없거나 에러가 발생한 경우                                                                //
    if (result.length === 0) {                                                                            //
      return { success: false };                                                                          //
    }                                                                                                     //  
    // 검색 결과가 있으면 인증 성공                                                                        //
    return { success: true };                                                                             //
  } catch (error) {                                                                                       //
    return {success: false};                                                                              //
  }                                                                                                       //
}                                                                                                         //
//--------------------------------------------------------------------------------------------------------//

// 회원가입
//-------------------------------------------------------------------------------------------------------//
app.post("/register", async (req, res) => {                                                              //
  const { userid, name, password } = req.body;                                                           //
  try {                                                                                                  //
    const userExists = await checkIfUserExists(userid);                                                  //
    if (userExists) {                                                                                    //
      res.send({ success: false, message: "이미 존재하는 유저입니다." });                                 //
    } else {                                                                                             //
      const query = `INSERT INTO usertable (userid, password, name) VALUES ('${userid}', '${password}', '${name}')`;//
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

// 회원가입 시 기존에 존재하는 유저인지 확인하는 함수
//--------------------------------------------------------------------------------------------------------//
async function checkIfUserExists(userid) {                                                                //
  const query = `SELECT * FROM usertable WHERE userid = '${userid}'`;                                     //
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


//-------Diary page 내용 DB에 저장--------------------------------------------------------------------------------------------------------------------------//
app.post('/exercises', (req, res) => {                                                                                                                      //
  const {                                                                                                                                                   //
    userid, date, title, exercise1, exercise2, exercise3, exercise4, exercise5, exercise6                                                                          //
  } = req.body;                                                                                                                                             //
                                                                                                                                                            //
  console.log(req.body);                                                                                                                                    //
                                                                                                                                                            //
  const insertQuery = `                                                                                                                                     
  INSERT INTO diary (userid, url, title, exercise1, field1, exercise2, field2, exercise3, field3, exercise4, field4, exercise5, field5, exercise6, field6)         
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
                                                                                                                                                            //
  const values = [                                                                                                                                          //
    userid, date, title,                                                                                                                                          //
    exercise1.name, exercise1.content,                                                                                                                      //
    exercise2.name, exercise2.content,                                                                                                                      //
    exercise3.name, exercise3.content,                                                                                                                      //
    exercise4.name, exercise4.content,                                                                                                                      //
    exercise5.name, exercise5.content,                                                                                                                      //
    exercise6.name, exercise6.content,                                                                                                                      //
  ];                                                                                                                                                        //
                                                                                                    //--------------------------------------------------------
  db.query(insertQuery, values, (error) => {                                                        //
    if (error) {                                                                                    //
      res.status(500).json({ message: 'Error saving exercise data to the database.', error });      //
      return;                                                                                       //
    }                                                                                               //
    res.status(201).json({ message: 'Exercise data saved to the database.' });                      //
  });                                                                                               //
});                                                                                                 //
                                                                                                    //
//--------------------------------------------------------------------------------------------------//


//기존 다이어리가 있는지 검사-----------------------------------------------------------------------------//
app.post('/diary_url', async(req,res) => {                                                               //
  const{userid, date} = req.body;                                                                        //
  try {                                                                                                  //
    const diaryExists = await checkIfDiaryExists(userid, date);                                          //
    if (diaryExists) {                                                                                   //
      const selectQuery = `SELECT title FROM diary WHERE userid = ? AND url = ?`;                        //
      db.query(selectQuery, [userid, date], (error, result) => {                                         //
        if (error) {                                                                                     //
          res.status(500).send({ success: false, message: "서버 오류입니다." });                          //
        } else {                                                                                         //
          const title = result[0].title;                                                                 //
          res.send({ exist: true, title });                                                              //
        }                                                                                                //
      });                                                                                                //
    } else {                                                                                             //                                                                         //
      res.send({ exist: false });                                                                        //
    }                                                                                                    //
  } catch (error) {                                                                                      //
    console.error(error);                                                                                //
    res.status(500).send({ success: false, message: "서버 오류입니다." });                                //
  }                                                                                                      //
})                                                                                                       //
//-------------------------------------------------------------------------------------------------------//


// 해당 날짜가 db에 존재하는지 검사
//--------------------------------------------------------------------------------------------------------//
async function checkIfDiaryExists(userid, date) {                                                         //
  const query = `SELECT url FROM diary WHERE userid = '${userid}' and url = '${date}'`;                   //
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

//----------------------------diary view에 데이터 전송----------------------------------------------------//
app.post('/diary_data', async (req, res) => {                                                            //
  const { userid, date } = req.body;                                                                     //
                                                                                                         //
  try {                                                                                                  //
    const diaryData = await getDiaryData(userid, date);                                                  //
    res.send(diaryData);                                                                                 //
  } catch (error) {                                                                                      //
    console.error(error);                                                                                //
    res.status(500).send({ success: false, message: '서버 오류입니다.' });                                //
  }                                                                                                      //
});                                                                                                      //
                                                                                                         //
async function getDiaryData(userid, date) {                                                              //
  const query = `SELECT * FROM diary WHERE userid = '${userid}' and url = '${date}'`;                    //
                                                                                                         //
  const queryPromise = util.promisify(db.query).bind(db);                                                //
                                                                                                         //
  try {                                                                                                  //
    const result = await queryPromise(query);                                                            //
                                                                                                         //
    if (result.length === 0) {                                                                           //
      return null                                                                                        //
    } else {                                                                                             //
      const diary = result[0];                                                                           //
                                                                                                         //
      const exercises = [                                                                                //
        { name: diary.exercise1, content: diary.field1 },                                                //
        { name: diary.exercise2, content: diary.field2 },                                                //
        { name: diary.exercise3, content: diary.field3 },                                                //
        { name: diary.exercise4, content: diary.field4 },                                                //
        { name: diary.exercise5, content: diary.field5 },                                                //
        { name: diary.exercise6, content: diary.field6 },                                                //
      ].filter((exercise) => exercise.name && exercise.content);                                         //
                                                                                                         //
      return {                                                                                           //
        title: diary.title,                                                                              //
        exercises: exercises,                                                                            //
      };                                                                                                 //
    }                                                                                                    //
  } catch (error) {                                                                                      //
    console.error(error);                                                                                //
    return null;                                                                                         //
  }                                                                                                      //
}                                                                                                        //
//-------------------------------------------------------------------------------------------------------//

app.post("/program_schedule", async (req, res) => {
  const { userid, schedule, date } = req.body;

  // 프로그램 일정을 데이터베이스에 저장하는 코드
  const sql = "INSERT INTO programs (userid, schedule, date) VALUES (?, ?, ?)";
  const values = [userid, schedule, date];

  try {
    await db.query(sql, values);
    res.send("Program schedule saved.");
  } catch (err) {
    console.error("Error inserting program schedule:", err);
    res.status(500).send("Error saving program schedule.");
  }
});
//----------------------------------------------------------------------------------------------------------

app.post("/get_program", async (req, res) => {
  const {userid} = req.body;
  try {                                                                                                    //
    const program = await getProgram(userid);                                                              //
    res.send(program);                                                                                     //
  } catch (error) {                                                                                        //
    console.error(error);                                                                                  //
    res.status(500).send({ success: false, message: '서버 오류입니다.' });                                  //
  }                                                                                                        //
                                                                                                           //
  async function getProgram(userid) {                                                                      //
    const query = `SELECT * FROM programs WHERE userid = '${userid}'`;                                     //
                                                                                                           //
    const queryPromise = util.promisify(db.query).bind(db);                                                //
                                                                                                           //
    try {                                                                                                  //
      const result = await queryPromise(query);                                                            //
                                                                                                           //
      if (result.length === 0) {                                                                           //
        return null                                                                                        //
      } else {                                                                                             //
        const row = result[0];                                                                             // 
        return {                                                                                           //
          date: row.date,                                                                                  //
          schedule: row.schedule                                                                           //
        };                                                                                                 //
      }                                                                                                    //
    } catch (error) {                                                                                      //
      console.error(error);                                                                                //
      return null;                                                                                         //
    }                                                                                                      //
  }                      
});


const port = 3001;
app.listen(port, () =>
  console.log(`Node.js Server is running on port ${port}...`)
);
