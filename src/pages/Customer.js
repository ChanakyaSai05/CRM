import React, { useEffect, useRef, useState } from "react";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal } from "react-bootstrap";
import "../styles/admin.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Sidebar from "../component/Sidebar";
import MaterialTable from "@material-table/core";
import { fetchTicket, ticketCreation, ticketUpdation } from "../api/tickets";
import { useNavigate } from "react-router-dom";
function Customer() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketModal, setTicketModal] = useState(false);
  const [raiseTicketModal, setRaiseTicketModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [tref, sref, pref, dref] = [useRef(), useRef(), useRef(), useRef()];
  const [raiseTicketData, setRaiseTicketData] = useState({
    title: "",
    description: "",
    ticketPriority: "",
    status: "",
  });
  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);
  const showTicketModal = () => {
    setTicketModal(true);
  };
  const closeTicketModal = () => {
    setTicketModal(false);
  };
  //Raise Ticket Modal
  const showRaiseTicketModal = () => {
    setRaiseTicketModal(true);
  };
  const closeRaiseTicketModal = () => {
    setRaiseTicketModal(false);
  };
  const history = useNavigate();

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
  }, []);
  //
  const fetchTickets = () => {
    fetchTicket()
      .then((res) => {
        if (res.status === 200) {
          setTicketDetails(res.data);
          updateTicketCounts(res.data);
        }
      })
      .catch((err) => {
        if (err.res.status === 401) {
          logoutFn();
        }
        console.log(err);
      });
  };
  //logout
  const logoutFn = () => {
    localStorage.clear();
    history("/");
  };
  const updateTicketCounts = (tickets) => {
    const data = {
      open: 0,
      pending: 0,
      blocked: 0,
      closed: 0,
    };
    tickets.forEach((x) => {
      if (x.status === "OPEN") data.open += 1;
      else if (x.status === "IN_PROGRESS") data.pending += 1;
      else if (x.status === "BLOCKED") data.blocked += 1;
      else data.closed += 1;
    });
    setTicketStatusCount(Object.assign({}, data));
  };
  const editTicket = (tickets) => {
    const ticket = {
      assignee: tickets.assignee,
      description: tickets.description,
      id: tickets.id,
      reporter: tickets.reporter,
      status: tickets.status,
      title: tickets.title,
      ticketPriority: tickets.ticketPriority,
    };
    setSelectedCurrTicket(ticket);
    showTicketModal();
  };
  //change ticketdetails
  const changeTicketDetails = (e) => {
    if (e.target.name === "title") selectedCurrTicket.title = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;
    else if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value;
    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };
  console.log(selectedCurrTicket);
  const submitModalTicketFn = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        console.log("Ticket Updated successfully");
        closeTicketModal();
        fetchTickets();
      })
      .catch(function (error) {
        if (error.response.status === 400) console.log(error.message);
        else if (error.response.status === 401) logoutFn();
        console.log(error.message);
      });
  };
  //
  //change Raise Ticket Details
  const changeRaiseTicketDetails = () => {
    let title = tref.current.value;
    let description = dref.current.value;
    let ticketPriority = pref.current.value;
    let status = sref.current.value;
    setRaiseTicketData({
      title,
      description,
      ticketPriority,
      status,
    });
  };
  console.log(raiseTicketData);
  //
  //submitRaiseTicketFn
  const submitRaiseTicketFn = (e) => {
    e.preventDefault();
    ticketCreation(raiseTicketData)
      .then((res) => {
        console.log("Ticket Created Successfully", res);
        fetchTickets();
        closeRaiseTicketModal();
      })
      .catch((err) => {
        if (err.response.status === 400) {
          console.log(err.message);
        } else if (err.response.status === 401) {
          logoutFn();
        } else {
          console.log(err);
        }
      });
  };
  return (
    <div className="bg-light min-vh-100">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="container col m-2">
          <h3 className="text-primary text-center">
            Welcome, {localStorage.getItem("name")}
          </h3>
          <p className="text-muted text-center">
            Take a quick look at your stats below
          </p>

          {/* STATS CARDS START HERE */}
          {/* <div className="row my-5 mx-5 text-center"> */}
          <div className="container d-flex mx-5">
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
                    <div className="col">{ticketStatusCount.open}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketStatusCount.open}
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
                    <div className="col">{ticketStatusCount.pending}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketStatusCount.pending}
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
                    <div className="col">{ticketStatusCount.closed}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketStatusCount.closed}
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
                    <div className="col">{ticketStatusCount.blocked}</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={ticketStatusCount.blocked}
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
            <MaterialTable
              onRowClick={(e, rowData) => editTicket(rowData)}
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
              data={ticketDetails}
              title="TICKET RECORDS"
            />
          </div>
          <hr />
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
                  <h5 className="text-primary">
                    Ticket ID: {selectedCurrTicket.id}
                  </h5>
                  <hr />
                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text label-md  d-flex justify-content-center"
                      style={{ minWidth: "7rem" }}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={selectedCurrTicket.title}
                      onChange={changeTicketDetails}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text label-md d-flex justify-content-center"
                      style={{ width: "7rem" }}
                    >
                      ASSIGNEE{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="assignee"
                      name="assignee"
                      onChange={changeTicketDetails}
                      value={selectedCurrTicket.assignee}
                      disabled
                    />{" "}
                  </div>
                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text label-md d-flex justify-content-center"
                      style={{ width: "7rem" }}
                    >
                      STATUS
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      onChange={changeTicketDetails}
                      value={selectedCurrTicket.status}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <label
                      className="label input-group-text label-md d-flex justify-content-center"
                      style={{ width: "7rem" }}
                    >
                      DESCRIPTION
                    </label>
                    <textarea
                      className="md-textarea form-control"
                      id="description"
                      name="description"
                      onChange={changeTicketDetails}
                      value={selectedCurrTicket.description}
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
          {/* Raise Ticket Modal */}
          <Modal
            show={raiseTicketModal}
            onHide={closeRaiseTicketModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title className="mx-1 text-primary">
                RAISE TICKET
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={submitRaiseTicketFn}>
                <div className="p-1">
                  {/* <h5 className="text-primary">RAISE TICKET</h5> */}
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md">
                      TITLE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="r-title"
                      onChange={changeRaiseTicketDetails}
                      value={raiseTicketData.title}
                      ref={tref}
                    />{" "}
                  </div>
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md">
                      PRIORITY
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="r-priority"
                      onChange={changeRaiseTicketDetails}
                      value={raiseTicketData.ticketPriority}
                      ref={pref}
                    />{" "}
                  </div>
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md ">
                      STATUS
                    </label>
                    <select
                      className="form-select"
                      id="t-status"
                      ref={sref}
                      onChange={changeRaiseTicketDetails}
                      value={raiseTicketData.status}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md">
                      DESCRIPTION
                    </label>
                    <textarea
                      className="md-textarea form-control"
                      id="r-description"
                      onChange={changeRaiseTicketDetails}
                      value={raiseTicketData.description}
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
          <div className="text-center ">
            <button
              className="btn btn-xl btn-primary px-4 "
              onClick={showRaiseTicketModal}
            >
              RAISE TICKET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
