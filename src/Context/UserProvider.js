import { useState, useEffect, useContext, createContext } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ cart: [], customer: null });
  const [initialized, setInitialized] = useState(false);

  // Load cart and customer from localStorage on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem("cart");
      if (data) {
        const parsed = JSON.parse(data);
        setUser((prev) => ({ ...prev, cart: Array.isArray(parsed) ? parsed : parsed.cart || [] }));
      }
      const customerData = localStorage.getItem("customer");
      if (customerData) {
        const parsedCustomer = JSON.parse(customerData);
        setUser((prev) => ({ ...prev, customer: parsedCustomer }));
      }
    } catch (err) {
      console.error("Failed to parse cart/customer from localStorage", err);
    } finally {
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep localStorage in sync when cart or customer changes (only after initial load completes)
  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem("cart", JSON.stringify(user.cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }

    try {
      if (user.customer) localStorage.setItem("customer", JSON.stringify(user.customer));
      else localStorage.removeItem("customer");
    } catch (err) {
      console.error("Failed to save customer to localStorage", err);
    }
  }, [user.cart, user.customer, initialized]);

  return <UserContext.Provider value={{ user, setUser, initialized }}>{children}</UserContext.Provider>;
};

const useUser = () => useContext(UserContext);

export { UserContext, UserProvider, useUser };
