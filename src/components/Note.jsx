import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function Note(props) {
  function handleDelete(e) {
    e.stopPropagation();
    props.onDelete(props.id);
  }

  function handleOpen() {
    if (props.onOpen) {
      props.onOpen({ id: props.id, title: props.title, content: props.content });
    }
  }

  return (
    <div className="note" onClick={handleOpen} style={{ cursor: "pointer" }}>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleDelete}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
