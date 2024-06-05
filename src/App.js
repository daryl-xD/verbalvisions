import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import MoviePageHome from "./views/MoviePageHome";
import MoviePageDetails from "./views/MoviePageDetails";
import SignUpPage from "./views/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MoviePageHome />} />
        <Route path="/movie/:id" element={<MoviePageDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;