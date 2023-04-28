import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Editor from "./components/Editor/Index";
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import AppLayout from "./layouts/AppLayout";
import { createContext, useState, useEffect } from "react";
import { logout, checkLogInStatus } from "./api/authDataAPI";
import { io } from "socket.io-client";

export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [userData, setUserData] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const setLoggedIn = async () => {
      const status = await checkLogInStatus();

      if (status.isLoggedIn && socket === null) {
        const socket = io(import.meta.env.MODE === "production" ? import.meta.env.VITE_API_URL : import.meta.env.DEV_API_URL, {
          path: "/api/v1/socket.io",
        });
        setSocket(socket);
      }
      setIsLoggedIn(status.isLoggedIn);
      setUserData(status.userData);
    };
    setLoggedIn();
  }, []);

  const handleLogout = async () => {
    try {
      const loggedOut = await logout();
      setIsLoggedIn(!loggedOut);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        socket,
        setSocket,
      }}
    >
      <div className="mx-auto h-full w-full max-w-[2560px] overflow-x-hidden">
        <>
          <Routes>
            <Route path="/" element={<AppLayout handleLogout={handleLogout} />}>
              <Route index element={<Home />} />

              <Route path="signup" element={<SignUp />} />
              <Route path="login" element={<Login />} />

              <Route path="/notepad/:noteId" element={<Editor isRoom={false} />} />
              <Route path="/editor/:roomId" element={<Editor isRoom={true} />} />
            </Route>
          </Routes>
        </>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
