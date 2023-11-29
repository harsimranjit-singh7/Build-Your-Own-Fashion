import React from 'react'
import modalcss from '../assets/styles/Modal.module.css'


export const Alert = ({ visible , data}) => {
    return (
        <div style={visible ? { display: "block", top: "10px", transition: "top .5s ease-in", transform: "50% 50%" } : {}} className={modalcss.alert}>{data}</div>
    )
}
