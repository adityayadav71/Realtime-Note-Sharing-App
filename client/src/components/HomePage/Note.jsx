import { FaTrash } from "react-icons/fa";

const Note = ({ id, title, labels, authors, content, handleDelete, handleClick }) => {
  return (
    <div
      className="group flex flex-col gap-3 h-36 overflow-hidden p-3 transition duration-300 hover:bg-white hover:text-black hover:ring-2 hover:ring-inset hover:ring-black hover:cursor-pointer bg-black text-white rounded-xl"
      onClick={() => handleClick(id)}
    >
      <div>
        <div className="flex items-center flex-wrap gap-3">
          <h1>{title}</h1>
          <div className="flex flex-row flex-wrap gap-3">
            {labels.map((label, i) => {
              return (
                <div key={i} className="px-2 py-1 text-xs bg-white text-black rounded-lg">
                  {label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {authors.map((author, i) => {
            return <p className="text-xs">{author}</p>;
          })}
        </div>
      </div>
      <p className="text-grey1 line-clamp-1">{content}</p>
      <button
        className="rounded-lg mt-auto ml-auto p-2 w-fit group-hover:bg-red-600 group-hover:text-white text-red-600 bg-white"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(id);
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default Note;
