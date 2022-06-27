import TextArea from "../TextArea";

const PersonForm = ({name, number, handleName, handleNumber, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit}>
        <TextArea text='name' value={name} handleChange={handleName}/>
        <TextArea text='number' value={number} handleChange={handleNumber}/>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    );
}

export default PersonForm;