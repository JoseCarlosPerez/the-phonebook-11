require('./TextArea.css');

const TextArea = ({text, value, handleChange}) => {
    return (
        <div className="textArea">
          <div className="text">
            <span>{text}:</span>
          </div>
          <div>
            <input value={value} onChange={handleChange}/>
          </div>
        </div>
    )
}

export default TextArea;