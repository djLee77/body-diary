import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DiaryView.css';
import { useParams } from 'react-router-dom';

const DiaryView = () => {
  const [diaryData, setDiaryData] = useState(null);
  const { date } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/diary_data', {
          userid: localStorage.getItem('userid'),
          date: date,
        });

        setDiaryData(response.data);
      } catch (error) {
        console.error('Error fetching diary data:', error);
      }
    };

    fetchData();
    console.log(date);
  }, [date]);

  return (
    <div className="diary-view-container">
      {diaryData ? (
        <>
          <h1>{diaryData.title}</h1>
          {diaryData.exercises.map((exercise, index) => (
            <div key={index} className="exercise">
              <h2>{exercise.name}</h2>
              <p>{exercise.content}</p>
            </div>
          ))}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DiaryView;
