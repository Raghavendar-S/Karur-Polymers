import { useState, useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import { useUser } from "../Context/UserProvider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../Components/InvoicePDF/InvoicePDF";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import "./CartPage.css";
import { WIDTH_OPTIONS, COLOR_OPTIONS, LENGTH_OPTIONS } from "../Repository/OptionData";
import toast from "react-hot-toast";

const CartPage = () => {
  const { user, setUser } = useUser();
  const [downloading, setDownloading] = useState(false);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const price_date = "October 26, 2023";

  const dateObject = new Date(price_date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
  const year = dateObject.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // compute total price directly from cart items
  const totalPrice = () => {
    return user.cart.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
  };

  const calculatePieces = (inchTape) => {
    const found = WIDTH_OPTIONS.find((w) => w.value === inchTape);
    return found ? found.pieces : 0;
  };

  const removeCardItem = (cartItemId) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setUser((prev) => ({ ...prev, cart: updatedCart }));
    } catch (error) {
      console.log(error);
    }
  };

  const incrementQuantity = (cartItemId) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setUser((prev) => ({ ...prev, cart: updatedCart }));
    } catch (error) {
      console.log(error);
    }
  };

  const decrementQuantity = (cartItemId) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const qty =
            item.quantity && item.quantity > 1
              ? item.quantity - 1
              : item.quantity;
          return { ...item, quantity: qty };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setUser((prev) => ({ ...prev, cart: updatedCart }));
    } catch (error) {
      console.log(error);
    }
  };

  // Helper to persist cart to session and context
  const updateCart = (updatedCart) => {
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setUser((prev) => ({ ...prev, cart: updatedCart }));
    } catch (err) {
      console.error("Failed to update cart", err);
    }
  };

  // Change an option (color/width/length) for a specific cart item.
  // If the new configuration matches an existing cart item, merge quantities.
  const handleOptionChange = (cartItemId, field, value) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx = cart.findIndex((i) => i.cartItemId === cartItemId);
      if (idx === -1) return;
      const item = cart[idx];
      const updatedItem = { ...item, [field]: value };

      const baseId = item._id || item.id || "";
      const newCartItemId = `${baseId}_${updatedItem.selectedColor || ""}_${
        updatedItem.selectedInchTape || ""
      }_${updatedItem.selectedLength || ""}`;
      updatedItem.cartItemId = newCartItemId;

      const existingIndex = cart.findIndex(
        (i) => i.cartItemId === newCartItemId
      );

      if (existingIndex > -1 && existingIndex !== idx) {
        // Merge quantities into existing item and remove current
        const merged = {
          ...cart[existingIndex],
          quantity:
            (cart[existingIndex].quantity || 1) + (updatedItem.quantity || 1),
        };
        const newCart = cart
          .filter((_, i) => i !== idx)
          .map((c, i) => (i === existingIndex ? merged : c));
        updateCart(newCart);
      } else {
        // Replace item in place
        const newCart = cart.map((c) =>
          c.cartItemId === cartItemId ? updatedItem : c
        );
        updateCart(newCart);
      }
    } catch (err) {
      console.error("Failed to change option", err);
    }
  };

  const downloadPDF = async () => {
    try {
      setDownloading(true);
      const doc = (
        <InvoicePDF
          cart={user.cart || []}
          customer={user.customer || null}
          total={totalPrice()}
          date={new Date().toLocaleDateString(undefined, options)}
          invoiceNumber={`INV-${Date.now()}`}
        />
      );

      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Pdf generation failed", err);
    } finally {
      setDownloading(false);
    }
  };

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Open the confirmation dialog (bound to Clear Cart button)
  const clearCart = () => {
    if (!user.cart || user.cart.length === 0) return;
    setConfirmOpen(true);
  };

  // Perform the actual clear when the user confirms
  const confirmClearCart = () => {
    try {
      localStorage.setItem("cart", JSON.stringify([]));
      setUser((prev) => ({ ...prev, cart: [] }));
      setConfirmOpen(false);
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart", err);
      toast.error("Failed to clear cart");
      setConfirmOpen(false);
    }
  }; 

  // customer fields and validation
  const [customerName, setCustomerName] = useState(user.customer?.name || "");
  const [customerEmail, setCustomerEmail] = useState(
    user.customer?.email || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    user.customer?.phone || ""
  );

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    // sync local customer form state with context when it changes (e.g., after reload)
    if (user.customer) {
      setCustomerName(user.customer.name || "");
      setCustomerEmail(user.customer.email || "");
      setCustomerPhone(user.customer.phone || "");
    } else {
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    }
    // reset validation state when customer context changes
    setTouched({ name: false, email: false, phone: false });
    setErrors({ name: "", email: "", phone: "" });
  }, [user.customer]);

  // Simple validators (empty = valid because fields are optional)
  const validateName = (v) => {
    if (!v || !v.trim()) return "Name is required";
    if (v.trim().length < 3) return "Name must be at least 3 characters";
    return "";
  };
  const validateEmail = (v) => {
    if (!v) return "";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v) ? "" : "Enter a valid email address";
  };
  const validatePhone = (v) => {
    if (!v || !v.toString().replace(/\D/g, "")) return "Phone is required";
    const digits = v.toString().replace(/\D/g, "");
    if (digits.length !== 10) return "Enter a 10-digit phone number";
    return "";
  };

  const isFormValid =
    !validateName(customerName) &&
    !validatePhone(customerPhone) &&
    !validateEmail(customerEmail);

  const isDirty =
    customerName !== user.customer?.name ||
    customerEmail !== user.customer?.email ||
    customerPhone !== user.customer?.phone;

  const saveCustomer = () => {
    // validate before saving
    const nameErr = validateName(customerName);
    const emailErr = validateEmail(customerEmail);
    const phoneErr = validatePhone(customerPhone);
    setErrors({ name: nameErr, email: emailErr, phone: phoneErr });
    setTouched({ name: true, email: true, phone: true });

    if (nameErr || emailErr || phoneErr) {
      toast.error("Please fix validation errors before saving.");
      return;
    }

    const customer = {
      name: customerName || undefined,
      email: customerEmail || undefined,
      phone: customerPhone || undefined,
    };
    setUser((prev) => ({ ...prev, customer }));
    try {
      if (Object.values(customer).some(Boolean))
        localStorage.setItem("customer", JSON.stringify(customer));
      else localStorage.removeItem("customer");
    } catch (err) {
      console.error("Failed to save customer", err);
    }
    toast.success("Customer details saved");
    // reset validation state
    setTouched({ name: false, email: false, phone: false });
    setErrors({ name: "", email: "", phone: "" });
  };

  return (
    <Layout>
      <div className="cart_container">
        <div className="user_card text-center">
          <div>
            <h4>Provide details to include on the pre-invoice</h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 12,
                alignItems: "center",
                width: "100%",
              }}
            >
              <TextField
                label="Name"
                size="small"
                variant="outlined"
                value={customerName}
                required
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (touched.name)
                    setErrors((prev) => ({
                      ...prev,
                      name: validateName(e.target.value),
                    }));
                }}
                onBlur={(e) => {
                  setTouched((prev) => ({ ...prev, name: true }));
                  setErrors((prev) => ({
                    ...prev,
                    name: validateName(e.target.value),
                  }));
                }}
                error={!!errors.name && touched.name}
                helperText={touched.name && errors.name ? errors.name : ""}
                inputProps={{ maxLength: 50 }}
                fullWidth
              />
              <TextField
                label="Email"
                size="small"
                variant="outlined"
                type="email"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (touched.email)
                    setErrors((prev) => ({
                      ...prev,
                      email: validateEmail(e.target.value),
                    }));
                }}
                onBlur={(e) => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setErrors((prev) => ({
                    ...prev,
                    email: validateEmail(e.target.value),
                  }));
                }}
                error={!!errors.email && touched.email}
                helperText={touched.email && errors.email ? errors.email : ""}
                inputProps={{ maxLength: 80 }}
                fullWidth
              />
              <TextField
                label="Phone"
                size="small"
                variant="outlined"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => {
                  // sanitize: keep only digits and limit to 10
                  const digitsOnly = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setCustomerPhone(digitsOnly);
                  if (touched.phone)
                    setErrors((prev) => ({
                      ...prev,
                      phone: validatePhone(digitsOnly),
                    }));
                }}
                onBlur={(e) => {
                  const digitsOnly = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setTouched((prev) => ({ ...prev, phone: true }));
                  setErrors((prev) => ({
                    ...prev,
                    phone: validatePhone(digitsOnly),
                  }));
                }}
                error={!!errors.phone && touched.phone}
                helperText={touched.phone && errors.phone ? errors.phone : ""}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={saveCustomer}
                disabled={!isDirty || !isFormValid}
                style={{
                  marginTop: 16,
                  alignSelf: "center",
                }}
              >
                {isDirty ? "Save details" : "Saved"}
              </Button>
            </div>
          </div>
          <section>
            <h4>Date: {new Date().toLocaleDateString(undefined, options)}</h4>
            <h4>
              {user.cart?.length
                ? `You have ${user.cart.length} items in your cart`
                : "Your cart is empty"}
            </h4>
            <h4>Lastly updated price date: {formattedDate || price_date}</h4>
            <button
              className="btn"
              id="clear_cart_btn"
              onClick={clearCart}
              disabled={!user.cart?.length}
              style={{
                marginTop: 12,
                backgroundColor: "#f44336",
                color: "#fff",
              }}
            >
              <i className="ri-delete-bin-line" /> Clear Cart
            </button>

            {/* Confirmation dialog for clearing the cart (replaces window.confirm) */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
              <DialogTitle>Clear cart</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to remove all items from your cart?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button onClick={confirmClearCart} color="error">
                  Clear
                </Button>
              </DialogActions>
            </Dialog>


          </section>
        </div>
        <div className="cart_product_container">
          {user.cart?.map((p) => (
            <div
              key={p.cartItemId || p._id}
              className="single_product_cart_container outer_card"
            >
              <div className="cart_image_container">
                <img
                  src={p.image}
                  className="custom-cart-img-card"
                  alt={p.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/150";
                  }}
                />
              </div>
              <div className="cart_details_container card text-center">
                <h2>{p.name}</h2>
                <p>Price : ₹{p.price} per box</p>
                <p>
                  Total price: ₹{p.price * (p.quantity || 1)} for{" "}
                  {p.quantity || 1} box
                </p>
                <Stack spacing={2} alignItems="center" className="mt-2">
                  {p.selectedColor !== undefined &&
                    p.selectedColor !== null && (
                      <FormControl>
                        <FormLabel
                          id={`tape-color-${p.cartItemId}`}
                          style={{ color: "#000" }}
                        >
                          Tape Color
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby={`tape-color-${p.cartItemId}`}
                          value={p.selectedColor}
                          onChange={(e) =>
                            handleOptionChange(
                              p.cartItemId,
                              "selectedColor",
                              e.target.value
                            )
                          }
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

                  {p.selectedInchTape !== undefined && (
                    <FormControl>
                      <FormLabel
                        id={`tape-inch-${p.cartItemId}`}
                        style={{ color: "#000" }}
                      >
                        Tape Width
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby={`tape-inch-${p.cartItemId}`}
                        value={p.selectedInchTape}
                        onChange={(e) =>
                          handleOptionChange(
                            p.cartItemId,
                            "selectedInchTape",
                            e.target.value
                          )
                        }
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
                  )}

                  <FormLabel
                    style={{ color: "#000" }}
                    id={`rolls-${p.cartItemId}`}
                  >
                    Number of tape rolls in a box
                  </FormLabel>
                  <Button variant="outlined" disabled style={{ color: "#000" }}>
                    {calculatePieces(p.selectedInchTape)} Piece
                  </Button>

                  {p.selectedLength !== undefined && (
                    <FormControl>
                      <FormLabel
                        id={`tape-length-${p.cartItemId}`}
                        style={{ color: "#000" }}
                      >
                        Tape Length
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby={`tape-length-${p.cartItemId}`}
                        value={p.selectedLength}
                        onChange={(e) =>
                          handleOptionChange(
                            p.cartItemId,
                            "selectedLength",
                            e.target.value
                          )
                        }
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
                  )}

                  <FormLabel
                    id={`quantity-${p.cartItemId}`}
                    style={{ color: "#000" }}
                  >
                    Box Quantity
                  </FormLabel>
                  <ButtonGroup variant="contained" size="large">
                    <Button onClick={() => decrementQuantity(p.cartItemId)}>
                      -
                    </Button>
                    <Button>{p.quantity || 1} </Button>
                    <Button onClick={() => incrementQuantity(p.cartItemId)}>
                      +
                    </Button>
                  </ButtonGroup>
                </Stack>

                <button
                  className="btn"
                  id="delete_btn"
                  onClick={() => removeCardItem(p.cartItemId || p._id)}
                >
                  <i className="ri-delete-bin-line" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="admin_menu text-center checkout_card">
          <h2>Cart Summary</h2>
          <p style={{ marginBottom: "0.75rem" }}>Total | Checkout | Payment</p>
          <hr />
          <h4 style={{ marginTop: "0.75rem" }}>Total : ₹{totalPrice()}</h4>
          <h4 style={{ marginTop: "0.75rem" }}>
            Net Total : ₹{totalPrice() + totalPrice() * 0.18} (included GST)
          </h4>
          <button
            className="btn"
            id="update_btn"
            onClick={downloadPDF}
            disabled={downloading || !user.cart?.length}
          >
            <i className="ri-file-download-line" />{" "}
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
