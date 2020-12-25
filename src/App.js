import React from "react";
import "./App.css";
import NumPad from "./components/NumPad/NumPad";
import Modal from "./components/Modal/Modal";
import Total from "./components/Balance/Balance";

let pressTimer;
let dontShow = false;

const submitTypes = {
  ADD: 0,
  OUT: 1,
};

class App extends React.Component {
  state = {
    totalBalance: localStorage.getItem("totalBalance") ? parseFloat(localStorage.getItem("totalBalance")) : 0,
    todayBalance: localStorage.getItem("todayBalance") ? parseFloat(localStorage.getItem("todayBalance")) : 0,
    dailyAmount: localStorage.getItem("dailyAmount") ? parseFloat(localStorage.getItem("dailyAmount")) : 0,
    lastUpdateDate: localStorage.getItem("lastUpdateDate") ? new Date(localStorage.getItem("lastUpdateDate")) : null,

    submitType: submitTypes.ADD,

    numPadVisible: null,

    modalVisible: null,
    modalHeader: "Header",
    modalText: "This is some dummy text for modal window. If you see this probably something went wrong.",
    modalCancellable: true,
    modalHasSecond: true,
    modalFirstText: "Yes",
    modalSecondText: "No",
  };

  componentDidMount() {
    if (this.state.lastUpdateDate !== null) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let diff = today - this.state.lastUpdateDate;
      diff /= 1000 * 60 * 60 * 24;
      
      if (diff > 0) {
        let todayBalance = this.state.todayBalance + diff * this.state.dailyAmount;
        if (todayBalance > this.state.totalBalance) {
          todayBalance = this.state.totalBalance;
        }

        this.setState({todayBalance, lastUpdateDate: today});
        localStorage.setItem("todayBalance", todayBalance);
        localStorage.setItem("lastUpdateDate", today);
      }
    }
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

    this.setState({todayBalance, totalBalance, dailyAmount, lastUpdateDate});
    localStorage.setItem("todayBalance", todayBalance);
    localStorage.setItem("totalBalance", totalBalance);
    localStorage.setItem("dailyAmount", dailyAmount);
    localStorage.setItem("lastUpdateDate", lastUpdateDate);
  };

  withdrawBalance = (amount) => {
    let floatAmount = parseFloat(amount);
    let todayBalance = this.state.todayBalance - floatAmount;
    let totalBalance = this.state.totalBalance - floatAmount;

    if (totalBalance < 0) {
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
    
    this.setState({todayBalance, totalBalance});
    localStorage.setItem("todayBalance", todayBalance);
    localStorage.setItem("totalBalance", totalBalance);
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

    localStorage.setItem("totalBalance", totalBalance);
    localStorage.setItem("todayBalance", todayBalance);
    localStorage.setItem("dailyAmount", dailyAmount);
    window.location.reload();
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
            <div className="container-upper-bad" style={this.state.todayBalance < 0 ? {"opacity":"100%"} : {"opacity":"0%"}}>

            </div>
            <div className="container-total">
              <Total 
                total={this.state.totalBalance} 
                left={this.state.todayBalance}/>
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
                    this.setState({ submitType: submitTypes.ADD, numPadVisible: true });
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
                    this.setState({ submitType: submitTypes.OUT, numPadVisible: true });
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
