import React, { useState } from "react";
import "../styles/Login.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { userSignUp, userSignIn } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showSignup, setShowSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("CUSTOMER");
  const [userData, setUserData] = useState({});
  let history = useNavigate();

  const loginFn = (e) => {
    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;
    const data = {
      userId: userId,
      password: password,
    };
    e.preventDefault();
    userSignIn(data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          //userid,email,userType,userStatus,token.
          if (response.data.message) {
            setMessage(response.data.message);
          } else {
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("userType", response.data.userTypes);
            localStorage.setItem("userStatus", response.data.userStatus);
            localStorage.setItem("token", response.data.accessToken);

            //customer,engineer,admin
            if (response.data.userTypes === "CUSTOMER") {
              // window.location.href = "/customer";//it is directly accessing the dom element //we can use this but direct connection is not feasable
              //thats why we are using navigate
              //In react virtual dom is there it is in between react project and real dom
              // virtual dom checks what changes it happened and updates in real dom
              history("/customer");
            } else if (response.data.userTypes === "ENGINEER") {
              // window.location.href = "/engineer";
              history("/engineer");
            } else {
              // window.location.href = "/admin";
              history("/admin");
            }
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setMessage(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };
  const updateSignupData = (e) => {
    //2nd way of storing data
    userData[e.target.id] = e.target.value;
    // setUserData(([e.target.id] = e.target.value));//not working like this
    console.log(userData);
  };
  const signupFn = (e) => {
    const username = userData.username;
    const userId = userData.userId;
    const password = userData.password;
    const email = userData.email;
    const data = {
      name: username,
      userId: userId,
      email: email,
      userType: userType,
      password: password,
    };
    console.log(data);
    e.preventDefault();
    // let status=userSignUp(data) if we do this and console.log(status) then you will get total promise in that all the data is shown clearly
    userSignUp(data)
      .then((response) => {
        // console.log(response);
        if (response.status === 201) {
          // window.location.href = "/";
          history("/");
          //mam used history(0) it is refresh mam said
        }
        if (response === 204) {
          //204 is no content since it is not an error we are redirecting to home
          history(0);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setMessage(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };
  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };
  const handleSelect = (e) => {
    setUserType(e);
  };
  console.log(userData);
  return (
    <div id="loginPage">
      <div
        id="loginPage"
        className="bg-primary d-flex justify-content-center align-items-center vh-100"
      >
        <div className="card m-5 p-5 ">
          <div className="row m-2 bg-white">
            <div className="col">
              {!showSignup ? (
                <div>
                  <h4 className="text-center my-2">Login</h4>
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
                      className="signup-btn text-center text-info "
                      style={{ cursor: "pointer" }}
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
                        onChange={updateSignupData}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        id="username"
                        onChange={updateSignupData}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        id="email"
                        onChange={updateSignupData}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        id="password"
                        onChange={updateSignupData}
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
                      className="signup-btn text-center text-info"
                      style={{ cursor: "pointer" }}
                      onClick={toggleSignup}
                    >
                      Already have an Account ? Login
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
// https://relevel-crm--backend.herokuapp.com
