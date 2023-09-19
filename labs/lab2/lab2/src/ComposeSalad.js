import { useState } from 'react';
import Salad from './Salad';
import { useNavigate, useOutletContext } from 'react-router-dom';
import inventory from './inventory.ES6';

function ComposeSalad() {
  let props = useOutletContext()
  let foundations = Object.keys(props.inventory).filter(name => props.inventory[name].foundation);
  let extras = Object.keys(props.inventory).filter(name => props.inventory[name].extra);
  let dressings = Object.keys(props.inventory).filter(name => props.inventory[name].dressing);
  let proteins = Object.keys(props.inventory).filter(name => props.inventory[name].protein);

  const navigate = useNavigate()

  const [foundation, setFoundation] = useState("");
  const [protein, setProtein] = useState("");
  const [dressing, setDressing] = useState("");

  const [extra, setExtra] = useState(new Set());


  return (
    <form noValidate onSubmit={(event) => {
      event.preventDefault()

      if (!event.target.checkValidity()) {
        event.target.classList.add("was-validated");
        return;
      }

      //React.Children.forEach(child => { console.log(child); child.classList.remove("was-validated") })

      event.target.classList.remove("was-validated")

      let salad = new Salad();
      salad.add(foundation, props.inventory[foundation]);
      salad.add(protein, props.inventory[protein])
      salad.add(dressing, props.inventory[dressing])
      extra.forEach(name => salad.add(name, props.inventory[name]))

      props.handleAddSalad(salad)
      let uuid = salad.uuid;
      setFoundation("");
      setProtein("");
      setDressing("");
      setExtra(new Set());

      navigate("/view-order/order-confirmation/" + uuid) //navigera till /view-order/order-confirmation/id

    }}>
      <h2>Välj innehållet i din sallad</h2>
      <div className='ps-4'>
        <h3>Bas</h3>
        <MySaladSelect
          options={foundations}
          inventory={inventory}
          value={foundation}
          onChange={(event) => {
            setFoundation(event.target.value);
            event.target.parentElement.classList.add("was-validated");
          }}
          errorMessage={"Välj en bas"}
        />
        <h3>Protein</h3>
        <MySaladSelect
          options={proteins}
          inventory={inventory}
          value={protein}
          onChange={(event) => {
            setProtein(event.target.value)
            event.target.parentElement.classList.add("was-validated");
          }}
          errorMessage={"Välj ett protein"} />

        <h3>Extra</h3>
        <MySaladCheckComponent
          options={extras}
          inventory={inventory}
          selected={extra}
          onChange={
            (event) => {
              if (extra.has(event.target.value)) {
                let newExtra = new Set(extra);
                newExtra.delete(event.target.value)
                setExtra(newExtra);
              } else { setExtra(new Set([...extra, event.target.value])) }
              //setExtra({ ...extra, [event.target.value]: !extra[event.target.value] })
            }
          } />
        <h3>Dressing</h3>
        <MySaladSelect
          options={dressings}
          inventory={inventory}
          value={dressing}
          onChange={(event) => {
            setDressing(event.target.value)
            event.target.parentElement.classList.add("was-validated");
          }}
          errorMessage={"Välj en dressing"} />
      </div>

      <button type="submit" className="w-auto rounded-2" >Add to cart</button>


    </form>
  );
}
export default ComposeSalad;



function MySaladSelect({ options, inventory, value, onChange, errorMessage }) {
  return (
    <div className='ps-5 pb-5 pt-3'>
      <select value={value} onChange={onChange} className='form-select' required>
        <option value="">{errorMessage}</option>
        {options.map((name,) => <option key={name} value={name}>{name + " (" + inventory[name].price + " kr)"}</option>)}
      </select>
      <div className="invalid-feedback">
        {errorMessage}
      </div>
      <div className='valid-feedback'>Korrekt</div>
    </div>
  )

}

function MySaladCheckComponent({ options, inventory, selected, onChange }) {
  return (
    <div className="row h-200 p-5 bg-light border rounded-3">
      {options.map(name =>
        <div key={name} className="form-check col-4">
          <input className='form-check-input' value={name} type="checkbox" checked={selected.has(name)} onChange={(onChange)} />
          <label className='form-check-label'>{name + " (" + inventory[name].price + " kr)"}</label>
        </div>)}
    </div>
  )
}