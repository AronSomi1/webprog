import { createBrowserRouter } from "react-router-dom";
import { App, ViewOrder, OrderConfirmation } from './App';
import ComposeSalad from "./ComposeSalad";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                index: true,
                element: <h2>Välkommen</h2>
            },
            {
                path: "compose-salad",
                element: <ComposeSalad></ComposeSalad>
            },
            {
                path: "view-order",
                element: <ViewOrder></ViewOrder>,
                children: [{
                    path: "order-confirmation/:uuid",
                    element: <OrderConfirmation></OrderConfirmation>,
                }]
            },
            {
                path: "*",
                element: <h2>Ej giltig URL</h2>
            }]
    },
]);

export default router;