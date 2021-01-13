import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router';
import { Router } from 'react-router-dom';
import { ipcRenderer } from 'electron';

import { Button, TextField, Container, Box } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import CommonButton from './common_button';

function KeystoreGenerator () {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const history = useHistory();

  function onSubmit (event) {
    event.preventDefault();
    if (password1 === password2 && password1.length >= 6) {
      console.log(password1);
      ipcRenderer.invoke('keystore:save', password1).then(message => {
        console.log(message);
      });
    }
  }

  function onPassword1Change (event) {
    setPassword1(event.target.value);
  }
  function onPassword2Change (event) {
    setPassword2(event.target.value);
  }

  return (
    <Container>
      <CommonButton />
      <form onSubmit={onSubmit}>
        <Box m={1} width='25ch'>
          <TextField
            fullWidth
            name='password1'
            id='standard-password-input'
            label='Password'
            type='password'
            autoComplete='current-password'
            onChange={onPassword1Change}
          />
        </Box>
        <Box m={1} width='25ch'>
          <TextField
            fullWidth
            name='password2'
            id='standard-password-input'
            label='Repeat Password'
            type='password'
            autoComplete='current-password'
            onChange={onPassword2Change}
          />
        </Box>
        <Box mx={1} my={2}>
          <Button variant='contained' color='primary' type='submit'>
            OK
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default KeystoreGenerator;
