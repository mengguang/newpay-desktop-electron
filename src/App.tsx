import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from 'react-router-dom';

import { Button, Container } from '@material-ui/core';
//import icon from '../assets/icon.svg';

import KeystoreProcessor from './components/keystore_processor';
import KeystoreGenerator from './components/keystore_generator';

const Main = () => {
  let history = useHistory();
  return (
    <Container>
      <h1>NewPay Desktop</h1>
      <KeystoreProcessor />
      <br />
      <Button
        variant='contained'
        color='secondary'
        onClick={() => history.push('/keystore_generator')}
      >
        keystore generator
      </Button>
    </Container>
  );
};

export default function App () {
  return (
    <Router>
      <Switch>
        <Route path='/keystore_generator' component={KeystoreGenerator} />
        <Route path='/' component={Main} />
      </Switch>
    </Router>
  );
}
