import { useEffect } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import PaymentBody from "../components/Bookings/PaymentBody";

// This values are the props in the UI
const amount = "2";
const currency = "GBP";
const style = { layout: "vertical" };

const initialOptions = {
  "client-id":
    "Aew2k09_9YjZoPH_ZYzm44x9WhORwaXQi-cgHZUtOkyJiHXGBX9U3xCB1iFDqu_gtuOZNVwzIN2BFd6N",
  currency: "GBP",
  components: "buttons",
};
export default function PaymentPage() {
  return (
    <div style={{ maxWidth: "750px", minHeight: "200px" }}>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function () {
              // Your code here after capture the order
            });
          }}
        />
      </PayPalScriptProvider>
    </div>

    // <PaymentBody booking_id="1" handleApprovedPayment={() => {}} />
  );
}
