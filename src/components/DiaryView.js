import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DiaryView.css';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';

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
  }, [date]);

  return (
    <div className="diary-view-container">
      {diaryData ? (
        <>
          <Typography variant="h4" component="h1">
            {diaryData.title}
          </Typography>
          {diaryData.exercises.map((exercise, index) => (
            <Card key={index} className="exercise">
              <CardContent>
                <Typography variant="h5" component="h2">
                  {exercise.name}
                </Typography>
                <Typography variant="body1">
                  {exercise.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DiaryView;
