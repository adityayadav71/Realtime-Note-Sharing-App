import { Outlet, useParams, useLocation } from "react-router-dom";
import Navbar from "../components/HomePage/Navbar";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { getRoomData } from "../api/roomsAPI";

export const RoomContext = createContext(null);

const AppLayout = ({ handleLogout }) => {
  const params = useParams();
  const location = useLocation();
  const { userData, socket } = useContext(AuthContext);

  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("room")) {
      const existingRoom = JSON.parse(localStorage.getItem("room"));
      const roomId = existingRoom?.roomId;
      const loadData = async () => {
        if (roomId) {
          const room = await getRoomData(roomId);

          // If roomData is not undefined
          if (room) {
            socket?.emit("join-room", userData, existingRoom, true);
            setRoomData(room);
          }
        }
      };
      loadData();
    }

    socket?.on("updated-room-data", async (data) => {
      // 2. Check if user is the host and assign iAmHost field value
      let iAmHost = false;
      const userId = userData?.user?._id;
      if (userId === data?.owner) iAmHost = true;

      setRoomData({ ...data, iAmHost });
      localStorage.setItem("room", JSON.stringify({ ...data, iAmHost }));
    });
  }, [location, socket]);

  return (
    <RoomContext.Provider value={{ roomData, setRoomData }}>
      <div className={`flex flex-col ${params?.name ? "h-screen" : "h-full"}`}>
        <Navbar handleLogout={handleLogout} />
        <Outlet />
      </div>
    </RoomContext.Provider>
  );
};

export default AppLayout;
