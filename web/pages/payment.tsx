import { Center } from "@mantine/core";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


const initialOptions = {
    "client-id": "sb",
    currency: "USD",
    intent: "capture",
    "data-client-token": "abc123xyz==",
};


const Payment = () => {


    return (
        <PayPalScriptProvider options={initialOptions}>
            <Center mt='xl'>
                <PayPalButtons style={{ layout: "horizontal" }} />
            </Center>

        </PayPalScriptProvider>
    )
}


export default Payment