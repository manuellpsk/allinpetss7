import React from 'react'
import {Spinner} from 'react-bootstrap'

export default function Loading() {
    return (
        <div className='text-center py-5'>
            <p className='h3 d-inline-block align-middle'>Cargando &nbsp;</p>
            <Spinner animation="grow" size="sm" />
            <Spinner animation="grow" size="sm" />
            <Spinner animation="grow" size="sm" />
        </div>
    )
}
/*
<div id='outer'>
            <div id='middle'>
                <div id='inner'>
                </div>
            </div>
        </div>

*/