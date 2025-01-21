import { useEffect, useState } from "react";
import { ethers } from "ethers";
import itemsData from "./items.json"; // Import items.json

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Jengawize from "./abis/Jengawize.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [jengawize, setJengawize] = useState(null);
  const [account, setAccount] = useState(null);
  const [categories, setCategories] = useState({});
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    setToggle(!toggle);
  };

  const loadBlockchainData = async () => {
    if (!window.ethereum) {
      console.error("Ethereum provider not found!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log("Network Chain ID:", network.chainId);

    const contractConfig = config[network.chainId]?.jengawize;
    if (!contractConfig?.address) {
      console.error(`No contract address found for chainId ${network.chainId}`);
      return;
    }

    let items = [];
    try {
      const jengawize = new ethers.Contract(
        contractConfig.address,
        Jengawize,
        provider
      );
      setJengawize(jengawize);

      // Fetch items from blockchain
      for (let i = 0; i < 9; i++) {
        const item = await jengawize.items(i + 1);
        items.push({
          id: item.id.toNumber(),
          name: item.name,
          category: item.category,
          image: item.image,
          price: item.price.toString(),
          rating: item.rating.toNumber(),
          stock: item.stock.toNumber(),
        });
      }
    } catch (error) {
      console.error(
        "Failed to load blockchain items. Falling back to local items.json:",
        error
      );
      items = Array.isArray(itemsData.items) ? itemsData.items : [];
    }

    console.log("Items:", items);

    // Categorize products
    const categorized = items.reduce((acc, item) => {
      const category = item.category.toLowerCase().trim();
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    setCategories(categorized);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Jengawize Bestsellers!</h2>

      {Object.keys(categories).length ? (
        Object.entries(categories).map(([category, items]) => (
          <Section
            key={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            items={items}
            togglePop={togglePop}
          />
        ))
      ) : (
        <p>Loading products...</p>
      )}

      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          jengawize={jengawize}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;
