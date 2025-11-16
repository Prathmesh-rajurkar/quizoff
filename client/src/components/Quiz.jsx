import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import WaitingRoom from './WaitingRoom';


const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();
  return (
    <div className="h-screen bg-black text-white box-border">
      {quizStarted ? (
        <div>
          <button onClick={() => setQuizStarted(false)}>End Quiz</button>
        </div>
      ) : (
        <div>
          <WaitingRoom onStartQuiz={setQuizStarted}/>
        </div>
      )}
    </div>
  )
}

export default Quiz