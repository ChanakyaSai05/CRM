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
import { ticketUpdation } from "../api/tickets";
// import TicketModal from "../component/TicketModal";
function Admin() {
  const [userModal, setUserModal] = useState(false);
  const [ticketModal, setTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [editUser, setEditUser] = useState({});
  const [rowObj, setRowObj] = useState({});
  const [message, setMessage] = useState("");
  const dref = useRef();
  const pref = useRef();
  const sref = useRef();
  const aref = useRef();
  // const [dref, pref, sref, aref] = [useRef(), useRef(), useRef(), useRef()];
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
          let open = res.data.filter((item) => item.status === "OPEN");
          console.log(open);
          let progress = res.data.filter(
            (item) => item.status === "IN_PROGRESS"
          );
          let blocked = res.data.filter((item) => item.status === "BLOCKED");
          let closed = res.data.filter((item) => item.status === "CLOSED");

          setTicketDetails({
            data: res.data,
            open: open.length,
            progress: progress.length,
            blocked: blocked.length,
            closed: closed.length,
          });
          //or we can use forEach as did by mam we will do in engineer page
          //In that we will use object.assign(so that it will update data only the updated one it will prevent every time updation )
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
      .catch((err) => {
        if (err.response.status === 401) {
          logoutFn();
        } else {
          setMessage(err);
        }
      });
  };
  //updating userdata
  const updateUserData = (e) => {
    const name = document.getElementById("name").value;
    const userTypes = document.getElementById("userTypes").value;
    const userStatus = document.getElementById("userStatus").value;
    setEditUser({
      ...editUser,
      name,
      userTypes,
      userStatus,
    });
  };
  console.log(editUser);

  //Editing from modal
  const submitModalFn = (e) => {
    e.preventDefault();
    let userId = editUser.userId;
    let data = {
      userName: editUser.name,
      userStatus: editUser.userStatus,
      userType: editUser.userTypes,
    };
    userUpdation(userId, data)
      .then((res) => {
        console.log("User details updated successfully", res);
        // history(0);
        getUsers();
        closeUserModal();
      })
      .catch((err) => console.log(err));
    //checking the user is updated or not
    // getCurrUser(userId)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  };
  //
  // updateTicketData
  const updateTicketData = (e) => {
    //Not Working
    rowObj[e.target.id] = e.target.value;
    //ref method
    let description = dref.current.value;
    let ticketPriority = pref.current.value;
    let status = sref.current.value;
    let assignee = aref.current.value;
    setRowObj({ ...rowObj, description, ticketPriority, status, assignee });
  };
  // console.log(rowObj);
  //
  //submit Edit ticket function
  const submitModalTicketFn = (e) => {
    e.preventDefault();
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
        setMessage("Details Updated Successfully");
        // history(0);
        fetchTickets();
        closeTicketModal();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          logoutFn();
        } else {
          console.log(err);
        }
      });
  };
  //logout
  const logoutFn = () => {
    localStorage.clear();
    history("/");
  };
  return (
    <div className="bg-light min-vh-100">
      <div className="row">
        <div className="col-1">
          <Sidebar home />
        </div>
        <div className="container col m-2">
          <h3 className="text-primary text-center">
            Welcome {localStorage.getItem("name")}
          </h3>
          <p className="text-muted text-center">
            Take a quick look at your stats below
          </p>

          {/* STATS CARDS START HERE */}
          {/* <div className="row my-5 mx-5 text-center"> */}
          <div className="container d-flex mx-5">
            <div className="col my-1 p-2 mx-3 ">
              <div
                className="card bg-primary bg-opacity-25  "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-b p-2">
                  <h5 className="card-subtitle">
                    <i className="bi bi-pen text-primary mx-2"></i>
                    Open
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col">{ticketDetails.open}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketDetails.open}
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
                    <div className="col">{ticketDetails.progress}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketDetails.progress}
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
                    <div className="col">{ticketDetails.closed}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketDetails.closed}
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
                    <div className="col">{ticketDetails.blocked}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketDetails.blocked}
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
          <div className="container" id="target_ticket">
            <h5 className="text-center">{message}</h5>
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
                filtering: true, //this is for extra row for lookup filter
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
              data={ticketDetails.data}
              title="TICKET RECORDS"
            />
          </div>
          <hr />
          <div className="container" id="target_users">
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
                      ExportPdf(cols, datas, "User Records"),
                  },
                  {
                    label: "Export Csv",
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, datas, "User Records"),
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
              <form onSubmit={submitModalFn}>
                <div className="p-1">
                  <h5 className="text-primary">User ID :{editUser.userId}</h5>
                  <hr />
                  <div className="input-group mb-3">
                    <label
                      className="input-group-text d-flex justify-content-center"
                      style={{ width: 7 + "rem" }}
                    >
                      Name{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={editUser.name}
                      onChange={updateUserData}
                    />{" "}
                  </div>
                  <div className="input-group mb-3">
                    <label
                      className="input-group-text d-flex justify-content-center"
                      style={{ width: 7 + "rem" }}
                    >
                      UserStatus{" "}
                    </label>
                    <select
                      id="userStatus"
                      className="form-select"
                      value={editUser.userStatus}
                      onChange={updateUserData}
                    >
                      <option>APPROVED</option>
                      <option>PENDING</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <label
                      className="input-group-text d-flex justify-content-center "
                      style={{ width: 7 + "rem" }}
                    >
                      UserTypes{" "}
                    </label>
                    <select
                      className="form-select"
                      id="userTypes"
                      value={editUser.userTypes}
                      onChange={updateUserData}
                    >
                      <option>ADMIN</option>
                      <option>ENGINEER</option>
                      <option>CUSTOMER</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <button type="submit" className="btn btn-sm btn-primary ">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </Modal.Body>
          </Modal>
          {/* Ticket Modal*/}
          {/* <TicketModal
            ticketModal={ticketModal}
            closeTicketModal={closeTicketModal}
            submitModalTicketFn={submitModalTicketFn}
            rowObj={rowObj}
            updateTicketData={updateTicketData}
            pref={pref}
            sref={sref}
            aref={aref}
            dref={dref}
          /> */}
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
              <form onSubmit={submitModalTicketFn}>
                <div className="p-1">
                  <h5 className="text-primary">Ticket ID: {rowObj.id}</h5>
                  <hr />
                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text  label-md d-flex justify-content-center"
                      style={{ width: 7 + "rem" }}
                    >
                      PRIORITY
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ticketPriority"
                      value={rowObj.ticketPriority}
                      onChange={updateTicketData}
                      ref={pref}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text label-md d-flex justify-content-center"
                      style={{ width: 7 + "rem" }}
                    >
                      STATUS
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      ref={sref}
                      value={rowObj.status}
                      onChange={updateTicketData}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="BLOCKED">BLOCKED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text label-md d-flex justify-content-center"
                      style={{ width: 7 + "rem" }}
                    >
                      ASSIGNEE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="assignee"
                      value={rowObj.assignee}
                      onChange={updateTicketData}
                      ref={aref}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text label-md d-flex justify-content-center"
                      style={{ width: 7 + "rem" }}
                    >
                      DESCRIPTION
                    </label>
                    <textarea
                      className="md-textarea form-control"
                      id="description"
                      value={rowObj.description}
                      onChange={updateTicketData}
                      ref={dref}
                    ></textarea>
                  </div>

                  <div className="input-group mb-3 ">
                    <button type="submit" className="btn btn-md btn-primary ">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Admin;
