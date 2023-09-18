import { useState } from 'react';

function ComposeSalad(props) {
  let foundations = Object.keys(props.inventory).filter(name => props.inventory[name].foundation);
  let extras = Object.keys(props.inventory).filter(name => props.inventory[name].extra);
  let dressings = Object.keys(props.inventory).filter(name => props.inventory[name].dressing);
  let proteins = Object.keys(props.inventory).filter(name => props.inventory[name].protein);

  const [foundation, setFoundation] = useState('Pasta');
  const [protein, setProtein] = useState('Kycklingfilé');
  const [dressing, setDressing] = useState('Ceasardressing');

  const [extra, setExtra] = useState(new Set(["Bacon", "Fetaost"]));


  return (
    <form className="row h-200 p-5 bg-light border rounded-3" onSubmit={(event) => {

      let saladsliknandeobjekt = { ingredients: {} };
      let allIngetiets = [foundation, protein, dressing, ...extra];
      allIngetiets.forEach(name => saladsliknandeobjekt.ingredients[name] = props.inventory[name]);
      props.onSubmit(event, saladsliknandeobjekt);
      setFoundation('Pasta');
      setProtein('Kycklingfilé');
      setDressing('Ceasardressing');
      setExtra(new Set(['Bacon', 'Fetaost']));

    }}>
      <h3>Välj bas</h3>
      <MySaladSelect
        options={foundations}
        value={foundation}
        onChange={(event) => { setFoundation(event.target.value) }}
      />
      <h3>Välj protein</h3>
      <MySaladSelect
        options={proteins}
        value={protein}
        onChange={(event) => { setProtein(event.target.value) }} />

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
        onChange={(event) => { setDressing(event.target.value) }} />

      <button type="submit" className="w-auto rounded-2" >Add to cart</button>



    </form>
  );
}
export default ComposeSalad;


function MySaladSelect({ options, value, onChange }) {

  return (
    <div className='ps-5 pb-5 pt-3'>
      <select value={value} onChange={onChange} className='col-4'>
        {options.map(name => <option key={name} >{name}</option>)}
      </select>
    </div>
  )

}

function MySaladCheckComponent({ options, selected, onChange }) {
  return (
    <div className="row h-200 p-5 bg-light border rounded-3">
      {options.map(name =>
        <div key={name} className="col-4">
          <input value={name} type="checkbox" checked={selected.has(name)} onChange={(onChange)} />
          <span>{name}</span>
        </div>)}
    </div>
  )
}