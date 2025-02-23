import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import inventory from './inventory.ES6';
import Salad from './Salad';
import ComposeSalad from './ComposeSalad'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


function App() {
  let extras = Object.keys(inventory).filter(name => inventory[name].extra);
  const [shoppingCart, setShoppingCart] = useState([]);
  console.log(shoppingCart);

  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom">
        <span className="fs-4">Min egen salladsbar</span>
      </header>

      <div className="container col-12">
        <ViewOrder shoppingCart={shoppingCart} removeSalad={removeSalad} ></ViewOrder>
        <ComposeSalad inventory={inventory} onSubmit={handleSubmit}></ComposeSalad>
      </div>

      <footer className="pt-3 mt-4 text-muted border-top">
        EDAF90 - webprogrammering
      </footer>
    </div >
  );

  function handleSubmit(event, salladsliknandeobjekt) {
    let salad = Salad.parse(JSON.stringify(salladsliknandeobjekt));
    console.log(salad.getPrice());
    setShoppingCart([...shoppingCart, salad]);
    event.preventDefault();
  }

  function removeSalad(event, salad) {
    let newShoppingCart = shoppingCart.filter((item) => item.uuid !== salad.uuid)
    setShoppingCart(newShoppingCart);
  }


}

function ViewOrder(props) {
  return (
    <div className="row h-200  p-5 bg-light border rounded-3">
      <h2>Välj innehållet i din sallad</h2>
      {props.shoppingCart.map(salad =>
        <div key={salad.uuid}>
          <button onClick={(event) => props.removeSalad(event, salad)} className="w-auto rounded-2" >RemoveButton</button>

          <label className='border bg-white me-5 mt-2 ms-5'>
            {Object.keys(salad.ingredients).reduce((ack, ing) => ing + " " + ack, ",Pris: " + salad.getPrice() + " kr")}
          </label>
        </div>
      )}

    </div>

  )


}



export default App;
