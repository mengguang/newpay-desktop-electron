import React from 'react';
import {  HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Box,Container } from '@material-ui/core';
import KeystoreGenerator from './components/keystore_generator';
import KeystoreList from './components/keystore_list';
import Setting from './components/setting';

function App () {
  return (
    <Container>
      <Box mt={3} mb={3}>
        <Router>
          <Switch>
            <Route path='/keystore_generator' component={KeystoreGenerator} />
            <Route path='/keystore_list' component={KeystoreList} />
            <Route path='/setting' component={Setting} />
            <Route path='/' component={KeystoreList} />
          </Switch>
        </Router>
      </Box>
    </Container>
  );
}

export default App;
