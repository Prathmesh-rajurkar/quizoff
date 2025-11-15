import React from 'react'
import { useParams } from 'react-router-dom';

const Quiz = () => {
    const { id } = useParams(); 
  return (
    <div>
        <h1>Quiz {id}</h1>
    </div>
  )
}

export default Quiz