import React from "react";
import "./Modal.css";

class Modal extends React.Component {
  render() {
    return (
      <div
        className={
          this.props.visible === null
            ? "Modal hidden"
            : this.props.visible
            ? "Modal visible-modal"
            : "Modal hidden-animation-modal"
        }
      >
        <div
          className={
            this.props.visible === null
              ? "container-modal hidden"
              : this.props.visible
              ? "container-modal visible-modal-container"
              : "container-modal hidden-animation-modal-container"
          }
        >
          <h1>{this.props.header}</h1>
          <p>{this.props.text}</p>
          <div className="buttons-modal">
            <button
              onClick={() => {
                this.props.onYes();
              }}
            >
              {this.props.yesText}
            </button>
            <button
              className={this.props.noable ? "" : "hidden"}
              onClick={() => {
                this.props.onNo();
              }}
            >
              {this.props.noText}
            </button>
            <button
              className={this.props.cancellable ? "" : "hidden"}
              onClick={() => {
                this.props.onCancel();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;
