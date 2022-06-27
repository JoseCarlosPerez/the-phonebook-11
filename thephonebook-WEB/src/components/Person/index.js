require('./Person.css');

const Person = ({person, handleClick}) => {
    return (
        <div className="person">
          <input type="button" value="delete" onClick={() => handleClick(person)}/>
          <span>{person.name}: {person.number}</span> 
        </div>
    );
}

export default Person;