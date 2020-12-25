import React from "react";
import "./App.css";
import NumPad from "./components/NumPad/NumPad";
import Modal from "./components/Modal/Modal";
import Total from "./components/Balance/Balance";

const dt = new Date();
let pressTimer;
let dontShow = false;
const modalStates = {
  ADD: 0,
  OUT: 1,
};

class App extends React.Component {
  state = {
    balance: localStorage.getItem("balance") || 0,
    dayBalance: localStorage.getItem("dayBalance") || 0,
    daily: localStorage.getItem("daily") || 0,
    previousDay: localStorage.getItem("previousDay"),
    actualBalance: localStorage.getItem("actualBalance") || 0,
    numPadVisible: null,
    typeSubmit: 0,

    modalState: modalStates.ADD,
    modalVisible: null,
    modalHeader: "Header",
    modalText:
      "This is some dummy text for modal window. If you see this probably something went wrong.",
    modalCancellable: true,
    modalNoable: true,
    modalYesText: "Yes",
    modalNoText: "No",

    amountDays: 5,
  };

  UNSAFE_componentWillMount() {
    if (localStorage.getItem("previousDay") === null) {
      this.setState({ previousDay: dt.getDay() });
      localStorage.setItem("previousDay", dt.getDay());
    }
  }

  componentDidMount() {
    let dayBalance = this.state.dayBalance;
    let balance = 0;
    if (dt.getDay() !== parseInt(this.state.previousDay)) {
      if (parseFloat(this.state.daily) <= parseFloat(this.state.balance)) {
        dayBalance =
          parseFloat(this.state.dayBalance) + parseFloat(this.state.daily);
        dayBalance = this.roundToTwo(dayBalance);
        localStorage.setItem("dayBalance", dayBalance);

        balance = parseFloat(this.state.balance) - parseFloat(this.state.daily);
        balance = this.roundToTwo(balance);
        localStorage.setItem("balance", balance);
      } else {
        dayBalance =
          parseFloat(this.state.dayBalance) + parseFloat(this.state.balance);
        dayBalance = this.roundToTwo(dayBalance);
        localStorage.setItem("dayBalance", dayBalance);
        localStorage.setItem("balance", 0);
      }

      localStorage.setItem("previousDay", dt.getDay());
      this.setState({ dayBalance, balance, previousDay: dt.getDay() });
    }
  }

  roundToTwo = (num) => {
    return Math.round((num * Math.pow(10, 2)) / Math.pow(10, 2));
  };

  closeNumPad = () => {
    this.setState({ numPadVisible: false });
  };

  daysInMonth = () => {
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
  };

  addMoney = (amount) => {
    let previous = parseFloat(this.state.dayBalance);
    let balance =
      parseFloat(amount) + parseFloat(this.state.balance) + previous;
    let daily = balance / this.daysInMonth();
    balance -= daily;
    let dayBalance = daily;
    let actualBalance = balance + dayBalance;
    dayBalance = this.roundToTwo(dayBalance);
    balance = this.roundToTwo(balance);
    daily = this.roundToTwo(daily);
    actualBalance = this.roundToTwo(actualBalance);
    this.setState({ balance, daily, dayBalance, actualBalance });
    localStorage.setItem("balance", balance);
    localStorage.setItem("dayBalance", dayBalance);
    localStorage.setItem("daily", daily);
    localStorage.setItem("actualBalance", actualBalance);

  };

  withdrawMoney = (amount) => {
    let previous = parseFloat(this.state.dayBalance);
    let dayBalance = previous - parseFloat(amount);
    let actualBalance = parseFloat(this.state.balance) + dayBalance;
    if (actualBalance < 0) {
      this.setState({
        modalState: modalStates.OUT,
        modalVisible: true,
        modalHeader: "You don't have enough money.",
        modalText: "",
        modalCancellable: false,
        modalNoable: false,
        modalYesText: "Close",
        modalNoText: "",
      });
      return;
    }
    /* if (previous >= 0 && dayBalance < 0)
      this.bg.classList = "bg good invisible";
    else if (previous < 0 && dayBalance >= 0)
      this.bg.classList = "bg good visible";*/
    actualBalance = this.roundToTwo(actualBalance);
    dayBalance = this.roundToTwo(dayBalance);
    this.setState({ dayBalance, actualBalance });
    localStorage.setItem("dayBalance", dayBalance);
    localStorage.setItem("actualBalance", actualBalance);
  };

  handleSubmit = (type, amount) => {
    this.setState({ numPadVisible: false });
    if (type === 1) {
      this.withdrawMoney(amount);
    } else {
      this.setState({
        modalState: modalStates.ADD,
        modalVisible: true,
        modalHeader: "Money added.",
        modalText: "Do you want to add extra income or update monthly balance?",
        modalCancellable: true,
        modalNoable: true,
        modalYesText: "Add",
        modalNoText: "Update",
        modalAmount: amount,
      });
    }
  };

  modalOnYes = () => {
    this.setState({ modalVisible: false });
    switch (this.state.modalState) {
      case modalStates.ADD:
        this.withdrawMoney(-this.state.modalAmount);
        break;
      default:
        break;
    }
  };

  modalOnNo = () => {
    this.setState({ modalVisible: false });
    switch (this.state.modalState) {
      case modalStates.ADD:
        this.addMoney(this.state.modalAmount);
        break;
      default:
        console.log("error incorrect state modal no");
        break;
    }
  };

  modalOnCancel = () => {
    this.setState({ modalVisible: false });
  };

  longAddPress = () => {
    let amount = window.prompt();
    if (amount === null || amount === "") {
      dontShow = false;
      return;
    }
    localStorage.clear();
    let values = amount.split(" ");
    let actualBalance = parseFloat(values[0]);
    let dayBalance = parseFloat(values[1]);
    let daily = parseFloat(values[2]);
    let balance = actualBalance - dayBalance;
    localStorage.setItem("balance", balance);
    localStorage.setItem("dayBalance", dayBalance);
    localStorage.setItem("daily", daily);
    localStorage.setItem("actualBalance", actualBalance);
    window.location.reload();
  };

  render() {
    return (
      <div className="App">
        <Modal
          visible={this.state.modalVisible}
          header={this.state.modalHeader}
          text={this.state.modalText}
          noable={this.state.modalNoable}
          cancellable={this.state.modalCancellable}
          yesText={this.state.modalYesText}
          noText={this.state.modalNoText}
          onYes={this.modalOnYes}
          onNo={this.modalOnNo}
          onCancel={this.modalOnCancel}
        />
        <NumPad
          visible={this.state.numPadVisible}
          close={this.closeNumPad}
          type={this.state.typeSubmit}
          submit={this.handleSubmit}
        />
        <div className="container-app">
          <div className="container-upper">
            <div className="container-upper-bad" style={this.state.dayBalance < 0 ? {"opacity":"100%"} : {"opacity":"0%"}}>

            </div>
            <div className="container-total">
              <Total 
                total={this.state.actualBalance} 
                left={this.state.dayBalance}/>
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
                    this.setState({ typeSubmit: 0, numPadVisible: true });
                  } else {
                    this.longAddPress();
                  }
                }}
              >
                <i className="material-icons">add_circle</i>
                Add
              </div>
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
                    this.setState({ typeSubmit: 1, numPadVisible: true });
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
           
          </div>
        </div>
      </div>
    );
  }
}

export default App;

/*
    let data = [[], []];
    for (let i = 0; i < this.state.amountDays; i++) {
      data[0].push(days[(dt.getDay() + i) % 7]);
      let toAdd = this.roundToTwo(
        parseFloat(this.state.dayBalance) + parseFloat(this.state.daily) * i
      );
      toAdd =
        toAdd <= this.state.actualBalance ? toAdd : this.state.actualBalance;
      data[1].push(toAdd);
    }
*/

/*
<div className="container-balance">
            <Total
              value={this.state.actualBalance}
              />
          </div>
          <div className="container-left bad">
            <div ref={object => (this.bg = object)} className="bg good"></div>
            <h4>Today left</h4>
            <h1>
              <NumberEasing
                precision={2}
                trail={true}
                value={parseFloat(this.state.dayBalance)}
                speed={700}
              />{" "}
              <span className="sign">BYR</span>
            </h1>
            <div className="container-buttons">
              <div
                className="divButton"
                id="first"
                onTouchStart={() => {
                  pressTimer = window.setTimeout(() => {
                    dontShow = true;
                  }, 5000);
                }}
                onTouchEnd={() => {
                  clearTimeout(pressTimer);
                  if (!dontShow)
                    this.setState({ typeSubmit: 0, numPadVisible: true });
                  else {
                    let amount = window.prompt();
                    if (amount === null || amount === "") {
                      dontShow = false;
                      return;
                    }
                    localStorage.clear();
                    let moneyDigits = this.state.moneyDigits;
                    let moneySign = this.state.moneySign;
                    let values = amount.split(" ");
                    let actualBalance = parseFloat(values[0]);
                    let dayBalance = parseFloat(values[1]);
                    let daily = parseFloat(values[2]);
                    let balance = actualBalance - dayBalance;
                    localStorage.setItem("balance", balance);
                    localStorage.setItem("dayBalance", dayBalance);
                    localStorage.setItem("daily", daily);
                    localStorage.setItem("actualBalance", actualBalance);
                    localStorage.setItem("moneyDigits", moneyDigits);
                    localStorage.setItem("moneySign", moneySign);

                    window.location.reload();
                  }
                }}
              >
                Add
              </div>
              <div
                className="divButton"
                id="second"
                onTouchStart={() => {
                  pressTimer = window.setTimeout(() => {
                    dontShow = true;
                  }, 5000);
                }}
                onTouchEnd={() => {
                  clearTimeout(pressTimer);
                  if (!dontShow)
                    this.setState({ typeSubmit: 1, numPadVisible: true });
                  else {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Out
              </div>
            </div>
          </div>
          <div id="containerChart" className="container-chart">
            <div className="container-chart-chart">
              <ColumnChart
                height={this.state.chartHeight}
                moneyDigits={2}
                time={700}
                data={data}
              />
            </div>
          </div>
*/
