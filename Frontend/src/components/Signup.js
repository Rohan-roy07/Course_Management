import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("Student");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Signup function
  const handleSignup = async (e) => {

    e.preventDefault();

    const userData = {
      username,
      email,
      password,
      mobileNumber: mobile,
      userRole: role
    };

    try {

      await api.post("/Authentication/register", userData);

      navigate("/login");

    } catch (err) {

      setError("Registration failed");

    }
  };

  return (

    <div
      className="container mt-5 d-flex align-items-center justify-content-center flex-wrap gap-5"
      style={{ maxWidth: "1000px" }}
    >

      {/* Animation Section */}
      <video
        src="https://cdnl.iconscout.com/lottie/premium/thumb/man-creating-account-animation-gif-download-6716088.mp4"
        autoPlay
        loop
        muted
         style={{ width: "100%", maxWidth: "420px" }}
      />

      {/* Signup Form */}
      <div
        className="card shadow-lg border-0"
        style={{ width: "420px", borderRadius: "15px" }}
      >

        <div
          className="card-header text-center text-white"
          style={{
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px"
          }}
        >
          <h4 className="fw-bold">Create Account</h4>
        </div>

        <div className="card-body p-4">

          <form onSubmit={handleSignup}>

            <input
              className="form-control mb-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <select
              className="form-select mb-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Student</option>
              <option>Teacher</option>
            </select>

            {error && (
              <div className="alert alert-danger p-2 text-center">
                {error}
              </div>
            )}

            <button className="btn btn-success w-100 fw-bold">
              Register
            </button>
            <p>Already have an account?<span><a href="login">Login</a></span></p>
          </form>

        </div>

      </div>

    </div>
  );
}

export default Signup;