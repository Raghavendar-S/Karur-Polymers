import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
  headerRight: {
    textAlign: "right",
  },
  customerInfo: {
    marginTop: 6,
    fontSize: 12,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeaderSmall: {
    width: "12.5%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontWeight: 700,
  },
  tableColHeaderLarge: {
    width: "50%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontWeight: 700,
  },
  tableColSmall: {
    width: "12.5%",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableColLarge: {
    width: "50%",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  numericRight: {
    textAlign: "right",
  },
  total: {
    marginTop: 10,
    textAlign: "right",
    fontSize: 14,
    fontWeight: 700,
  },
});

const Header = ({ date, invoiceNumber, customer }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerLeft}>
      <Image src="/assets/mini-logo.png" style={styles.logo} />
      <View>
        <Text style={{ fontSize: 18 }}>Karur Polymers</Text>
      </View>
    </View>

    <View style={styles.headerRight}>
      <Text>Date: {date}</Text>
      <Text>Proforma-Invoice #: {invoiceNumber}</Text>
      {customer && (
        <View style={styles.customerInfo}>
          {customer.name && <Text>Name: {customer.name}</Text>}
          {customer.email && <Text>Email: {customer.email}</Text>}
          {customer.phone && <Text>Phone: {customer.phone}</Text>}
        </View>
      )}
    </View>
  </View>
);

const InvoicePDF = ({
  cart = [],
  customer = null,
  total = 0,
  date = "",
  invoiceNumber = "",
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Header date={date} invoiceNumber={invoiceNumber} customer={customer} />

      <View style={styles.table}>
        <View style={[styles.tableRow]} fixed>
          <View style={styles.tableColHeaderSmall}>
            <Text>Sl No.</Text>
          </View>
          <View style={styles.tableColHeaderLarge}>
            <Text>Item</Text>
          </View>
          <View style={styles.tableColHeaderSmall}>
            <Text>Unit Price</Text>
          </View>
          <View style={styles.tableColHeaderSmall}>
            <Text>Qty</Text>
          </View>
          <View style={styles.tableColHeaderSmall}>
            <Text>Total</Text>
          </View>
        </View>

        {cart.map((item, idx) => (
          <View
            style={styles.tableRow}
            key={item.cartItemId || item._id || idx}
            wrap={false}
          >
            <View style={styles.tableColSmall}>
              <Text>{idx + 1}</Text>
            </View>
            <View style={styles.tableColLarge}>
              <Text>{item.name}</Text>
              <Text style={{ fontSize: 10, color: "#333" }}>
                {item.selectedColor ? `Color: ${item.selectedColor} • ` : ""}
                Width: {item.selectedInchTape} • Length: {item.selectedLength}
              </Text>
            </View>
            <View style={[styles.tableColSmall, styles.numericRight]}>
              <Text>Rs.{item.price}</Text>
            </View>
            <View style={[styles.tableColSmall, styles.numericRight]}>
              <Text>{item.quantity || 1}</Text>
            </View>
            <View style={[styles.tableColSmall, styles.numericRight]}>
              <Text>Rs.{item.price * (item.quantity || 1)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <Text>W/O Tax: Rs.{total}</Text>
        <Text>Net Total : Rs.{total + total * 0.18}</Text>
        <Text>(included 18% GST)</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
