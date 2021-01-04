import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { Container } from '@material-ui/core';
//import icon from '../assets/icon.svg';

import KeystoreProcessor from './components/keystore_processor';
import KeystoreGenerator from './components/keystore_generator';
import KeystoreList from './components/keystore_list';
import Setting from './components/setting';

import CommonButton from './components/common_button';

const Main = () => {
  return (
    <div>
      <CommonButton />
    </div>
  );
};

function App () {
  return (
    <Container>
      <h1>NewPay Desktop</h1>
      <Router>
        <Switch>
          <Route path='/keystore_generator' component={KeystoreGenerator} />
          <Route path='/keystore_list' component={KeystoreList} />
          <Route path='/keystore_processor' component={KeystoreProcessor} />
          <Route path='/setting' component={Setting} />
          <Route path='/' component={Main} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
