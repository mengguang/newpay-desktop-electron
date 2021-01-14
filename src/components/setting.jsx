import React, { useState, useEffect } from 'react';

import Store from 'electron-store';

import { Button, TextField, Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CommonButton from './common_button';

import { ipcRenderer } from 'electron';

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
  const [walletPath, setWalletPath] = useState('');
  const store = new Store();

  useEffect(() => {
    if (store.has('rpcurl')) {
      setRpcurl(store.get('rpcurl'));
    }
    if (store.has('walletPath')) {
      setWalletPath(store.get('walletPath'));
    }
  }, []);

  const classes = useStyles();
  function handleRpcurlChange (e) {
    setRpcurl(e.target.value);
  }

  function handleWalletPathChange (e) {
    setWalletPath(e.target.value);
  }

  function handleChooseWalletPath (e) {
    e.preventDefault();
    console.log('choose wallet path');
    ipcRenderer
      .invoke('keystore:choose-wallet-path')
      .then(result => {
        if (result !== '') {
          setWalletPath(result);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function handleSave (e) {
    store.set('rpcurl', rpcurl);
    store.set('walletPath', walletPath);
  }

  return (
    <Container>
      <CommonButton />
      <Box display='flex' flexDirection='row' m={1} width='50ch' mt={10}>
        <TextField
          fullWidth
          name='rpcurl'
          id='rpcurl-input'
          label='RPC Url'
          type='text'
          value={rpcurl}
          onChange={handleRpcurlChange}
          spellCheck={false}
        />
      </Box>
      <Box display='flex' flexDirection='row' m={1}>
        <Box width='50ch'>
          <TextField
            fullWidth
            name='walletPath'
            id='walletPath-input'
            label='Wallet Path'
            type='text'
            value={walletPath}
            onChange={handleWalletPathChange}
            spellCheck={false}
          />
        </Box>
        <Box m={1}>
          <Button
            size='medium'
            variant='contained'
            color='primary'
            onClick={handleChooseWalletPath}
          >
            Choose
          </Button>
        </Box>
      </Box>
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
        </Box>
      </div>
    </Container>
  );
}
