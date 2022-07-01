import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import MaterialTable from "@material-table/core";
import { Modal } from "react-bootstrap";
import { fetchTicket } from "../api/tickets";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import "../styles/admin.css";
import { ticketUpdation } from "../api/tickets";
import { useNavigate } from "react-router-dom";
function Engineer() {
  const [ticketModal, setTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const history = useNavigate();
  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  const showTicketModal = () => {
    setTicketModal(true);
  };
  const closeTicketModal = () => {
    setTicketModal(false);
  };
  useEffect(() => {
    (async () => {
      //calling the function asynchronously
      fetchTickets();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //fetchTickets
  const fetchTickets = () => {
    fetchTicket()
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
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
  //update tickets
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
  //edit tickets
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

  //update ticket
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then((res) => {
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

  return (
    <div className="bg-light min-vh-100">
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
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className="text-primary">
                    Ticket ID: {selectedCurrTicket.id}
                  </h5>
                  <hr />
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md d-flex justify-content-center">
                      PRIORITY{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ticketPriority"
                      name="priority"
                      onChange={changeTicketDetails}
                      value={selectedCurrTicket.ticketPriority}
                    />{" "}
                  </div>
                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md d-flex justify-content-center ">
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
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="BLOCKED">BLOCKED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <label className="label input-group-text label-md d-flex justify-content-center">
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
        </div>
      </div>
    </div>
  );
}

export default Engineer;
