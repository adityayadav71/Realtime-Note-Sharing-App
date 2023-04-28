import { useEffect, useRef, useState } from "react";
import Note from "./Note";
import { getUserNotes, createNote, deleteNote } from "../../api/notesAPI";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashBoard = (props) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const notes = await getUserNotes();
      if (notes) setNotes(notes);
    };
    loadData();
  }, []);

  const handleCreate = async () => {
    setModalOpen(true);
    const note = await createNote(titleInputRef.current.value);
    if (note) {
      navigate(`/notepad/${note._id}`, { replace: false });
    } else {
      window.alert("Something went wrong! Please try again!");
    }
  };

  const handleDelete = async (id) => {
    const note = await deleteNote(id);
    if (!note) window.alert("Something went wrong. Please try again!");

    const updatedNotes = await getUserNotes();
    if (updatedNotes) setNotes(updatedNotes);
  };

  const handleNoteClick = (id) => {
    navigate(`/notepad/${id}`);
  };

  return (
    <div className="relative grid grid-cols-4 gap-3 p-3">
      {notes.length !== 0 &&
        notes?.map((note, i) => (
          <Note key={i} id={note?._id} title={note?.title} labels={note?.labels} authors={note?.authors} content={note?.content} handleDelete={handleDelete} handleClick={handleNoteClick} />
        ))}
      {modalOpen ? (
        <div className="flex flex-col gap-3 p-3 bg-grey2 rounded-xl hover:cursor-pointer">
          <input ref={titleInputRef} className="p-2 rounded-lg" type="text" placeholder="Set Note Title..." />
          <div className="flex items-center gap-3 w-full">
            <button className="grow bg-black text-white rounded-xl px-3 py-2" onClick={handleCreate}>
              Create
            </button>
            <button className="grow bg-red-500 text-white rounded-xl px-3 py-2" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-3 h-36 bg-grey2 rounded-xl hover:cursor-pointer">
          <div className="rounded-full p-3 bg-grey1 w-fit" onClick={() => setModalOpen(true)}>
            <FaPlus />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
