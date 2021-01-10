import React, { useState, useEffect } from 'react';

import Store from 'electron-store';

import { Button, TextField, Container, Box } from '@material-ui/core';
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
        <Box display='flex' flexDirection='row'>
          <Box m={1}>
            <Button
              size='small'
              variant='contained'
              color='secondary'
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
          <Box m={1}>
            <Button
              variant='contained'
              size='small'
              color='secondary'
              onClick={() => {}}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </div>
    </Container>
  );
}
