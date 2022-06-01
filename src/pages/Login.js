import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { REACT_APP_SERVER_URL } from "../config/config";

const BASE_URL = REACT_APP_SERVER_URL;
function Login() {
  const [showSignup, setShowSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("CUSTOMER");

  const loginFn = (e) => {
    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;
    const data = {
      userId: userId,
      password: password,
    };
    e.preventDefault();
    axios
      .post(BASE_URL + "/crm/api/v1/auth/signin", data)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };
  const signupFn = () => {};
  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };
  const handleSelect = (e) => {
    setUserType(e);
  };
  return (
    <div id="loginPage">
      <div
        id="loginPage"
        className="bg-primary d-flex justify-content-center align-items-center vh-100"
      >
        <div className="card m-5 p-5">
          <div className="row m-2">
            <div className="col">
              {!showSignup ? (
                <div>
                  <h4 className="text-center">Login</h4>
                  <form onSubmit={loginFn}>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="UserId"
                        id="userId"
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        id="password"
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="submit"
                        className="form-control btn btn-primary"
                        placeholder="UserId"
                        value="Log in"
                        required
                      />
                    </div>
                    <div
                      className="signup-btn text-right text-info "
                      onClick={toggleSignup}
                    >
                      Dont have an Account ? Signup
                    </div>
                    <div className="auth-error-msg text-danger text-center">
                      {message}
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h4 className="text-center">Signup</h4>
                  <form onSubmit={signupFn}>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="UserId"
                        id="userId"
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        id="username"
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        id="password"
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <span className="text-muted my-2 mx-2">User Type</span>
                      <DropdownButton
                        align="end"
                        title={userType}
                        id="userType"
                        onSelect={handleSelect}
                      >
                        <Dropdown.Item eventKey="CUSTOMER">
                          CUSTOMER
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="ENGINEER">
                          ENGINEER
                        </Dropdown.Item>
                      </DropdownButton>
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="submit"
                        className="form-control btn btn-primary"
                        placeholder="UserId"
                        value="Sign up"
                        required
                      />
                    </div>
                    <div
                      className="signup-btn text-right text-info"
                      onClick={toggleSignup}
                    >
                      Dont have an Account ? Signup
                    </div>
                    <div className="auth-error-msg text-danger text-center">
                      {message}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
