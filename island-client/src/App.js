import './App.css';
import {ISLAND_ABI, ISLAND_ADDRESS} from './config';
import island1 from './img/1.png';
import island2 from './img/2.png';
import island3 from './img/3.png';
import island4 from './img/4.png';
import island5 from './img/5.png';

import Web3 from 'web3';
import {useEffect, useState} from 'react';

const images = [
  {src: island1, description: 'Island 1', key: 1},
  {src: island2, description: 'Island 2', key: 2},
  {src: island3, description: 'Island 3', key: 3},
  {src: island4, description: 'Island 4', key: 4},
  {src: island5, description: 'Island 5', key: 5},
];

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [island, setIsland] = useState(0);
  const [islands, setIslands] = useState([]);

  // shows how many islands the caller account has
  const fetchIslands = () => {
    contract.methods
      .getCallerIslands()
      .call({from: account})
      .then(num => {
        setIslands(num);
        console.log('number of islands: ', num);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    web3.eth.requestAccounts().then(accounts => setAccount(accounts[0]));
    const islandContract = new web3.eth.Contract(ISLAND_ABI, ISLAND_ADDRESS);
    setContract(islandContract);
  }, []);

  useEffect(() => {
    if (contract) {
      fetchIslands();
    }
  }, [account]);

  useEffect(() => {
    function detectAccountChange() {
      window.ethereum.on('accountsChanged', function (accounts) {
        const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
        web3.eth.requestAccounts().then(accounts => setAccount(accounts[0]));
      });
    }
    detectAccountChange();
  });

  // get a new island
  function getNewIsland() {
    contract.methods
      .getIsland()
      .send({from: account})
      .then(island => {
        console.log(island);
        setIsland(island);
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="App">
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        {images.map(({src, description, key}) => (
          <div>
            <img key={key} src={src} alt={description} width="150px" />
            <h4>{description}</h4>
          </div>
        ))}
      </div>
      <h1>Welcome to Island Quest</h1>
      <h3>{'Your Account: ' + account}</h3>
      <h3>{'Your Islands: ' + (islands.length ? islands : 'None! Go toggle!')}</h3>
      <button onClick={() => getNewIsland()}>Toggle for New Island!</button>
    </div>
  );
}

export default App;
