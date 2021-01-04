import React from "react";
import "./Transactions.css";
import SwipeToDelete from  "../SwipeToDelete/SwipeToDelete"

import { CSSTransition, TransitionGroup } from "react-transition-group";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

class Transactions extends React.Component {
  onDelete = () => {
    this.props.cancel();
  }

  render() {
    let operations = [];
    if(this.props.transactions) {
      for (let i = this.props.transactions.operations.length - 1; i >= 0; i--) {
        let time = new Date(this.props.transactions.operations[i].time);
        let timeParsed =
          time.getDate() +
          " " +
          months[time.getMonth()] +
          ", " +
          String(time.getHours()).padStart(2, "0") +
          ":" +
          String(time.getMinutes()).padStart(2, "0");

        let typeSign = "";
        let typeClass;
        switch (this.props.transactions.operations[i].type) {
          case "Deposit":
            typeSign = "+";
            typeClass = "transaction-deposit";
            break;
          case "Withdraw":
            typeSign = "-";
            typeClass = "transaction-withdraw";
            break;
          default:
            break;
        }

        operations.push({
          key: this.props.transactions.operations[i].key,
          element: (
            <SwipeToDelete
              style={{
                width: "90vw",
                height: "7vh",
                marginBottom: "1rem",
              }}
              handleDelete={this.onDelete}
            >
              <div className="container-transaction">
                <div className="transaction-info">
                  <h3>{timeParsed}</h3>
                </div>
                <h1 className={typeClass}>{typeSign}{this.props.transactions.operations[i].amount}</h1>
              </div>
            </SwipeToDelete>
          ),
        });
      }
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
        <div className={this.props.transactions ? "hidden" : "container-notrans"}>
          <h3>There are no recent transactions.</h3>
          <i className="material-icons-outlined">monetization_on</i>
        </div>
      </div>
    );
  }
}
export default Transactions;
