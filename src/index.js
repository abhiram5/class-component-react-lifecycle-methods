import React, { Component, Fragment, useState } from "react";
import { render } from "react-dom";
import "./styles.css";

/*
more resource : 
 https://medium.com/@vishal.jindal9715/lets-dive-into-the-react-js-487bbe366206
 http://skilllx.com/core-concepts-of-reactjs/?fbclid=IwAR3yjKevSKAExl2USBA1A0LG7tCDI2ttDU8o0bA8rLldlQajQPiXRudSW5o
*/

/*
React component is a function or a class which optionally accepts input and returns a React element 
React element is an object representation of some UI.
*/

/*
******************** Mounting *********************
These methods are called in the following order when an instance of a component is being created and inserted into the DOM:
1- constructor()
2- static getDerivedStateFromProps()
3- render()
4- componentDidMount()

******************** Updating *********************
These methods are called in the following order when a component is being re-rendered because changes happened to props or state:
1- static getDerivedStateFromProps()
2- shouldComponentUpdate()
3- render()
4- getSnapshotBeforeUpdate()
5- componentDidUpdate()

******************** Unmounting *******************
This method is called when a component is being removed from the DOM:
componentWillUnmount()

****************** Error Handling *****************
These methods are called when there is an error during rendering, in a lifecycle method, or in the constructor of any child component
1- static getDerivedStateFromError()
2- componentDidCatch()

*/

// first component
class Example extends Component {
  constructor(props) {
    // used for initializing state, binding event handlers
    // calling super(props) method to get the base constructor of the extended class
    console.log(`constructor`);
    super(props);
    this.state = {
      count: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    // should be first method
    // replaced UNSAFE_componentWillMount, UNSAFE_componentWillUpdate and UNSAFE_componentWillReceiveProps methods
    // since its static method, so it does NOT have access to (this) keyword, you can call function outside to use it
    // used when the state depend on changes in props over time, also used to adding a copy of props value to the state
    // return null (to update nothing) or state object {} value (to update the state)
    console.log(`get Derived State From Props`);
    return null;
  }

  //  // presence of getDerivedStateFromProps or getSnapshotBeforeUpdate methods prevents the 3 methods below from being invoked
  // UNSAFE_componentWillMount() {
  //   // triggered only once before rendering the component at the first time
  //   // replaced componentWillMount in React 16+
  //   console.log(`component Will Mount`);
  // }

  // UNSAFE_componentWillUpdate(nextProps, nextState) {
  //   // triggered each time state change
  //   // changing data according the new state value
  //   // replaced componentWillUpdate in React 16+
  //   console.log(`component Will Update`);
  // }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   // triggered only if there is a new props value for the component it self
  //   // replaced componentWillReceiveProps in React 16+
  //   console.log(`component Will Receive Props`);
  //   // if(nextProps.whatever && nextProps.whatever !== this.props.whatever){
  //   //    do something here
  //   // }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // triggered each time state change
    // used if we want to change the state without render the JSX, but best to use PureComponent insted of using this method
    // used for preformance optimaization
    // return false(don't-render) or true(render)
    console.log(`should Component Update`);
    // if(nextProps.whatever && nextProps.whatever !== this.props.whatever){
    //    do something here
    //    return false;
    // }
    return true;
  }

  componentDidMount() {
    // triggered only once after rendering the component and its children at the first time
    // helps to start API calls, adding event listeners
    console.log(`component Did Mount`);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // return null or value where will passed as thired parameter (snapshot) to the componentDidUpdate
    // used to capture some information from the DOM or to create backup of the current component
    console.log(`get Snapshot Before Update`);
    return 5;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // triggered each time state change after component re-rendered (updated)
    console.log(`component Did Update`);
  }

  /************************************** Unmounting **************************************/
  componentWillUnmount() {
    // triggered before component destroyed or removed from DOM
    // helps to remove event handlers or cleaning up
    console.log(`component Will Unmount`);
  }

  /************************************ Error Handling ************************************/
  static getDerivedStateFromError(error) {
    // triggered when error accure during rendering, lifecycle methods or constructor of any child component
    // used to render a fallback UI for the error
    // by having a value like (this.state.hasError) which gets flipped to (true) at this point
    // return null (no error) or state object { hasError: true }
    console.log(`get Derived State From Error`);
    return null;
  }

  componentDidCatch(error, info) {
    // triggered when an error occurs in a child component
    // used to log the error information
    console.log(`component Did Catch`);
  }

  /*********************************** component methods ***********************************/
  set() {
    let count = this.state.count + 1;
    this.setState({ count });
    // setState is asynchronous function takes in callback function
    // this.setState(
    //   () => {
    //     return { count }
    //   },
    //   () => {
    //     console.log('setState has finished and the component has re-rendered (updated)');
    //   }
    // );
  }

  render() {
    // the only required method in React-lifecycke-methods, also read component state and props
    // return JSX
    console.log(`render`);
    return (
      <Fragment>
        <p>{this.props.name}</p>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.set.bind(this)}>Click me</button>
      </Fragment>
    );
  }
}

// second component
class ErrorButton extends Component {
  state = { hasError: false };

  handleClick = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) throw new Error("Something went wrong.");

    return <button onClick={this.handleClick}>Trigger Error</button>;
  }
}

// third component
class ErrorBoundary extends Component {
  state = { errorMessage: null };

  static getDerivedStateFromError(error) {
    return { errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    console.log(`error => `, error);
    console.log(`info => `, info);
    console.log(`this.state.errorMessage => `, this.state.errorMessage);
  }

  render() {
    if (this.state.errorMessage) {
      return <h1>Oops! {this.state.errorMessage}</h1>;
    }

    return this.props.children;
  }
}

// forth component
const Main = () => {
  const [mount, setMount] = useState(true);

  let toggleComponent = () => {
    setMount(!mount);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <button onClick={toggleComponent}>Mount / unMount</button>
        {mount && <Example />}
        <br />
        <ErrorButton />
      </div>
    </ErrorBoundary>
  );
};

render(<Main />, document.getElementById("root"));
