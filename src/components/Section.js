//import { ethers } from "ethers";

// Components
import Rating from "./Rating";

const Section = ({ title, items, togglePop }) => {
  if (!items || !Array.isArray(items)) {
    console.error(`Invalid items array for section "${title}"`, items);
    return null; // Prevent rendering if data is invalid
  }

  return (
    <div className="cards__section">
      <h3 id={title}>{title}</h3>

      <hr />

      <div className="cards">
        {items.map((item) => (
          <div key={item.id} className="card">
            <div className="card__image">
              <img src={item.image} alt="Item" />
            </div>

            <div className="card__info">
              <h4>{item.name}</h4>
              <Rating value={item.rating} />
              {/* <p>
                {ethers.utils.formatUnits(item.cost?.toString(), "ether")} ETH
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
