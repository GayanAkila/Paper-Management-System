import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default App;
