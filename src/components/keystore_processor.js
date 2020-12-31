import React from 'react';
import util from 'util';

import { ethers } from 'ethers';
import fs from 'fs';

const readFile = util.promisify(fs.readFile);
const rpc_url = 'https://rpc2.newchain.cloud.diynova.com';
const provider = new ethers.providers.JsonRpcProvider(rpc_url);

class KeystoreProcessor extends React.Component {
  constructor (props) {
    super(props);
    this.state = { keystore: '', password: '' };
  }

  pretty_balance (balance) {
    return ethers.utils.formatEther(balance);
  }

  async process_keystore (keystore_file, password) {
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
    console.log(`Balance of NEW: ${this.pretty_balance(balance)}`);

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

  handleSubmit = async event => {
    event.preventDefault();
    console.log('handleSubmit');
    console.log(this.state.password);
    console.log(this.state.keystore);
    await this.process_keystore(this.state.keystore, this.state.password);
  };

  handleKeystoreChange = event => {
    this.setState({ keystore: event.target.files[0].path });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  render () {
    return (
      <div>
        <div>
          <h1>Keystore Processor</h1>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <lable>keystore: </lable>
              <input type='file' onChange={this.handleKeystoreChange} />
            </div>
            <div>
              <label>password: </label>
              <input type='password' onChange={this.handlePasswordChange} />
            </div>
            <button type='submit'>ok</button>
          </form>
        </div>
      </div>
    );
  }
}

export default KeystoreProcessor;
