import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../AuthContext";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post("/Authentication/login", {
        email,
        password
      });

      const { token, role, userName, id } = response.data;

      login(token, role, userName);
      localStorage.setItem("userId", id);

      navigate("/dashboard");

    } catch (err) {

      setError("Invalid email or password");

    }
  };

  return (

    <div className="container mt-5">

      <div className="row align-items-center justify-content-center">

        {/* Animation Section */}
        <div className="col-md-6 text-center mb-4 mb-md-0">

          <video
            src="https://cdnl.iconscout.com/lottie/premium/thumb/login-animation-gif-download-5455225.mp4"
            autoPlay
            loop
            muted
            style={{ width: "100%", maxWidth: "420px" }}
          />

        </div>

        {/* Login Form */}
        <div className="col-md-5">

          <div className="card shadow-lg border-0">

            <div
              className="card-header text-center text-white"
              style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}
            >
              <h4 className="fw-bold">Login</h4>
            </div>

            <div className="card-body p-4">

              <form onSubmit={handleLogin}>

                <div className="mb-3">
                  <label className="fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger p-2 text-center">
                    {error}
                  </div>
                )}

                <button className="btn btn-primary w-100 fw-bold">
                  Login
                </button>
                <p>Dont't have any account?<span><a href="signup">Sign Up</a></span></p>
              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;