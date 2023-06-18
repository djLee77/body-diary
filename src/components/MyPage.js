import React, { useState, useEffect } from "react";
import MemoView from "./MemoView";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import axios from "axios";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
} from "@mui/material";
import "./MyPage.css";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [event, setEvent] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:3001/chart_data", {
      params: {
        event,
        startDate,
        endDate,
      },
    });
    setChartData(response.data);
  };

  return (
    <div style={{backgroundColor : "#f6f8fa"}}>
      <div className= "left-bg" style={{ float: "left" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#f6f8fa",
          }}
        >
          <Typography variant="h4" component="div" gutterBottom>
            1RM Chart
          </Typography>
          <div className="chartBox">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                margin: "20px",
              }}
            >
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  1RM
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  autoWidth
                  label="Event"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"Benchpress"}>Benchpress</MenuItem>
                  <MenuItem value={"Deadlift"}>Deadlift</MenuItem>
                  <MenuItem value={"Squat"}>Squat</MenuItem>
                  <MenuItem value={"O.H.P"}>O.H.P</MenuItem>
                </Select>
              </FormControl>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={fetchData}>
                Load Chart
              </Button>
            </Box>

            <LineChart
              width={600}
              height={400}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <Line type="monotone" dataKey="max" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="url" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        </Box>
      </div>
      <div className="right-bg">
        <MemoView/>
      </div>
    </div>
  );
};

export default MyPage;
