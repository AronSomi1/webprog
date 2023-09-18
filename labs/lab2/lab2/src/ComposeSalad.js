import { useState } from 'react';
import Salad from './Salad';
import { useNavigate, useOutletContext } from 'react-router-dom';

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

      setFoundation("");
      setProtein("");
      setDressing("");
      setExtra(new Set());

      navigate("/view-order")

    }}>
      <h2>Välj innehållet i din sallad</h2>
      <h3>Välj bas</h3>
      <MySaladSelect
        options={foundations}
        value={foundation}
        onChange={(event) => {
          setFoundation(event.target.value);
          event.target.parentElement.classList.add("was-validated");
        }}
        errorMessage={"Välj en bas"}
      />
      <h3>Välj protein</h3>
      <MySaladSelect
        options={proteins}
        value={protein}
        onChange={(event) => {
          setProtein(event.target.value)
          event.target.parentElement.classList.add("was-validated");
        }}
        errorMessage={"Välj ett protein"} />

      <h3>Välj extra</h3>
      <MySaladCheckComponent
        options={extras}
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
      <h3>Välj dressing</h3>
      <MySaladSelect
        options={dressings}
        value={dressing}
        onChange={(event) => {
          setDressing(event.target.value)
          event.target.parentElement.classList.add("was-validated");
        }}
        errorMessage={"Välj en dressing"} />

      <button type="submit" className="w-auto rounded-2" >Add to cart</button>


    </form>
  );
}
export default ComposeSalad;



function MySaladSelect({ options, value, onChange, errorMessage }) {
  return (
    <div className='ps-5 pb-5 pt-3'>
      <select value={value} onChange={onChange} className='form-select' required>
        <option value="">Varför måste tom sträng vara först</option>
        {options.map((name,) => <option key={name} >{name}</option>)}
      </select>
      <div className="invalid-feedback">
        {errorMessage}
      </div>
      <div className='valid-feedback'>Korrekt</div>
    </div>
  )

}

function MySaladCheckComponent({ options, selected, onChange }) {
  return (
    <div className="row h-200 p-5 bg-light border rounded-3">
      {options.map(name =>
        <div key={name} className="form-check col-4">
          <input className='form-check-input' value={name} type="checkbox" checked={selected.has(name)} onChange={(onChange)} />
          <label className='form-check-label'>{name}</label>
        </div>)}
    </div>
  )
}