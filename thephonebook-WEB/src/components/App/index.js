import { useCallback, useEffect, useState } from 'react'
import Persons from '../Persons';
import Filter from '../Filter';
import PersonForm from '../PersonForm';
import Notification from '../Notification';
import personService from '../../services/persons.js';
import {levels} from '../../services/notifications.js';

require('./App.css');

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const name = newName.trim();
    const number = newNumber.trim();
    let person = persons.filter(s => s.name === name)[0];

    if (name && number) {
      if (!person) {
        addPerson({ name, number });
      } else {
        if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
          modifyPerson({...person, number});
        }
      }
    } else {
      alert('Fill name and number')
    }
  };

  const handleNameChange = useCallback(event => {
    setNewName(event.target.value);
  }, [newName]);

  const handleNumberChange = useCallback(event => {
    setNewNumber(event.target.value);
  }, [newNumber]);

  const handleFilterChange = useCallback(event => {
    setFilter(event.target.value);
  }, [filter]);

  const handleDeletedClick = useCallback(person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.delete(person.id).then(response => {
        if (response) {
          setPersons(persons.filter(s => s.id !== person.id));
          showNotification(`${person.name} deleted successfully`, levels.successful);
        } else {
          showNotification(`${person.name} couldn't be deleted`, levels.error);
        }
      });
    }
  }, [persons]);

  const resetViews = useCallback(() => {
    setNewName('');
    setNewNumber('');
    setFilter('');
  },[]);

  const showNotification = useCallback((text, level) => {
    setNotification({text, level});

    setTimeout(() => {
      setNotification({});
    }, 2000);
  }, []);

  const addPerson = useCallback((person) => {
    personService.add(person).then(response => {
      if (response) {
        setPersons(persons.concat(response));
        resetViews();
        showNotification(`${person.name} added successfully`, levels.successful);
      } else {
        showNotification(`${person.name} couldn't be added`, levels.error);
      }
    });
  }, [persons]);

  const modifyPerson = useCallback((person) => {
    personService.modify(person.id, person).then(response => {
      if (response) {
        console.log(response);
        console.log(persons);
        setPersons(persons.map(s => s.id === response.id ? response : s));
        resetViews();
        showNotification(`${person.name} modified successfully`, levels.successful);
      } else {
        showNotification(`${person.name} couldn't be modified`, levels.error);
      }
    });
  }, [persons]);

  useEffect(() => {
    personService.get().then(persons => setPersons(persons));
  }, []);

  return (
    <div>
      <h2 className="phoneBook">Phonebook</h2>
      <Notification text={notification.text} level={notification.level}/>
      <Filter text='filter shown with' filter={filter} handleChange={handleFilterChange}/>
      <h2 className="addNew">add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleName={handleNameChange}
        handleNumber={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2 className="numbers">Numbers</h2>
      {
        <Persons
          persons={
            persons.filter(s => s.name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
          }
          handleDeletedClick={handleDeletedClick}
        />
      }
    </div>
  )
};

export default App;