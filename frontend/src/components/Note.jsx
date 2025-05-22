import React from "react";
import styles from "../styles/Note.module.css";

const Note = ({ note, onDelete }) => {

  const formattedDate = new Date(note.created_at).toLocaleString('en-US');

  return (
    <div className={styles.note_container}>
      <p className={styles.note_title}>{note.title}</p>
      <p className={styles.note_content}>{note.content}</p>
      <p className={styles.note_date}>{formattedDate}</p>
      <button
        className={styles.delete_button}
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default Note;
