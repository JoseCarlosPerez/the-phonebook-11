require('./notification.css');

const Notification = ({text, level}) => {
    return (
        <div className={`notification${level ?  ` ${level}` : ''}`}>
            <span>{text}</span>
        </div>
    );
}

export default Notification;