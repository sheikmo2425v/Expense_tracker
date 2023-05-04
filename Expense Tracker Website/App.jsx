import { Route, Routes } from "react-router-dom";
import Add_User from "./Add_user";
import Home from "./Home";
import Investment from "./invest";
import Logreg from "./Logreg";
import "./inex.css";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logreg" element={<Logreg />} />
        <Route path="/Add_user" element={<Add_User />} />
        <Route path="/invest" element={<Investment />} />
      </Routes>
    </>
  );
};

export default App;
