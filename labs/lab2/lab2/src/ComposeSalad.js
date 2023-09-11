import { useState } from 'react';

function ComposeSalad(props) {
  let foundations = Object.keys(props.inventory).filter(name => props.inventory[name].foundation);
  let extras = Object.keys(props.inventory).filter(name => props.inventory[name].extra);
  let dressings = Object.keys(props.inventory).filter(name => props.inventory[name].dressing);
  let proteins = Object.keys(props.inventory).filter(name => props.inventory[name].protein);

  const [foundation, setFoundation] = useState('Pasta');
  const [protein, setProtein] = useState('Kycklingfilé');
  const [dressing, setDressing] = useState('Caesardressing');

  const [extra, setExtra] = useState(new Set(["Bacon", "Fetaost"]));

  return (
    <div className="container col-12">
      <form className="row h-200 p-5 bg-light border rounded-3">
        <h2>Välj bas</h2>
        <MySaladSelect
          options={foundations}
          value={foundation}
          onChange={(event) => { setFoundation(event.target.value) }}
        />
        <h2>Välj protein</h2>
        <MySaladSelect
          options={proteins}
          value={protein}
          onChange={(event) => { setProtein(event.target.value) }} />

        <h2>Välj extra</h2>
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
        <h2>Välj dressing</h2>
        <MySaladSelect
          options={dressings}
          value={dressing}
          onChange={(event) => { setDressing(event.target.value) }} />

      </form>
    </div>
  );
}
export default ComposeSalad;


function MySaladSelect({ options, value, onChange }) {

  return (
    <select value={value} onChange={onChange}>
      {options.map(name => <option key={name} >{name}</option>)}
    </select>
  )

}

function MySaladCheckComponent({ options, selected, onChange }) {
  return (
    <div className='list-container'>
      {options.map(name =>
        <div key={name}>
          <input value={name} type="checkbox" checked={selected.has(name)} onChange={(onChange)} />
          <span>{name}</span>
        </div>)}
    </div>
  )
}