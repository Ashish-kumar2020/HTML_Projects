import { Component } from "react";

class XCounter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  handleIncrement = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  handleDecrement = () => {
    this.setState((prevState) => ({
      count: prevState.count - 1,
    }));
  };

  render() {
    return (
      <div>
        <h1>Counter App</h1>

        <p>Count: {this.state.count}</p>

        <button type="button" onClick={this.handleIncrement}>
          Increment
        </button>

        <button type="button" onClick={this.handleDecrement}>
          Decrement
        </button>
      </div>
    );
  }
}

export default XCounter;