import React from "react";
import "./Transactions.css";

class Transactions extends React.Component {
  render() {
    let operations = [];
    for(let i = this.props.transactions.operations.length - 1; i >= 0; i--) {
      operations.push(
        <div className="container-transaction" key={i}>
          <h1>{this.props.transactions.operations[i].type}</h1>
          <p>{this.props.transactions.operations[i].time}</p>
          <h2>{this.props.transactions.operations[i].amount}</h2>
        </div>
      );
    }

    return (
      <div className="Transactions">
        {operations}
      </div>
    );
  }
}
export default Transactions;
