import React from "react";
import "./NumPad.css";

class NumPad extends React.Component {
  state = {
    amount: 0,
  };

  handleClick = (number) => {
    if (number === "back") {
      if (this.state.amount === 0) {
        this.props.close();
      } else {
        let amount = this.state.amount / 10;
        this.setState({ amount: amount | 0 });
      }
    } else if (number === "tick") {
      if (this.state.amount === 0) {
        this.props.close();
      } else {
        this.props.submit(this.state.amount / 100.0);
        this.setState({ amount: 0 });
      }
    } else {
      let amount = this.state.amount * 10 + parseInt(number);
      this.setState({ amount: amount | 0 });
    }
  };

  render() {
    return (
      <div
        className={
          this.props.visible === null
            ? "NumPad hidden"
            : this.props.visible
            ? "NumPad visible-numpad"
            : "NumPad hidden-animation-numpad"
        }
      >
        <div className="container-numpad">
          <div className="amount-numpad">
            <h1>
              {(this.state.amount / 100.0).toFixed(2)}{" "}
              <span className="sign-numpad">BYR</span>
            </h1>
          </div>
          <div className="numbers-numpad">
            <div className="row-numpad">
              <button
                value="1"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                1
              </button>
              <button
                value="2"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                2
              </button>
              <button
                value="3"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                3
              </button>
            </div>
            <div className="row-numpad">
              <button
                value="4"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                4
              </button>
              <button
                value="5"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                5
              </button>
              <button
                value="6"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                6
              </button>
            </div>
            <div className="row-numpad">
              <button
                value="7"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                7
              </button>
              <button
                value="8"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                8
              </button>
              <button
                value="9"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                9
              </button>
            </div>
            <div className="row-numpad">
              <button
                value="back"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                <i className="material-icons">keyboard_backspace</i>
              </button>
              <button
                value="0"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                0
              </button>
              <button
                value="tick"
                onClick={(e) => this.handleClick(e.target.value)}
              >
                <i className="material-icons">check</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NumPad;
