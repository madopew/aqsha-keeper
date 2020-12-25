import React from "react";
import NumberEasing from "../Number-Easing";
import "./Balance.css";

class Balance extends React.Component {
  render() {
    return (
      <div className="Balance">
        <h4>Total balance</h4>
        <h1>
          <NumberEasing
            precision={2}
            trail={true}
            value={parseFloat(this.props.total)}
            speed={700}
          />{" "}
          <span className="sign">BYR</span>
        </h1>
        <h4>Today left</h4>
        <h1>
          <NumberEasing
            precision={2}
            trail={true}
            value={parseFloat(this.props.left)}
            speed={700}
          />{" "}
          <span className="sign">BYR</span>
        </h1>
      </div>
    );
  }
}
export default Balance;
