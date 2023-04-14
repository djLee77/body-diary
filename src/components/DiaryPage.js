import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DiaryPage = () => {
  const { date } = useParams();
  const [exerciseData, setExerciseData] = useState({
    exercise1: { name: '', content: '' },
    exercise2: { name: '', content: '' },
    exercise3: { name: '', content: '' },
    exercise4: { name: '', content: '' },
    exercise5: { name: '', content: '' },
    exercise6: { name: '', content: '' },
  });

//--------운동 종목, 운동내용 input값----------------------------------------------------------------------//
  const handleChange = (e, exerciseKey) => {                                                              //
    const { name, value } = e.target;                                                                     //
    setExerciseData({                                                                                     //
      ...exerciseData,                                                                                    //
      [exerciseKey]: { ...exerciseData[exerciseKey], [name]: value },                                     //
    });                                                                                                   //
  };                                                                                                      //
//--------------------------------------------------------------------------------------------------------//

//-----------저장버튼 클릭시 실행 함수---------------------------------------------------------------------//
  const handleSubmit = async (e) => {                                                                     //
    e.preventDefault();                                                                                   //
    try {                                                                                                 //
      const response = await axios.post('http://localhost:3001/exercises', {                              //
        userid: localStorage.getItem("userid"),                                                           //
        date: date,                                                                                       //
        ...exerciseData                                                                                   //
      });                                                                                                 //
      console.log('Server response:', response.data);                                                     //
      alert("저장되었습니다.");                                                                            //
    } catch (error) {                                                                                     //
      console.error('Error sending data to server:', error);                                              //
    }                                                                                                     //
  };                                                                                                      //
//--------------------------------------------------------------------------------------------------------//


  useEffect(
    () => {
      console.log(localStorage.getItem("userid"));
    }
  // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가
  );

  return (
    <div>
      <h2>{date}</h2>
      <h1>운동 다이어리</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(exerciseData).map((exerciseKey) => (
          <div key={exerciseKey}>
            <input
              type="text"
              name="name"
              placeholder="운동 종목명"
              value={exerciseData[exerciseKey].name}
              onChange={(e) => handleChange(e, exerciseKey)}
            />
            <input
              type="text"
              name="content"
              placeholder="운동 수행 내용"
              value={exerciseData[exerciseKey].content}
              onChange={(e) => handleChange(e, exerciseKey)}
            />
          </div>
        ))}
        <button type="submit">저장</button>
      </form>
    </div>
  );
};

export default DiaryPage;