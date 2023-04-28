import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { getNoteById, updateNote } from "../../api/notesAPI";
import { AuthContext } from "../../App";
import { RoomContext } from "../../layouts/AppLayout";

const Editor = ({ isRoom }) => {
  const params = useParams();
  const textareaRef = useRef(null);

  const [note, setNote] = useState(null);
  const noteRef = useRef(note);
  const [isUpdatedByServer, setIsUpdatedByServer] = useState(false);
  const [isUpdatedByClient, setIsUpdatedByClient] = useState(false);
  const { userData, socket } = useContext(AuthContext);
  const { roomData, setRoomData } = useContext(RoomContext);

  useEffect(() => {
    const loadData = async () => {
      const existingRoom = JSON.parse(localStorage.getItem("room"));
      const note = await getNoteById(isRoom ? roomData?.note || existingRoom?.note : params.noteId);
      isRoom && setRoomData(existingRoom.note);
      setNote(note);
    };
    loadData();

    async function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (isRoom) await updateNote(noteRef.current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    socket?.on("NOTE_UPDATED", (note, updatedBy) => {
      setNote(note);
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setIsUpdatedByServer(true);
      setIsUpdatedByClient(false);
    });
  }, [socket]);

  useEffect(() => {
    const saveNote = async () => {
      try {
        if (!isRoom) await updateNote(note);
      } catch (error) {
        console.error(error);
      }
    };

    const timerId = setTimeout(() => {
      saveNote();
    }, 1000);

    if (isRoom && (!isUpdatedByServer || isUpdatedByClient)) socket?.emit("NOTE_UPDATED", note, roomData.roomId, userData?._id);
    noteRef.current = note;

    return () => {
      clearTimeout(timerId);
    };
  }, [note, isUpdatedByServer]);

  function handleNoteChange(event) {
    setIsUpdatedByClient(true);
    const { value } = event.target;
    event.target.style.height = "auto";
    event.target.style.height = `${textareaRef.current.scrollHeight}px`;
    setNote((prevNote) => {
      return { ...prevNote, content: value };
    });
  }

  function handleTitleChange(event) {
    setIsUpdatedByClient(true);
    const { value } = event.target;
    setNote((prevNote) => {
      return { ...prevNote, title: value };
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="text" className="text-4xl p-3 focus:outline-none" defaultValue={note?.title} onChange={handleTitleChange} placeholder="Title" />
      <textarea
        className="p-3 m-3 shadow-lg rounded-lg bg-slate-100 text-black focus:outline-none resize-none"
        name="note"
        id="note"
        placeholder="Start writing here..."
        value={note?.content}
        onChange={handleNoteChange}
        ref={textareaRef}
      />
    </div>
  );
};

export default Editor;
