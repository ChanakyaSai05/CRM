import React from "react";
import { useNavigate } from "react-router-dom";
import svg from "../assets/404.svg";
function Notfound() {
  const history = useNavigate();
  function goBack() {
    history(-1);
  }
  return (
    <div className=" d-flex  justify-content-center align-items-center vh-100 text-center">
      <div>
        <h3>Hmm. This doesn't seem right.</h3>
        <p>This page doesnot exist</p>
        <img src={svg} alt="404" />
        <div>
          <button className="btn btn-sm btn-primary" onClick={goBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notfound;
