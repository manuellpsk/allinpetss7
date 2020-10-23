import React from 'react';
import { Alert } from 'react-bootstrap'
import './styles.css'

function Alerts(props) {
    return (
        <div>
            <Alert className='position-absolute'
                variant={props.variant}
                transition='true' > {props.value} </Alert> 
        </div>
    );
}

export default Alerts;