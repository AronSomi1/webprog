import { createBrowserRouter } from "react-router-dom";
import { App, ViewOrder } from './App';
import ComposeSalad from "./ComposeSalad";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: "compose-salad",
                element: <ComposeSalad></ComposeSalad>
            },
            {
                path: "view-order",
                element: <ViewOrder></ViewOrder>
            },
            {
                path: "/",
                element: <h2>Välkommen</h2>
            }]
    },
]);

export default router;