import util from 'util';

import { ethers } from 'ethers';
import { promises } from 'fs';
import { remote } from 'electron';

const rpc_url = 'https://rpc2.newchain.cloud.diynova.com';
const provider = new ethers.providers.JsonRpcProvider(rpc_url);

function keystore_get_wallet_path () {
  const basePath = remote.app.getPath('documents');
  const walletPath = remote.path.join(basePath, 'wallet');
  return walletPath;
}

function pretty_balance (balance) {
  return ethers.utils.formatEther(balance);
}

async function keystore_transfer (
  keystore_file,
  toAddress,
  valueInNEW,
  password
) {
  const keystore = await promises.readFile(keystore_file, { encoding: 'utf8' });
  let wallet;
  try {
    wallet = await ethers.Wallet.fromEncryptedJson(keystore, password);
  } catch (err) {
    console.log(err);
    return 'Open keystore failed';
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
    to: toAddress,
    value: ethers.utils.parseEther(valueInNEW)
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
    return 'Transfer success';
  } else {
    return 'Transfer failed';
  }
}

export { keystore_transfer };
