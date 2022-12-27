const Persons = ({personToShow, deletePerson}) => {

    return (
        <>
         {personToShow.map(person => <div key={person.name}>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></div>)}
        </>
    )
}

export default Persons