import axios from "axios";
import { useEffect, useState } from "react";

const Country = ({country}) => {
  return (
  <>
    <h1>{country.name.common}</h1>
    <div>capital {country.capital}</div>
    <div>area {country.area}</div>
    <h3>languages:</h3>
    <ul>
      {Object.entries(country.languages).map(([key, value]) => 
        <li key={key}>{value}</li>
      )}
    </ul>
    <img src={country.flags.png} />
  </>)
}

const Countries = ({filtered, setFiltered}) => {
  if (filtered.length === 1) return null
  return (
  <>
    {filtered.map(country => 
          <div key={country.name.common}>{country.name.common} <button onClick={() => setFiltered([country])}>show</button></div>)}
  </>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/all`)
    .then(response => {
    setCountries(response.data)
    setFiltered(response.data)
    })
  }, [])

  const filterSearch = (event) => {
    const searched = event.target.value
    setSearch(searched)
    setFiltered(countries.filter(country => country.name.common.toLowerCase().includes(searched)))
  }

  return (
  <>
    <div>find countries <input value={search} onChange={filterSearch}></input></div>
      {filtered.length === 1 ? <Country country={filtered[0]} /> : null}
      {filtered.length > 10 ? <div>Too many matches, specify another filter</div> : 
      <Countries filtered={filtered} setFiltered={setFiltered} />}
  </>
  )
}

export default App;
