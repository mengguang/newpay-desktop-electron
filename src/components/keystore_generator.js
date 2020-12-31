import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router';
import { Router } from 'react-router-dom';
import { ipcRenderer } from 'electron';

import { Button, TextField } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function KeystoreGenerator () {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const history = useHistory();
  const classes = useStyles();
  
  // useEffect(() => {
  //   ipcRenderer.removeAllListeners('keystore:save')
  //   ipcRenderer.on('keystore:save', (event, result) => {
  //     console.log(result);
  //   });
  // }, []);

  function onSubmit (event) {
    event.preventDefault();
    if (password1 === password2 && password1.length >= 6) {
      console.log(password1);
      ipcRenderer.invoke('keystore:save', password1).then( message => {
        console.log(message)
      })
    }
  }

  function onPassword1Change (event) {
    setPassword1(event.target.value);
  }
  function onPassword2Change (event) {
    setPassword2(event.target.value);
  }

  return (
    <div>
      <form className={classes.root} onSubmit={onSubmit}>
        <div>
        <TextField
          name="password1"
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={onPassword1Change}
        />
        </div>
        <div>
        <TextField
          name="password2"
          id="standard-password-input"
          label="Repeat Password"
          type="password"
          autoComplete="current-password"
          onChange={onPassword2Change}
        />
        </div>
        <div>
          <Button variant="contained" color="primary" type='submit'>OK</Button>
        </div>
        <div>
          <br />
          <Button variant="contained" color="secondary" onClick={() => history.push('/')}>Back to Home</Button>
        </div>
      </form>
    </div>
  );
}

export default KeystoreGenerator;
