import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((response) => response.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((error) => alert(error));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}`)
      .then((response) => {
        if (response.status === 204) alert("Note deleted!");
        else alert("Something went wrong");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (event) => {
    event.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((response) => {
        if (response.status === 201) alert("Note created!");
        else alert("Something went wrong");
        getNotes();
      })
      .catch((error) => alert(error));
    };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id}/>)}
      </div>
      <h2>Create Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(event) => setTitle(event.target.value)}
          value={title}
        />

        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Home;
