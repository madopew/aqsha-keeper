import React from "react";
import "./Transactions.css";

import { TransitionGroup } from 'react-transition-group';

class Transactions extends React.Component {
  render() {
    let operations = [];
    for(let i = this.props.transactions.operations.length - 1; i >= 0; i--) {
      let icon = "";
      switch (this.props.transactions.operations[i].type) {
        case "Update":
          icon = "loop";
          break;
        case "Deposit":
          icon = "add_circle";
          break;
        case "Withdraw":
          icon = "remove_circle";
          break;  
        default:
          break;    
      }

      let time = new Date(this.props.transactions.operations[i].time);
      let timeParsed = String(time.getHours()).padStart(2, "0") + ":" + String(time.getMinutes()).padStart(2, "0") + " " + time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();

      operations.push(
        <div className="container-transaction" key={i}>
          <div className="transaction-info">
            <i className="material-icons-outlined">{icon}</i>
            <div className="transaction-info-inner">
              <h1>{this.props.transactions.operations[i].type}</h1>
              <p>{timeParsed}</p>
            </div>
          </div>
          <h1>{this.props.transactions.operations[i].amount}</h1>
        </div>
      );
    }

    return (
      <div className="Transactions">
        <TransitionGroup>
          {operations}
        </TransitionGroup>
      </div>
    );
  }
}
export default Transactions;
