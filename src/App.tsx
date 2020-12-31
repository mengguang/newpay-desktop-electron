import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from 'react-router-dom';
//import icon from '../assets/icon.svg';

import KeystoreProcessor from './components/keystore_processor';

import KeystoreGenerator from './components/keystore_generator';

const Hello = () => {
  let history = useHistory();
  return (
    <div>
      <h1>Hello from NewPay Desktop!</h1>
      <KeystoreProcessor />
      <button onClick={() => history.push('/keystore_generator')}>
        keystore generator
      </button>
    </div>
  );
};

export default function App () {
  return (
    <Router>
      <Switch>
        <Route path='/keystore_generator' component={KeystoreGenerator} />
        <Route path='/' component={Hello} />
      </Switch>
    </Router>
  );
}
