import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router';
import { Router } from 'react-router-dom';
import { ipcRenderer } from 'electron';

function KeystoreGenerator () {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const history = useHistory();
  useEffect(() => {
    console.log('useEffect');
    ipcRenderer.on('keystore:save', (event, result) => {
      console.log(result);
    });
  }, []);

  async function onSubmit (event) {
    event.preventDefault();
    if (password1 === password2 && password1.length >= 6) {
      console.log(password1);
      ipcRenderer.send('keystore:save', password1);
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
      <form onSubmit={onSubmit}>
        <div>
          <label>Password: </label>{' '}
          <input
            type='password'
            name='password1'
            onChange={onPassword1Change}
          />
        </div>
        <div>
          <label>Repeat Password: </label>{' '}
          <input
            type='password'
            name='password2'
            onChange={onPassword2Change}
          />
        </div>
        <div>
          <button type='submit'>OK</button>
        </div>
        <div>
          <button onClick={() => history.push('/')}>Back to Home</button>
        </div>
      </form>
    </div>
  );
}

export default KeystoreGenerator;
