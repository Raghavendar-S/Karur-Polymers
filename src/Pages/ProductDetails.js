import React, { useState } from "react";
import Layout from "../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import { ProductData } from "../SharedData";
import "./ProductDetails.css";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function ProductDetails() {
  const { id } = useParams();
  const product = ProductData.find((p) => p.id === parseInt(id, 10));
  const [selectedInchTape, setSelectedInchTape] = useState("1_inch");
  const [selectedColor, setSelectedColor] = useState("red");

  const calculatePieces = (inchTape) => {
    switch (inchTape) {
      case "1_inch":
        return 144;
      case "2_inch":
        return 72;
      case "3_inch":
        return 48;
      case "4_inch":
        return 36;
      default:
        return 0;
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
                  <FormLabel id="tape-color" style={{ color: "#000", textAlign:"center", fontFamily:"inherit", fontWeight:"bold" }}>
                    Tape Color
                  </FormLabel>
                  <RadioGroup
                    row
                    
                    value={selectedColor}
                    onChange={(event) => setSelectedColor(event.target.value)}
                  >
                    <FormControlLabel
                      value="red"
                      control={<Radio />}
                      label="Red"
                    />
                    <FormControlLabel
                      value="blue"
                      control={<Radio />}
                      label="Blue"
                    />
                    <FormControlLabel
                      value="green"
                      control={<Radio />}
                      label="Green"
                    />
                    <FormControlLabel
                      value="yellow"
                      control={<Radio />}
                      label="Yellow"
                    />
                    <FormControlLabel
                      value="mixed"
                      control={<Radio />}
                      label="Mixed"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              <FormControl>
                <FormLabel id="tape-inch" style={{ color: "#000", textAlign:"center", fontFamily:"inherit", fontWeight:"bold" }}>
                  Tape Width
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="tape-inch"
                  value={selectedInchTape}
                  onChange={(e) => setSelectedInchTape(e.target.value)}
                >
                  <FormControlLabel
                    value="1_inch"
                    control={<Radio />}
                    label="1 inch"
                  />
                  <FormControlLabel
                    value="2_inch"
                    control={<Radio />}
                    label="2 inch"
                  />
                  <FormControlLabel
                    value="3_inch"
                    control={<Radio />}
                    label="3 inch"
                  />
                  <FormControlLabel
                    value="4_inch"
                    control={<Radio />}
                    label="4 inch"
                  />
                </RadioGroup>
              </FormControl>
              <FormLabel style={{ color: "#000", textAlign:"center", fontFamily:"inherit", fontWeight:"bold" }} id="rolls">
                Number of tape rolls in a box
              </FormLabel>
              <Button variant="outlined" disabled style={{ color: "#000"}}>
                {calculatePieces(selectedInchTape)} Piece per box
              </Button>
              <FormControl>
                <FormLabel id="tape-length" style={{ color: "#000", textAlign:"center", fontFamily:"inherit", fontWeight:"bold" }}>
                  Tape Length
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="tape-length"
                  defaultValue="45_meter"
                >
                  <FormControlLabel
                    value="45_meter"
                    control={<Radio />}
                    label="45 Meter"
                  />
                  <FormControlLabel
                    value="65_meter"
                    control={<Radio />}
                    label="65 Meter"
                  />
                  <FormControlLabel
                    value="90_meter"
                    control={<Radio />}
                    label="90 Meter"
                  />
                  <FormControlLabel
                    value="100_meter"
                    control={<Radio />}
                    label="100 Meter"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </div>
        </div>
      </div>
    </Layout>
  );
}
