import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Sidebar from "../component/Sidebar";
import MaterialTable from "@material-table/core";
import { Modal } from "react-bootstrap";
import "../styles/admin.css";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { fetchTicket } from "../api/tickets";
import { getAllUsers, getCurrUser, userUpdation } from "../api/user";
import { ticketUpdation, singleTicket } from "../api/tickets";
function Admin() {
  const [userModal, setUserModal] = useState(false);
  const [ticketModal, setTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [editUser, setEditUser] = useState({});
  const [rowObj, setRowObj] = useState({});
  const dref = useRef();
  const pref = useRef();
  const sref = useRef();
  const aref = useRef();
  const history = useNavigate();
  const showUserModal = () => {
    setUserModal(true);
  };
  const showTicketModal = () => {
    setTicketModal(true);
  };
  const closeUserModal = () => {
    setUserModal(false);
  };
  const closeTicketModal = () => {
    setTicketModal(false);
  };

  useEffect(() => {
    (async () => {
      //calling the function asynchronously
      fetchTickets();
      getUsers();
    })();
  }, []);
  //fetch tickets
  const fetchTickets = () => {
    //we can write async here also instead of using in useEffect
    fetchTicket() //waiting for the response
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setTicketDetails(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //get all users
  const getUsers = () => {
    // let userId = localStorage.getItem("userId");
    getAllUsers()
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setUserDetails(res.data);
        }
      })
      .catch((err) => console.log(err));
  };
  //updating userdata
  const updateUserData = (e) => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const userTypes = document.getElementById("userTypes").value;
    const userStatus = document.getElementById("userStatus").value;
    // setEditUser({
    //   name: name,
    //   email: email,
    //   userTypes: userTypes,
    //   userStatus: userStatus,
    // });
    setEditUser({
      ...editUser,
      name,
      email,
      userTypes,
      userStatus,
    }); //we can do like this also it is working.
  };
  console.log(editUser);

  //Editing from modal
  const submitModalFn = () => {
    const userId = editUser.userId;
    // //
    // getCurrUser(userId)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
    // //
    let obj = {
      userName: editUser.userName,
      userStatus: editUser.userStatus,
      userType: editUser.userTypes,
    };

    userUpdation(userId, obj)
      .then((res) => console.log("Ticket updated successfully", res))
      .catch((err) => console.log(err));
    //checking the user is updated or not
    getCurrUser(userId)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  //
  // updateTicketData
  const updateTicketData = (e) => {
    // 1.Not working
    // const description = document.getElementById("description");
    // const priority = document.getElementById("ticketPriority");
    // const status = document.getElementById("status");
    // const assignee = document.getElementById("assignee");
    // setRowObj({
    //   description: description,
    //   ticketPriority: priority,
    //   status: status,
    //   assignee: assignee,
    // });
    //2.Not Working
    // rowObj[e.target.id] = e.target.value;
    //3.ref method
    let description = dref.current.value;
    let ticketPriority = pref.current.value;
    let status = sref.current.value;
    let assignee = aref.current.value;
    setRowObj({ ...rowObj, description, ticketPriority, status, assignee });
  };
  console.log(rowObj);
  //
  //submit Edit ticket function
  const submitModalTicketFn = () => {
    let id = rowObj.id;
    let data = {
      description: rowObj.description,
      ticketPriority: rowObj.ticketPriority,
      status: rowObj.status,
      assignee: rowObj.assignee,
    };
    ticketUpdation(id, data)
      .then((res) => {
        console.log("success", res);
        history(0);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="bg-light vh-100">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="container col m-2">
          <h3 className="text-primary text-center">Welcome Admin</h3>
          <p className="text-muted text-center">
            Take a quick look at your stats below
          </p>

          {/* STATS CARDS START HERE */}
          <div className="row my-5 mx-2 text-center">
            <div className="col my-1 p-2 mx-3 ">
              <div
                className="card bg-primary bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-b p-2">
                  <h5 className="card-subtitle">
                    <i className="bi bi-pen text-primary mx-2"></i>
                    Open
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col">8</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={80}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "darkBlue",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col my-1 p-2 mx-3">
              <div
                className="card bg-warning bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-p p-2">
                  <h5 className="card-subtitle">
                    <i className="bi bi-lightning-charge text-warning mx-2"></i>
                    Progress
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col">4</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={80}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "Gold",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col my-1 p-2 mx-3">
              <div
                className="card bg-success bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-c p-2">
                  <h5 className="card-subtitle">
                    <i className="bi bi-check2-circle text-success mx-2"></i>
                    Closed
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col">2</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={80}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "darkGreen",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col my-1 p-2 mx-3 ">
              <div
                className="card bg-secondary bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-bl p-2">
                  <h5 className="card-subtitle">
                    <i className="bi bi-slash-circle text-dark mx-2"></i>
                    Blocked
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col">2</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={80}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "darkGrey",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="container">
            <MaterialTable
              onRowClick={(e, rowData) => {
                // console.log(rowData);
                setRowObj(rowData);
                // console.log(rowObj);
                // singleTicket(rowObj.id)
                //   .then((res) => console.log(res))
                //   .catch((err) => console.log(err));
                showTicketModal();
              }}
              columns={[
                {
                  title: "Ticket ID",
                  field: "id",
                },
                {
                  title: "TITLE",
                  field: "title",
                },
                {
                  title: "Description",
                  field: "description",
                },
                {
                  title: "Reporter",
                  field: "reporter",
                },
                {
                  title: "Priority",
                  field: "ticketPriority",
                },
                {
                  title: "Assignee",
                  field: "assignee",
                },
                {
                  title: "Status",
                  field: "status",
                  lookup: {
                    OPEN: "OPEN",
                    IN_PROGRESS: "IN_PROGRESS",
                    BLOCKED: "BLOCKED",
                    CLOSED: "CLOSED",
                  },
                },
              ]}
              options={{
                exportMenu: [
                  {
                    label: "Export Pdf",
                    exportFunc: (cols, datas) =>
                      ExportPdf(cols, datas, "Ticket Records"),
                  },
                  {
                    label: "Export Csv",
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, datas, "Ticket Records"),
                  },
                ],
                headerStyle: {
                  backgroundColor: "darkblue",
                  color: "#fff",
                },
                rowStyle: {
                  backgroundColor: "#eee",
                },
              }}
              // data={[
              //   {
              //     name: "Utkarshini",
              //     status: "PENDING",
              //   },
              // ]}
              data={ticketDetails}
              title="USER RECORDS"
            />
          </div>
          <hr />
          <div className="container">
            <MaterialTable
              onRowClick={(e, rowData) => {
                console.log(rowData);
                setEditUser(rowData);
                getCurrUser(rowData.userId)
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));
                showUserModal();
              }}
              columns={[
                {
                  title: "Name",
                  field: "name",
                },
                {
                  title: "Email",
                  field: "email",
                },
                {
                  title: "UserId",
                  field: "userId",
                },
                {
                  title: "UserStatus",
                  field: "userStatus",
                },
                {
                  title: "UserTypes",
                  field: "userTypes",
                },
              ]}
              options={{
                exportMenu: [
                  {
                    label: "Export Pdf",
                    exportFunc: (cols, datas) =>
                      ExportPdf(cols, datas, "Ticket Records"),
                  },
                  {
                    label: "Export Csv",
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, datas, "Ticket Records"),
                  },
                ],
                headerStyle: {
                  backgroundColor: "darkblue",
                  color: "#fff",
                },
                rowStyle: {
                  backgroundColor: "#eee",
                },
              }}
              data={userDetails}
              title="USER RECORDS"
            />
          </div>
          <button className="btn btn-primary" onClick={showUserModal}>
            Open Modal
          </button>
          <Modal
            show={userModal}
            onHide={closeUserModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <form> */}
              <div className="p-1">
                {/* <h5 className="text-primary">User ID :</h5> */}
                <div className="input-group">
                  <label className="input-group-text">
                    Name{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={editUser.name}
                      onChange={updateUserData}
                    />{" "}
                  </label>
                  <label className="input-group-text">
                    Email{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      value={editUser.email}
                      onChange={updateUserData}
                    />{" "}
                  </label>
                  <label className="input-group-text">
                    UserStatus{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="userStatus"
                      value={editUser.userStatus}
                      onChange={updateUserData}
                    />{" "}
                  </label>
                  <label className="input-group-text">
                    UserTypes{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="userTypes"
                      value={editUser.userTypes}
                      onChange={updateUserData}
                    />{" "}
                  </label>
                </div>
                <button
                  className="btn btn-sm btn-primary "
                  onClick={submitModalFn}
                >
                  Submit
                </button>
              </div>
              {/* </form> */}
            </Modal.Body>
          </Modal>
          <Modal
            show={ticketModal}
            onHide={closeTicketModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <form> */}
              <div className="p-1">
                {/* <h5 className="text-primary">User ID :</h5> */}
                <div className="input-group">
                  <label className="input-group-text">
                    Description{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      value={rowObj.description}
                      onChange={updateTicketData}
                      ref={dref}
                    />{" "}
                  </label>
                  <label className="input-group-text">
                    Priority{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="ticketPriority"
                      value={rowObj.ticketPriority}
                      onChange={updateTicketData}
                      ref={pref}
                    />{" "}
                  </label>
                  <label className="input-group-text">
                    Status{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="status"
                      value={rowObj.status}
                      onChange={updateTicketData}
                      ref={sref}
                    />{" "}
                  </label>
                  <label className="input-group-text">
                    Assignee{" "}
                    <input
                      type="text"
                      className="form-control"
                      id="assignee"
                      value={rowObj.assignee}
                      onChange={updateTicketData}
                      ref={aref}
                    />{" "}
                  </label>
                </div>
                <button
                  className="btn btn-sm btn-primary "
                  onClick={submitModalTicketFn}
                >
                  Submit
                </button>
              </div>
              {/* </form> */}
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Admin;
