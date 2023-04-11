import './App.css';
import Layout from "./components/Layout";
import Login from "./components/Login"
import { BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Layout/>}></Route>
        <Route path={"/login"} element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
