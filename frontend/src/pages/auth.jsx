import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./auth.css"


export default function Auth() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", form);
    const data = res.data;

    console.log(data);

    if (data.token) {
      login(data.token, data.U_Name);
      navigate("/home");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};

  return (
  <div className="auth-container">
    <div className="auth-box">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>

    </div>
  </div>
);
}
