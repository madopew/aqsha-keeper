import React from "react";
import "./Transactions.css";

import { CSSTransition, TransitionGroup } from "react-transition-group";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class Transactions extends React.Component {
  render() {
    let operations = [];
    for (let i = this.props.transactions.operations.length - 1; i >= 0 ; i--) {
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
      let timeParsed =
        time.getDate() +
        " " +
        months[time.getMonth()] +
        ", " +
        String(time.getHours()).padStart(2, "0") +
        ":" +
        String(time.getMinutes()).padStart(2, "0");

      operations.push({
        key: this.props.transactions.operations[i].key,
        element: (
          <div className="container-transaction">
            <div className="transaction-info">
              <h3>{timeParsed}</h3>
            </div>
            <h1>{this.props.transactions.operations[i].amount}</h1>
          </div>
        ),
      });
    }

    return (
      <div className="Transactions">
        <TransitionGroup className="container-transactions">
          {operations.map((operation) => (
            <CSSTransition
              key={operation.key}
              timeout={200}
              classNames="transaction-item"
            >
              {operation.element}
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}
export default Transactions;
