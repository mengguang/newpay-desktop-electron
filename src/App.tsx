import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';

import KeystoreProcessor from './components/keystore_processor'

const Hello = () => {
  return (
    <div>
      <h1>Hello from NewPay Desktop!</h1>
      <KeystoreProcessor />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
