import React from "react";
import "./App.css";
import NumPad from "./components/NumPad/NumPad";
import Modal from "./components/Modal/Modal";
import Total from "./components/Balance/Balance";
import Transactions from "./components/Transactions/Transactions";
import uuid from "react-uuid";

let pressTimer;
let dontShow = false;

const submitTypes = {
  ADD: 0,
  OUT: 1,
};

class App extends React.Component {
  state = {
    totalBalance: localStorage.getItem("totalBalance")
      ? parseFloat(localStorage.getItem("totalBalance"))
      : 0,
    todayBalance: localStorage.getItem("todayBalance")
      ? parseFloat(localStorage.getItem("todayBalance"))
      : 0,
    dailyAmount: localStorage.getItem("dailyAmount")
      ? parseFloat(localStorage.getItem("dailyAmount"))
      : 0,
    lastUpdateDate: localStorage.getItem("lastUpdateDate")
      ? new Date(localStorage.getItem("lastUpdateDate"))
      : null,

    transactions: localStorage.getItem("transactions")
      ? JSON.parse(localStorage.getItem("transactions"))
      : null,

    /* -------- */

    submitType: submitTypes.ADD,

    numPadVisible: null,

    modalVisible: null,
    modalHeader: "Header",
    modalText:
      "This is some dummy text for modal window. If you see this probably something went wrong.",
    modalCancellable: true,
    modalHasSecond: true,
    modalFirstText: "Yes",
    modalSecondText: "No",
  };

  checkUpdateDate = () => {
    if (this.state.lastUpdateDate !== null) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let diff = today - this.state.lastUpdateDate;
      diff /= 1000 * 60 * 60 * 24;

      if (diff > 0) {
        let todayBalance =
          this.state.todayBalance + diff * this.state.dailyAmount;
        if (todayBalance > this.state.totalBalance) {
          todayBalance = this.state.totalBalance;
        }

        this.setState({ todayBalance, lastUpdateDate: today });
        localStorage.setItem("todayBalance", todayBalance);
        localStorage.setItem("lastUpdateDate", today);
        console.log("balance updated");
      } else {
        console.log("no update required");
      }
    }
  }

  setupFocusListener = () => {
    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState === "visible") {
        this.checkUpdateDate();
      }
    })
  }

  componentDidMount() {
    this.setupFocusListener();
    this.checkUpdateDate();
  }

  daysInMonth = () => {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  updateBalance = (amount) => {
    let totalBalance = parseFloat(amount);
    let dailyAmount = totalBalance / this.daysInMonth();
    let todayBalance = dailyAmount;

    let lastUpdateDate = new Date();
    lastUpdateDate.setHours(0, 0, 0, 0);

    this.addTransaction(amount, true);

    this.setState({ todayBalance, totalBalance, dailyAmount, lastUpdateDate });
    localStorage.setItem("todayBalance", todayBalance);
    localStorage.setItem("totalBalance", totalBalance);
    localStorage.setItem("dailyAmount", dailyAmount);
    localStorage.setItem("lastUpdateDate", lastUpdateDate);
  };

  withdrawBalance = (amount) => {
    let floatAmount = parseFloat(amount);
    let todayBalance = this.state.todayBalance - floatAmount;
    let totalBalance = this.state.totalBalance - floatAmount;
    let eps = 0.001;

    if (totalBalance < -eps) {
      this.setState({
        submitType: submitTypes.OUT,
        modalVisible: true,
        modalHeader: "You don't have enough money.",
        modalText: "",
        modalCancellable: false,
        modalHasSecond: false,
        modalFirstText: "Close",
        modalSecondText: "",
      });
      return;
    } 
    
    if (Math.abs(totalBalance) < eps) {
      totalBalance = 0; 
    }

    if (Math.abs(todayBalance) < eps) {
      todayBalance = 0;
    }

    this.setState({ todayBalance, totalBalance });
    localStorage.setItem("todayBalance", todayBalance);
    localStorage.setItem("totalBalance", totalBalance);

    this.addTransaction(floatAmount, false);
  };

  addTransaction = (amount, isUpdate) => {
    let transactions = this.state.transactions;
    if (!transactions) {
      transactions = {
        operations: [],
      };
    }

    if (transactions.operations.length + 1 > 10) {
      transactions.operations.splice(0, 1);
    }

    let key = uuid();
    let time = new Date();
    let prevState = 
    {
      totalBalance: this.state.totalBalance,
      todayBalance: this.state.todayBalance,
      dailyAmount: this.state.dailyAmount,
      lastUpdateDate: this.state.lastUpdateDate
    };

    if (isUpdate) {
      transactions.operations.push({
        key,
        type: "Update",
        amount,
        time,
        prevState
      });
    } else {
      if (amount > 0) {
        transactions.operations.push({
          key,
          type: "Withdraw",
          amount,
          time,
          prevState
        });
      } else {
        transactions.operations.push({
          key,
          type: "Deposit",
          amount: -amount,
          time,
          prevState
        });
      }
    }

    this.setState({ transactions });
    localStorage.setItem("transactions", JSON.stringify(transactions));
  };

  handleSubmit = (amount) => {
    this.setState({ numPadVisible: false });
    if (this.state.submitType === submitTypes.OUT) {
      this.withdrawBalance(amount);
    } else {
      this.setState({
        submitType: submitTypes.ADD,
        modalVisible: true,
        modalHeader: "Money added.",
        modalText: "Do you want to add extra income or update monthly balance?",
        modalCancellable: true,
        modalHasSecond: true,
        modalFirstText: "Add",
        modalSecondText: "Update",
        modalAmount: amount,
      });
    }
  };

  modalOnFirst = () => {
    this.setState({ modalVisible: false });
    switch (this.state.submitType) {
      case submitTypes.ADD:
        this.withdrawBalance(-this.state.modalAmount);
        break;
      default:
        break;
    }
  };

  modalOnSecond = () => {
    this.setState({ modalVisible: false });
    switch (this.state.submitType) {
      case submitTypes.ADD:
        this.updateBalance(this.state.modalAmount);
        break;
      default:
        console.log("error incorrect state modal no");
        break;
    }
  };

  modalOnCancel = () => {
    this.setState({ modalVisible: false });
  };

  closeNumPad = () => {
    this.setState({ numPadVisible: false });
  };

  longAddPress = () => {
    let amount = window.prompt();
    if (amount === null || amount === "") {
      dontShow = false;
      return;
    }

    localStorage.clear();
    let values = amount.split(" ");
    
    let totalBalance = parseFloat(values[0]);
    let todayBalance = parseFloat(values[1]);
    let dailyAmount = parseFloat(values[2]);

    let lastUpdateDate = new Date();
    lastUpdateDate.setHours(0, 0, 0, 0);

    localStorage.setItem("totalBalance", totalBalance);
    localStorage.setItem("todayBalance", todayBalance);
    localStorage.setItem("dailyAmount", dailyAmount);
    localStorage.setItem("lastUpdateDate", lastUpdateDate);
    window.location.reload();
  };

  cancelLastTransaction = () => {
    if (this.state.transactions) {
      let newTransactions = JSON.parse(JSON.stringify(this.state.transactions));
      newTransactions.operations.pop();
      this.setState({transactions: newTransactions});
    }
  };

  render() {
    return (
      <div className="App">
        <Modal
          visible={this.state.modalVisible}
          header={this.state.modalHeader}
          text={this.state.modalText}
          cancellable={this.state.modalCancellable}
          firstText={this.state.modalFirstText}
          secondText={this.state.modalSecondText}
          hasSecond={this.state.modalHasSecond}
          onFirst={this.modalOnFirst}
          onSecond={this.modalOnSecond}
          onCancel={this.modalOnCancel}
        />
        <NumPad
          visible={this.state.numPadVisible}
          close={this.closeNumPad}
          submit={this.handleSubmit}
        />
        <div className="container-app">
          <div className="container-upper">
            <div
              className="container-upper-bad"
              style={
                this.state.todayBalance < 0
                  ? { opacity: "100%" }
                  : { opacity: "0%" }
              }
            ></div>
            <div className="container-total">
              <Total
                total={this.state.totalBalance}
                left={this.state.todayBalance}
              />
            </div>
            <div className="container-buttons">
              <div
                className="div-button"
                onTouchStart={() => {
                  pressTimer = window.setTimeout(() => {
                    dontShow = true;
                  }, 5000);
                }}
                onTouchEnd={() => {
                  clearTimeout(pressTimer);
                  if (!dontShow) {
                    this.setState({
                      submitType: submitTypes.ADD,
                      numPadVisible: true,
                    });
                  } else {
                    this.longAddPress();
                  }
                }}
              >
                <i className="material-icons">add_circle</i>
                Add
              </div>
              <div className="divider"></div>
              <div
                className="div-button"
                onTouchStart={() => {
                  pressTimer = window.setTimeout(() => {
                    dontShow = true;
                  }, 5000);
                }}
                onTouchEnd={() => {
                  clearTimeout(pressTimer);
                  if (!dontShow) {
                    this.setState({
                      submitType: submitTypes.OUT,
                      numPadVisible: true,
                    });
                  } else {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                <i className="material-icons">remove_circle</i>
                Out
              </div>
            </div>
          </div>
          <div className="container-lower">
            <Transactions 
              transactions={this.state.transactions} 
              max={this.state.maxTransactions}
              cancel={this.cancelLastTransaction}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
