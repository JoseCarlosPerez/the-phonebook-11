import Person from "../Person";

const Persons = ({persons, handleDeletedClick}) => {

    return (
        persons.map(person => <Person key={person.id} person={person} handleClick={handleDeletedClick}/>)
    );
}

export default Persons;