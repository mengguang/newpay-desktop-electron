import React from 'react';

import { Link } from 'react-router';
import { Router } from 'react-router-dom';

import { ipcRenderer } from 'electron';

class KeystoreGenerator extends React.Component {
  constructor (props) {
    super(props);
    this.state = { password1: '', password2: '' };
    ipcRenderer.on('keystore:save', (event, result) => {
      console.log(result);
    });
  }

  onSubmit = async event => {
    event.preventDefault();
    if (
      this.state.password1 === this.state.password2 &&
      this.state.password1.length >= 6
    ) {
      console.log(this.state.password1);
      ipcRenderer.send('keystore:save', this.state.password1);
    }
  };

  onPassword1Change = event => {
    this.setState({ password1: event.target.value });
  };
  onPassword2Change = event => {
    this.setState({ password2: event.target.value });
  };

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Password: </label>{' '}
            <input
              type='password'
              name='password1'
              onChange={this.onPassword1Change}
            />
          </div>
          <div>
            <label>Repeat Password: </label>{' '}
            <input
              type='password'
              name='password2'
              onChange={this.onPassword2Change}
            />
          </div>
          <div>
            <button type='submit'>OK</button>
          </div>
          <div>
            <button onClick={() => this.props.history.push('/')}>
              Back to Home
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default KeystoreGenerator;
