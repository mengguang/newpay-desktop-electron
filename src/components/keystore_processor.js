import React, { useState } from 'react';
import util from 'util';

import { ethers } from 'ethers';
import fs from 'fs';

import { Button, TextField, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const readFile = util.promisify(fs.readFile);
const rpc_url = 'https://rpc2.newchain.cloud.diynova.com';
const provider = new ethers.providers.JsonRpcProvider(rpc_url);

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  }
}));

function KeystoreProcessor () {
  const [keystore, setKeystore] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();

  function pretty_balance (balance) {
    return ethers.utils.formatEther(balance);
  }

  async function process_keystore (keystore_file, password) {
    const keystore = await readFile(keystore_file, { encoding: 'utf8' });
    let wallet;
    try {
      wallet = await ethers.Wallet.fromEncryptedJson(keystore, password);
    } catch (err) {
      console.log(err);
      return;
    }
    console.log(`Wallet Address: ${wallet.address}`);
    const signer = wallet.connect(provider);

    const network = await provider.getNetwork();
    console.log(`Network: ${network.chainId}`);
    const gasPrice = await provider.getGasPrice();
    console.log(`Gas Price: ${gasPrice.toString()}`);
    const blockNumber = await provider.getBlockNumber();
    console.log(`blockNumber: ${blockNumber}`);
    const balance = await provider.getBalance(wallet.address);
    console.log(`Balance of NEW: ${pretty_balance(balance)}`);

    let tx = {
      to: '0x29e9356eC2082f447a7F747bF8D83c35E858fb86',
      value: ethers.utils.parseEther('1.0')
    };

    let response = await signer.sendTransaction(tx);
    console.log(response);
    console.log(`Transaction hash: ${response.hash}`);

    console.log('Waiting for transaction receipt...');
    const receipt = await provider.waitForTransaction(response.hash);
    if (receipt != null) {
      console.log(receipt);
      console.log('Got transaction receipt:');
      console.log(`Transaction blockNumber: ${receipt.blockNumber}`);
      console.log(`Transaction confirmations: ${receipt.confirmations}`);
      console.log(`Transaction status: ${receipt.status}`);
    }
  }

  let handleSubmit = async event => {
    event.preventDefault();
    await process_keystore(keystore, password);
  };

  let handleKeystoreChange = event => {
    setKeystore(event.target.files[0].path);
  };
  let handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <div>
        <h1>Keystore Processor</h1>
      </div>
      <div>
        <form className={classes.root} onSubmit={handleSubmit}>
          <div>
            <input
              style={{ display: 'none' }}
              id='raised-button-file'
              type='file'
              onChange={handleKeystoreChange}
            />
            <label htmlFor='raised-button-file'>
              <Button
                color='secondary'
                variant='contained'
                component='span'
                type='button'
              >
                Choose Keystore file
              </Button>
            </label>
          </div>

          <div>
            <TextField
              name='password'
              id='standard-password-input'
              label='Password'
              type='password'
              autoComplete='current-password'
              onChange={handlePasswordChange}
            />
          </div>
          <Button variant='contained' color='primary' type='submit'>
            OK
          </Button>
        </form>
      </div>
    </div>
  );
}

export default KeystoreProcessor;
