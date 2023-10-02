import { createBrowserRouter } from "react-router-dom";
import { App, ViewOrder, SaladConfirmation } from './App';
import { ComposeSalad, inventoryLoader } from "./ComposeSalad";

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
                element: <ComposeSalad></ComposeSalad>,
                loader: inventoryLoader,

            },
            {
                path: "view-order",
                element: <ViewOrder></ViewOrder>,
                children: [{
                    path: "salad-confirmation/:uuid",
                    element: <SaladConfirmation></SaladConfirmation>,
                }, {
                    path: "",
                }]
            },
            {
                path: "*",
                element: <h2>Ej giltig URL</h2>
            }]
    },
]);

export default router;