import React from "react";
import { useNavigate } from "react-router-dom";
import svg from "../assets/403.svg";

function Unauthorised() {
  const history = useNavigate();
  const goBack = () => {
    history(-1);
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-center">
      <div>
        <h3>You are not allowed to access this page.</h3>
        <img src={svg} alt="403" />
        <div>
          <button className="btn btn-sm btn-danger" onClick={goBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorised;
