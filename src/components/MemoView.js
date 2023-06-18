import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";

const MemoView = () => {
  const [memos, setMemos] = useState([]);
  useEffect(() => {
    const fetchMemos = async () => {
        try {
          const response = await axios.post('http://localhost:3001/memos', { userid : localStorage.getItem('userid') });
          const memosData = response.data.map(memo => memo.content);
          setMemos(memosData);
        } catch (error) {
          console.error('Error fetching memos:', error);
        }
      };
      console.log(memos);
      fetchMemos();
    }, []);
    return (
        <div>
          {memos.map((memo, index) => (
            <Card key={index} sx={{ maxWidth: 300, margin: 2 }}>
              <CardContent>
                <Typography variant="body1">{memo}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      );
};

export default MemoView;
