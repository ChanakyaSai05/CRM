import React from "react";
import { Modal } from "react-bootstrap";

function TicketModal({
  ticketModal,
  closeTicketModal,
  submitModalTicketFn,
  rowObj,
  updateTicketData,
  pref,
  sref,
  aref,
  dref,
}) {
  return (
    <div>
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
                <label className="label input-group-text label-md">
                  PRIORITY{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ticketPriority"
                  value={rowObj.ticketPriority}
                  onChange={updateTicketData}
                  ref={pref}
                />{" "}
              </div>
              <div className="input-group mb-3">
                <label className="label input-group-text label-md ">
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
                <label className="label input-group-text label-md">
                  ASSIGNEE{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="assignee"
                  value={rowObj.assignee}
                  onChange={updateTicketData}
                  ref={aref}
                />{" "}
              </div>

              <div className="input-group mb-3">
                <label className="label input-group-text label-md">
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
  );
}

export default TicketModal;
