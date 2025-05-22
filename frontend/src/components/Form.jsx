import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import styles from "../styles/Form.module.css"
import LoadingIndicator from "../pages/LoadingIndicator"


const Form = ({route, method}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const name = method === "login" ? "Login" : "Register"

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await api.post(route, {
        username: username,
        password: password
      })

      if (method === "login") {
        alert("Login successful!");
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/");
      } else {
        navigate("/login")
      }

    }
    catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit} className={styles.form_container}>
      <h1>{name}</h1>
      <input 
        className={styles.form_input}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input 
        className={styles.form_input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading && <LoadingIndicator/>}
      <button className={styles.form_button} type="submit">{name}</button>
    </form>
  )
}

export default Form