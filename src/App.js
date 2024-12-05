import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Section from './components/Section';
import Product from './components/Product';

// ABIs
import Jengawize from './abis/Jengawize.json';

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [jengawize, setJengawize] = useState(null);
  const [account, setAccount] = useState(null);

  const [steel, setSteel] = useState([]);
  const [cement, setCement] = useState([]);
  const [concrete, setConcrete] = useState([]);
  const [bindingwire, setBindingwire] = useState([]);
  const [wood, setWood] = useState([]);
  const [stone, setStone] = useState([]);
  const [brick, setBrick] = useState([]);
  const [sand, setSand] = useState([]);

  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    setToggle(!toggle);
  };

  const loadBlockchainData = async () => {
    if (!window.ethereum) {
      console.error('Ethereum provider not found!');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log('Network:', network);

    // Load smart contract
    const jengawize = new ethers.Contract(
      config[network.chainId]?.jengawize?.address,
      Jengawize,
      provider
    );

    setJengawize(jengawize);

    const items = [];
    for (let i = 0; i < 9; i++) {
      try {
        const item = await jengawize.items(i + 1);
        items.push(item);
      } catch (error) {
        console.error(`Failed to load item ${i + 1}:`, error);
      }
    }

    console.log('Items:', items);

    // Categorize products
    setSteel(items.filter((item) => item.category.toLowerCase().trim() === 'steel'));
    setCement(items.filter((item) => item.category.toLowerCase().trim() === 'cement'));
    setConcrete(items.filter((item) => item.category.toLowerCase().trim() === 'concrete'));
    setBindingwire(items.filter((item) => item.category.toLowerCase().trim() === 'binding wire'));
    setWood(items.filter((item) => item.category.toLowerCase().trim() === 'wood'));
    setStone(items.filter((item) => item.category.toLowerCase().trim() === 'stone'));
    setBrick(items.filter((item) => item.category.toLowerCase().trim() === 'brick'));
    setSand(items.filter((item) => item.category.toLowerCase().trim() === 'sand'));
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Jengawize Bestsellers!</h2>

      {steel.length && cement.length && concrete.length && bindingwire.length && wood.length && stone.length && brick.length && sand.length ? (
        <>
          <Section title="Steel" items={steel} togglePop={togglePop} />
          <Section title="Cement" items={cement} togglePop={togglePop} />
          <Section title="Concrete" items={concrete} togglePop={togglePop} />
          <Section title="Binding Wire" items={bindingwire} togglePop={togglePop} />
          <Section title="Wood" items={wood} togglePop={togglePop} />
          <Section title="Stone" items={stone} togglePop={togglePop} />
          <Section title="Brick" items={brick} togglePop={togglePop} />
          <Section title="Sand" items={sand} togglePop={togglePop} />
        </>
      ) : (
        <p>Loading products...</p>
      )}

      {toggle && <Product item={item} provider={provider} account={account} jengawize={jengawize} togglePop={togglePop} />}
    </div>
  );
}

export default App;
