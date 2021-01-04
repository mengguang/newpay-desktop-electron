import React, { useState, useEffect } from 'react';

import Store from 'electron-store';

import { Button, TextField, Container } from '@material-ui/core';
import { Link, useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import CommonButton from './common_button';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50ch'
    }
  }
}));

export default function Setting () {
  const defaultRpcurl = 'https://rpc2.newchain.cloud.diynova.com';
  const [rpcurl, setRpcurl] = useState(defaultRpcurl);
  let history = useHistory();
  const store = new Store();

  useEffect(() => {
    if (store.has('rpcurl')) {
      setRpcurl(store.get('rpcurl'));
    }
  }, []);

  const classes = useStyles();
  function handleRpcurlChange (e) {
    setRpcurl(e.target.value);
  }

  function handleSave (e) {
    store.set('rpcurl', rpcurl);
  }

  return (
    <Container>
      <CommonButton />
      <div className={classes.root}>
        <TextField
          name='rpcurl'
          id='rpcurl-input'
          label='RPC Url'
          type='text'
          value={rpcurl}
          onChange={handleRpcurlChange}
          spellCheck={false}
        />
      </div>
      <div>
        <br />
        <Button variant='contained' color='secondary' onClick={handleSave}>
          Save
        </Button>
        <Button variant='contained' color='secondary' onClick={() => {}}>
          Cancel
        </Button>
      </div>
    </Container>
  );
}
