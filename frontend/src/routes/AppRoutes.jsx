import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Papers from "../pages/Papers";
import Topics from "../pages/Topics";
import Notes from "../pages/Notes";
import Favorites from "../pages/Favorites";
import PaperDetails from "../pages/PaperDetails";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/papers/:id" element={<PaperDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;