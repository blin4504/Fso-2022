import axios from 'axios'
import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [personToShow, setPersonToShow] = useState([])

  useEffect(() => {
    personService
    .getAll().then(people => {
      setPersons(people)
      setPersonToShow(people)
    })
  }, [])

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
      updateNumber(personObject)
    } else {
      personService.create(personObject).then(addedPerson => {
        setPersons(persons.concat(addedPerson))
        setPersonToShow(personToShow.concat(addedPerson))
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const updateNumber = (personObject) => {
    if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
      const personToChange = persons.find(people => people.name === personObject.name)
      personService.update(personToChange.id, personObject).then(newPerson => {
        setPersons(persons.map(person => person.id === personToChange.id ? personObject : person))
        setPersonToShow(persons.map(person => person.id === personToChange.id ? personObject : person))
      })
    }
  }

  const filterPersons = (event) => {
    const search = event.target.value
    setFilter(search)
    const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(search))
    setPersonToShow(
      peopleToShow
    );
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deletion(person.id)
      setPersons(persons.filter(people => people.id !== person.id))
      setPersonToShow(personToShow.filter(people => people.id !== person.id))
    }
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
      <Persons personToShow={personToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App