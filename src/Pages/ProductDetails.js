import { useState, useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import { ProductData } from "../Repository/SharedData";
import "./ProductDetails.css";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useUser } from "../Context/UserProvider";
import toast from "react-hot-toast";
import {WIDTH_OPTIONS, COLOR_OPTIONS, LENGTH_OPTIONS} from "../Repository/OptionsData";

export default function ProductDetails() {
  const { id } = useParams();
  const product = ProductData.find((p) => p.id === parseInt(id, 10));
  const [selectedInchTape, setSelectedInchTape] = useState(
    WIDTH_OPTIONS[0].value
  );
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedLength, setSelectedLength] = useState(LENGTH_OPTIONS[0].value);
  const { setUser } = useUser();

  const isColorProduct = product && product.name === "Color tape";

  useEffect(() => {
    if (product && product.name === "Color tape") {
      setSelectedColor(COLOR_OPTIONS[0].value);
    } else {
      setSelectedColor(null);
    }
  }, [product]);

  if (!product) {
    return (
      <Layout>
        <div className="main_container card">
          <p>Product not found</p>
        </div>
      </Layout>
    );
  }

  const calculatePieces = (inchTape) => {
    const found = WIDTH_OPTIONS.find((w) => w.value === inchTape);
    return found ? found.pieces : 0;
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const itemId = product._id || product.id;
    const colorForId = isColorProduct ? selectedColor : "no_color";
    const cartItemId = `${itemId}_${colorForId}_${selectedInchTape}_${selectedLength}`;

    const cartItem = {
      ...product,
      _id: itemId,
      cartItemId,
      selectedColor: isColorProduct ? selectedColor : null,
      selectedInchTape,
      selectedLength,
      quantity: 1,
    };

    const existingProduct = cart.find((item) => item.cartItemId === cartItemId);

    if (!existingProduct) {
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      setUser((prev) => ({ ...prev, cart }));
      toast.success("Item added to cart");
    } else {
      toast.error("Same configuration already added in the cart");
    }
  };

  return (
    <Layout>
      <div className="main_container card">
        <div className="product_card">
          <div className="left_container">
            <img
              src={product.image}
              alt={product.name}
              className="custom_img"
            />
          </div>
          <div className="right_container">
            <h2 className="text-center">Product Details</h2>
            <p>
              <b>Product name: </b>
              {product.name}
            </p>
            <p className="text-justify">
              <b>Product Description: </b>
              {product.description}
            </p>
            <p>
              <b>Price: </b>₹{product.price} per box onwards
            </p>
            <Stack spacing={2} alignItems="center">
              {product.name === "Color tape" && (
                <FormControl>
                  <FormLabel
                    id="tape-color"
                    className="form-label-bold"
                  >
                    Tape Color
                  </FormLabel>
                  <RadioGroup
                    row
                    value={selectedColor}
                    onChange={(event) => setSelectedColor(event.target.value)}
                  >
                    {COLOR_OPTIONS.map((opt) => (
                      <FormControlLabel
                        key={opt.value}
                        value={opt.value}
                        control={<Radio />}
                        label={opt.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
              <FormControl>
                <FormLabel
                  id="tape-inch"
                  className="form-label-bold"
                >
                  Tape Width
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="tape-inch"
                  value={selectedInchTape}
                  onChange={(e) => setSelectedInchTape(e.target.value)}
                >
                  {WIDTH_OPTIONS.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      value={opt.value}
                      control={<Radio />}
                      label={opt.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormLabel
                className="form-label-bold"
                id="rolls"
              >
                Number of tape rolls in a box
              </FormLabel>
              <Button variant="outlined" disabled className="button-disabled-dark">
                {calculatePieces(selectedInchTape)} Piece per box
              </Button>
              <FormControl>
                <FormLabel
                  id="tape-length"
                  className="form-label-bold"
                >
                  Tape Length
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="tape-length"
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value)}
                >
                  {LENGTH_OPTIONS.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      value={opt.value}
                      control={<Radio />}
                      label={opt.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <div className="text-center">
              <button
                className="btn"
                onClick={() => handleAddToCart(product)}
                id="create_btn"
              >
                <i className="ri-shopping-cart-2-fill" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
