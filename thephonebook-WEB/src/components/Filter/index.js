import TextArea from "../TextArea";

require('./Filter.css');

const Filter = ({text, filter, handleChange}) => {
    return (
        <div className="filter">
            <TextArea text={text} value={filter} handleChange={handleChange}/>
        </div>
    );
}

export default Filter;