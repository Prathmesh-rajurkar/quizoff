import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import WaitingRoom from './WaitingRoom';
import Questions from './Questions';


const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();
  return (
    <div className="h-screen bg-[#20002c] text-white box-border">
      {quizStarted ? (
        <div>
          <Questions/>
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