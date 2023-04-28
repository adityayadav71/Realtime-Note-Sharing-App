import { AuthContext } from "../../App";
import { RoomContext } from "../../layouts/AppLayout";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, updateRoom, joinRoom, leaveRoom } from "../../api/roomsAPI";
import { nanoid } from "nanoid";
import { createNote } from "../../api/notesAPI";
import { FaAngleRight } from "react-icons/fa";

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const inviteCodeRef = useRef(null);
  const { isLoggedIn, userData, socket } = useContext(AuthContext);
  const { roomData, setRoomData } = useContext(RoomContext);

  const handleCreateSession = async () => {
    const roomId = nanoid();
    const room = await createRoom(socket, roomId);
    if (room) {
      const note = await createNote("New Room Created");
      const room = await updateRoom(roomId, note._id);
      localStorage.setItem("room", JSON.stringify(room));
      setRoomData(room);
      navigate(`/editor/${room.roomId}`);
    }
  };

  const handleJoinSession = async (e) => {
    e.preventDefault();
    const room = await joinRoom(userData, socket, inviteCodeRef.current.value);
    if (room) {
      localStorage.setItem("room", JSON.stringify(room));
      setRoomData(room);
      navigate(`/editor/${room.roomId}`);
    }
  };

  const handleLeaveRoom = async () => {
    const room = await leaveRoom(userData?.username, roomData?.roomId, socket);
    if (room) {
      localStorage.clear("room");
      setRoomData(null);
      navigate(`/`, { replace: false });
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-black">
      <p
        className="hover:cursor-pointer text-2xl font-bold"
        onClick={async () => {
          if (JSON.parse(localStorage.getItem("room"))) {
            if (window.confirm("Are you sure you want to leave the room?")) {
              await leaveRoom(userData?.username, roomData?.roomId, socket);
              localStorage.clear("room");
            }
          }
          navigate("/", { replace: false });
        }}
      >
        IBOOK
      </p>
      <div className="flex gap-3">
        {isLoggedIn && roomData ? (
          <>
            <button className="px-3 py-2 rounded-xl text-white bg-slate-900" onClick={handleLeaveRoom}>
              Leave Room
            </button>
            <input defaultValue={roomData.roomId} className="px-3 py-2 rounded-xl text-white bg-slate-900" />
          </>
        ) : (
          <>
            <form onSubmit={handleJoinSession} className="flex items-center gap-3 bg-gray-200 rounded-xl px-1">
              <input ref={inviteCodeRef} className="grow px-3 py-2 rounded-xl focus:outline-none bg-gray-200" type="text" placeholder="Enter Invite Code..." />
              <button type="submit" className="p-2 bg-white rounded-xl">
                <FaAngleRight className="text-lg" />
              </button>
            </form>
            <button className="px-3 py-2 rounded-xl text-white bg-slate-900" onClick={handleCreateSession}>
              Create Session
            </button>
          </>
        )}

        {isLoggedIn ? (
          <button className="px-6 py-2 rounded-xl text-white bg-slate-900" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="px-6 py-2 rounded-xl text-white bg-slate-900" onClick={() => navigate("/login", { replace: false })}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
