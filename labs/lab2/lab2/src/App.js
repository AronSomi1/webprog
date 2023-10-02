import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
//import inventory from './inventory.ES6';
import { useState, useEffect } from 'react';
import {
  Outlet,
  NavLink,
  useParams,
  useOutletContext,
  useNavigation
} from "react-router-dom";
import Salad from "./Salad";

function App() {
  const [shoppingCart, setShoppingCart] = useState([]);

  useEffect(() => {
    const cart = localStorage.getItem('shoppingCart');
    const salads = Salad.parse(cart)
    setShoppingCart(salads)
  }, [])

  const navigation = useNavigation();
  const searching = navigation.state === 'loading';
  console.log("searching = " + searching)

  return (
    <div className="container py-4">
      <Header></Header>
      <NavBar></NavBar>
      <div className="row h-200  p-5 bg-light border rounded-3">
        {searching ? <BootstrapSpinner /> :
          <Outlet context={{ shoppingCart, handleAddSalad, handleRemoveSalad, OrderConfirmation, handleSendOrder }} />}
        <Footer></Footer>
      </div>
    </div >
  );

  function handleAddSalad(salad) {
    const newShoppingCart = [...shoppingCart, salad]
    setShoppingCart(newShoppingCart);
    localStorage.setItem("shoppingCart", JSON.stringify(newShoppingCart))
  }

  function safeFetchJson(url, options) {
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`${url} returned status   ${response.status}`);
        }
        return response.json();
      })
  }

  function handleRemoveSalad(salad) {
    let newShoppingCart = shoppingCart.filter((item) => item.uuid !== salad.uuid)
    setShoppingCart(newShoppingCart);
  }

  function handleSendOrder() {
    const saladOrder = shoppingCart.reduce((ack, salad) => ([
      ...ack,
      Object.keys(salad.ingredients).reduce((ack, name) => [...ack, name], [])
    ]),
      [])

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(saladOrder)
    }

    console.log("Sending order: " + JSON.stringify(saladOrder))
    safeFetchJson('http://localhost:8080/orders/', options).then(data => {
      console.log(data)
      if (data.status === "confirmed") {
        console.log("order success")
      } else {
        console.log("order fail")
      }
    })
  }
}

function BootstrapSpinner() {
  return <div className="d-flex justify-content-center">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
}

function Header() {
  return (
    <header className="pb-3 mb-4 border-bottom">
      <span className="fs-4">Min egen salladsbar</span>
    </header>
  )
}

function NavBar() {
  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <NavLink className="nav-link" to="/compose-salad">
          Komponera en sallad
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/view-order">
          Se din order
        </NavLink>
      </li>
      {/* more links */}
    </ul>);
}

function saladToString(salad) {
  return Object.keys(salad.ingredients).reduce((ack, ing) => ing + ", " + ack, "Pris: " + salad.getPrice() + " kr")
}

function ViewOrder() {
  let props = useOutletContext();
  return (
    <div>
      <div>
        <Outlet context={props} />
      </div>
      <h2>Varukorg</h2>
      {props.shoppingCart.map(salad =>
        <div key={salad.uuid}>
          <button onClick={() => props.handleRemoveSalad(salad)} className="w-auto rounded-2" >Ta bort</button>
          <label className='border bg-white me-5 mt-2 ms-5'>
            {saladToString(salad)}
          </label>
        </div>
      )}
      <button onClick={() => props.handleSendOrder()} className="w-auto rounded-2" >Beställ</button>
    </div>
  )
}

function Footer() {
  return (
    <footer className="pt-3 mt-4 text-muted border-top">
      EDAF90 - Webbprogrammering <br />
      Aron Somi <br />
      Jesper Kristiansson
    </footer>
  )
}

function OrderConfirmation() {
  let props = useOutletContext();
  let params = useParams();
  let uuid = params.uuid;

  let salad = props.shoppingCart.filter(salad => salad.uuid === uuid);
  if (salad.length === 0) {
    return (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <h2>Ogiltig UUID: {uuid}</h2>
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )
  }

  salad = salad[0]
  return (
    <div className="alert alert-success alert-dismissible fade show" role="alert">
      <h2>Order mottagen</h2>
      <p>UUID: {uuid} <br />
        Sallad: {saladToString(salad)}
      </p>
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export { App, ViewOrder, OrderConfirmation };