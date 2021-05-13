import { ethers, Contract } from 'ethers';
import DefiBallot from './contracts/DefiBallot.json';

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const defiBallot = new Contract(
          DefiBallot.networks[window.ethereum.networkVersion].address,
          DefiBallot.abi,
          signer
        );

        resolve({signerAddress, defiBallot});
      }
      resolve({signerAddress: undefined, defiBallot: undefined});
    });
  });

export default getBlockchain;
