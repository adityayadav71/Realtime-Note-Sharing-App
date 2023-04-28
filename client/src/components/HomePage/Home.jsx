import DashBoard from "./Dashboard";
import { AuthContext } from "../../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="grow">
      {isLoggedIn ? (
        <DashBoard />
      ) : (
        <div className="flex flex-col h-full justify-center items-center">
          <h1 className="text-5xl font-bold">IBOOK</h1>
          <p className="mb-6">Create and Collaborate on Notes</p>
          <div className="flex items-center justify-center gap-3">
            <button className="px-6 py-2 rounded-xl text-white bg-slate-900" onClick={() => navigate("/login", { replace: false })}>
              Login
            </button>
            <button className="px-6 py-2 rounded-xl text-white bg-slate-900" onClick={() => navigate("/signup", { replace: false })}>
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
