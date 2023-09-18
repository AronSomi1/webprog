import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import inventory from './inventory.ES6';
import ComposeSalad from './ComposeSalad'
import { useState } from 'react';


function App() {
  const [shoppingCart, setShoppingCart] = useState([]);
  console.log(shoppingCart);

  return (
    <div className="container py-4">
      <Header></Header>
      <NavBar></NavBar>
      <ViewOrder shoppingCart={shoppingCart} removeSalad={removeSalad} ></ViewOrder>
      <ComposeSalad inventory={inventory} onSubmit={handleSubmit}></ComposeSalad>
      <Footer></Footer>
    </div >
  );

  function handleSubmit(salad) {
    setShoppingCart([...shoppingCart, salad]);
  }

  function removeSalad(salad) {
    let newShoppingCart = shoppingCart.filter((item) => item.uuid !== salad.uuid)
    setShoppingCart(newShoppingCart);
  }
}

function Header() {
  return (
    <header className="pb-3 mb-4 border-bottom">
      <span className="fs-4">Min egen salladsbar</span>
    </header>
  )
}

function NavBar(props) {
  return (
    <></>
  )
}

function ViewOrder(props) {
  return (
    <div className="row h-200  p-5 bg-light border rounded-3">
      <h2>Välj innehållet i din sallad</h2>
      {props.shoppingCart.map(salad =>
        <div key={salad.uuid}>
          <button onClick={() => props.removeSalad(salad)} className="w-auto rounded-2" >RemoveButton</button>

          <label className='border bg-white me-5 mt-2 ms-5'>
            {Object.keys(salad.ingredients).reduce((ack, ing) => ing + " " + ack, ",Pris: " + salad.getPrice() + " kr")}
          </label>
        </div>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="pt-3 mt-4 text-muted border-top">
      EDAF90 - webprogrammering
    </footer>
  )
}



export default App;
