import React from 'react'
import "../assets/styles/ErrorElement.module.css";
import { Link } from 'react-router-dom';

const ErrorElement = () => {
  return (
    <div>
        <div className='center'>
            <h1>Unexpected Application Error!</h1>
            <p>Please route to valid Page</p>
            <Link className='link' to={'/'}>Go Back to main Page</Link>
        </div>
        {/* <p>Please check out our valid Page</p> */}
    </div>
  )
}

export default ErrorElement