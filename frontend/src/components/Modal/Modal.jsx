import React from 'react';
import classes from "./Modal.module.css"

const MyComponent = ({children, onClose}) => {

    return (
        <div className={` ${classes.modal}`}>
            <div className={` ${classes.modalContent}`}>
                <button className={` ${classes.closeButton}`} onClick={onClose}>❌</button>
                {children}
            </div>
        </div>
    );
};

export default MyComponent;
