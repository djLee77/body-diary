import React from 'react';
import { useParams } from 'react-router-dom';
// import EntryList from './EntryList';
// import AddEntryForm from './AddEntryForm';

const DiaryPage = () => {
  const { date } = useParams();

  return (
    <div>
      <h2>{date}의 웨이트 트레이닝 기록</h2>
      {/* <EntryList date={date} />
      <AddEntryForm /> */}
    </div>
  );
};

export default DiaryPage;