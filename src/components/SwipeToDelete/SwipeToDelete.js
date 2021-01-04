import React from "react";
import "./SwipeToDelete.css";

class SwipeToDelete extends React.Component {
  state = {
    startX: 0,
    threshold: 0,
  };

  render() {
    return (
      <div className="SwipeToDelete" style={this.props.style}>
        <div
          className="swipe-to-delete-content"
          onTouchStart={(e) => {
            this.setState({
              startX: e.touches[0].clientX,
              threshold: e.currentTarget.clientWidth * -0.6,
            });
            e.currentTarget.style.transition = "";
          }}
          onTouchMove={(e) => {
            let x = e.touches[0].clientX;
            let diff = x - this.state.startX;

            if (diff < 0) {
              e.currentTarget.style.transform = "translateX(" + diff + "px)";
            } else {
              e.currentTarget.style.transform = "translateX(0)";
            }
          }}
          onTouchEnd={(e) => {
            let x = e.changedTouches[0].clientX;
            let diff = x - this.state.startX;
            e.currentTarget.style.transition = "transform 0.1s ease-in-out";
            if (diff < this.state.threshold) {
              e.currentTarget.style.transform = "translateX(-100%)";
              this.props.handleDelete();
            } else {
              e.currentTarget.style.transform = "translateX(0)";
            }
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default SwipeToDelete;
