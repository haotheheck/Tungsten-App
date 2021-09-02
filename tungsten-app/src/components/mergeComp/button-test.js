import { Component } from "react";
import '../../App.css';

class App extends Component {
  // create this.state with our two variables
  // this.state.up and this.state.down
  constructor(props) {
    super(props);
    this.state = { number: 1 };
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
  } // end constructor

  handleResetClick() {
    this.setState({ number: 0 });
    //console.log("Reset Clicked");
  }

  handleForwardClick() {
    let currNum = this.state.number;
    this.setState({ number: currNum % 2 === 0 ? currNum + 5 : currNum + 7 });
    ////console.log("Forward Clicked");
  }

  handleBackwardClick() {
    let currNum = this.state.number;
    this.setState({ number: currNum % 2 === 0 ? currNum - 1 : currNum - 2 });
  }

  render() {
    return (
      <div className="App">
        <h3>This is the parent-level component. </h3>
        The current value for <b>this.state.number </b>
        is: <br />
        <span className="highlight">{this.state.number}</span>
        <Forward buttonHandler={this.handleForwardClick} />
        <Reset buttonHandler={this.handleResetClick} />
        <Backward buttonHandler={this.handleBackwardClick} />
      </div>
    ); // end of return statement
  } // end of render function
} // end of class

//==================== Start a new component class

class Forward extends Component {
  render() {
    const buttonHandler = this.props.buttonHandler;
    return (
      <div className="ForwardComponent">
        <hr />
        <h4>This is the Forward component</h4>
        This is a child-level component <br />
        <button onClick={buttonHandler}> FORWARD </button>
      </div>
    ); // end of return statement
  } // end of render function
} // end of class

//=================== Start a new component class
class Reset extends Component {
  render() {
    const buttonHandler = this.props.buttonHandler;
    return (
      <div className="ResetComponent">
        <hr />
        <h4>This is the Reset component.</h4>
        This is a child-level component, <br />
        <button onClick={buttonHandler}> RESET </button>
      </div>
    ); // end of return statement
  } // end of render function
} // end of class

class Backward extends Component {
  render() {
    const buttonHandler = this.props.buttonHandler;
    return (
      <div className="BackwardComponent">
        <hr />
        <h4>This is the Backward component. Another child.</h4>
        Press the button
        <br />
        <button onClick={buttonHandler}> BACKWARD </button>
      </div>
    );
  }
}

export default App;
