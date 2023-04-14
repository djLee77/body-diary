import './App.css';
import Calendar from "./components/CalendarComponent"
import Diary from "./components/DiaryPage"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import { BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Calendar/>}></Route>
        <Route path={"/login"} element={<Login/>}></Route>
        <Route path={"/signup"} element={<SignUp/>}></Route>
        <Route path="/diary/:date" element={<Diary/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
