import Layout from "../Components/Layout/Layout";
import { ProductData } from "../Repository/SharedData";
import { useNavigate } from "react-router-dom";
import './ProductPage.css';

export default function ProductPage() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="product_container">
        <div className="product_card_list">
          <div className="product_list">
            {ProductData.map((p) => (
              <div key={p.id} className="custom-card">
              <img
                src={p.image}
                alt={p.name}
              />
              <div className="custom-card-body">
                <h5 className="custom-card-title">{p.name}</h5>
                <p className="custom-card-text">
                  {p.description.substring(0, 30)}...
                </p>
                <p className="custom-card-text">
                  Price: <b>₹{p.price}</b> per box onwards
                </p>
                  <button
                    className="btn"
                    onClick={() => navigate(`/product/${p.id}`)}
                    id="details_btn"
                  >
                    <i className="ri-more-2-fill" /> More Details
                  </button>
                    <button
                        className="btn"
                        onClick={() => navigate(`/product/${p.id}`)}
                        id="create_btn"
                      >
                        <i className="ri-shopping-cart-2-fill" /> Add to Cart
                      </button>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
