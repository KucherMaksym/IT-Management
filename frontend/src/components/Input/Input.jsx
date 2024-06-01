import React from 'react';
import classes from "./Input.module.css"

const Input = (props) => {
    return (
        <div className={classes.block}>
            <input className={`${classes.input}`} name={props.name} value={props.value} onChange={props.onChange} />
            <label className={`${classes.label} ${props.value ? `${classes.focused}` : ""}`}>{props.label}</label>
        </div>
    );
};

export default Input;
