import { Stack } from "@mantine/core";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initialOptions } from "../../utils/paypalInitialOptions";
import createOrder from "../../utils/requests/bookings/createOrder";
import onApprove from "../../utils/requests/bookings/onApprove";

interface PaymentBodyProps {
  class_id: string;
  handleApprovedPayment: () => void;
}

const PaymentBody = ({ class_id, handleApprovedPayment }: PaymentBodyProps) => {
  return (
    <Stack justify="start" sx={{}}>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical", color: "black", tagline: false }}
          createOrder={(data, actions) => {
            return createOrder({
              class_id: [class_id],
              // user_id: 1,
            })
              .then((response) => response.json())
              .then((order) => order.id);
          }}
          onApprove={(data, actions) => {
            return onApprove(data.orderID)
              .then((response) => response.json())
              .then((orderData) => {
                console.log(
                  "Capture result",
                  orderData,
                  JSON.stringify(orderData, null, 2)
                );
                handleApprovedPayment();
              });
          }}
        />
      </PayPalScriptProvider>
    </Stack>
  );
};

export default PaymentBody;
