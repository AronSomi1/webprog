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
  useNavigation,
  useNavigate
} from "react-router-dom";
import Salad from "./Salad";

function App() {
  const [confirmationList, setConfirmationList] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = localStorage.getItem('shoppingCart');
    if (cart !== null) {
      const salads = Salad.parse(cart)
      setShoppingCart(salads)
    }

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
          <Outlet context={{ shoppingCart, handleAddSalad, handleRemoveSalad, SaladConfirmation, handleSendOrder, confirmationList }} />}
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

  async function handleSendOrder() {
    if (shoppingCart.length == 0) {
      return { status: "empty" };
    }
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

    const data = await safeFetchJson('http://localhost:8080/orders/', options);
    if (data.status === "confirmed") {
      setShoppingCart([])
      setConfirmationList([...confirmationList, data]);
      localStorage.removeItem("shoppingCart")

    }
    return data;
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
      <span className="fs-4">Salladsbar</span>
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
      <li className="nav-item">
        <NavLink className="nav-link" to="/confirmedOrders">
          ConfirmedOrders
        </NavLink>
      </li>
      {/* more links */}
    </ul>);
}

function saladToString(salad) {
  return Object.keys(salad.ingredients).reduce((ack, ing) => ing + ", " + ack, "Pris: " + salad.getPrice() + " kr")
}

function ViewOrder() {
  const [confirmedState, setConfirmState] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setConfirmState({})
  }, [])

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
      <button onClick={() => props.handleSendOrder().then((data) => {
        setConfirmState(data)
        navigate("/view-order/")
      })} className="w-auto rounded-2" >Beställ</button>
      <ShowConfirmation
        data={confirmedState} />
    </div>
  )
}
function ShowConfimedList() {
  const props = useOutletContext();
  let confirmationList = props.confirmationList
  console.log("Detta är listan" + confirmationList)

  return (<ul className="list-group">
    {confirmationList.map((data) =>
      <li className="list-group-item" key={data.uuid}>Status: {data.status} <br />
        Ordernummer: {data.uuid} <br />
        Tid: {data.timestamp} <br />
        Antal Sallader: {data.order.length} <br />
        Pris : {data.price} kr
      </li>)}
  </ul>)

}

function ShowConfirmation(props) {

  const data = props.data
  console.log(data)
  if (data.status === undefined) {
    return <></>;
  }

  if (data.status !== "confirmed") {
    return (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <h2>{data.status === "empty" ? "Kundvagnen är tom" : "Ordern gick inte att ta emot"}</h2>
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )
  }


  return (
    <div className="alert alert-success alert-dismissible fade show" role="alert">
      <h2>Orderbekräftelse</h2>
      <p>Status: {data.status} <br />
        Ordernummer: {data.uuid} <br />
        Tid: {data.timestamp} <br />
        Antal Sallader: {data.order.length} <br />
        Pris : {data.price} kr
      </p>
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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


function SaladConfirmation() {
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
      <h2>Salad mottagen</h2>
      <p>UUID: {uuid} <br />
        Sallad: {saladToString(salad)}
      </p>
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export { App, ViewOrder, SaladConfirmation, ShowConfimedList };