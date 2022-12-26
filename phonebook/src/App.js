import axios from 'axios'
import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [personToShow, setPersonToShow] = useState([])

  const hook = () => {
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
      setPersonToShow(response.data)
    })
  }

  useEffect(hook, [])

  const handleNewPerson = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setPersonToShow(persons.concat(personObject))
    }
    setNewName('')
    setNewNumber('')
  }

  const filterPersons = (event) => {
    const search = event.target.value.toLowerCase()
    setFilter(search)
    setPersonToShow(
      persons.filter((person) => person.name.toLowerCase().includes(search))
    );
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} filterPersons={filterPersons} />
      <h3>Add a new person</h3>
      <PersonForm 
        addPerson={addPerson} newName={newName} 
        handleNewPerson={handleNewPerson} newNumber={newNumber} 
        handleNewNumber={handleNewNumber} />
      <h3>Numbers</h3>
      <Persons personToShow={personToShow} />
    </div>
  )
}

export default App