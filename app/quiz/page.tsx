"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./quiz.module.css"
import undoImg from "../../icons/undo.png"

type Question = {
  q: string
  options: string[]
  correct: number
}

const mockQuestions: Question[] = [
  {
    q: "What is photosynthesis?",
    options: ["Process of converting sunlight to nutrients", "Breakdown of food", "Transport of water", "Reproduction of plants"],
    correct: 0,
  },
  {
    q: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
  },
  {
    q: "What is the formula for momentum?",
    options: ["E = mc²", "p = mv", "F = ma", "v = d/t"],
    correct: 1,
  },
  {
    q: "What is DNA?",
    options: ["Protein", "Fat molecule", "Genetic material", "Sugar"],
    correct: 2,
  },
]

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)
  const router = useRouter()

  const current = mockQuestions[currentIndex]

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return
    setAnswered(true)
    if (selected === current.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setCompleted(true)
    }
  }

  if (completed) {
    const percentage = Math.round((score / mockQuestions.length) * 100)
    return (
      <div className={styles.container}>
        <div className={styles.resultsCard}>
          <h1 className={styles.resultsTitle}>Quiz Complete!</h1>
          <div className={styles.scoreCircle}>
            <div className={styles.scoreText}>{percentage}%</div>
          </div>
          <p className={styles.resultText}>
            You got <strong>{score}</strong> out of <strong>{mockQuestions.length}</strong> correct
          </p>
          <button onClick={() => router.push("/dashboard")} className={styles.homeButton}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.push("/dashboard")} className={styles.topBackBtn}>← Back to Dashboard</button>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Quiz</h1>
          <div className={styles.progress}>
            Question {currentIndex + 1}/{mockQuestions.length}
          </div>
        </div>

        <h2 className={styles.question}>{current.q}</h2>

        <div className={styles.options}>
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`${styles.option} ${selected === i ? styles.selected : ""} ${
                answered && i === current.correct ? styles.correct : ""
              } ${answered && i === selected && i !== current.correct ? styles.incorrect : ""}`}
              disabled={answered}
            >
              {opt}
            </button>
          ))}
        </div>

        {!answered ? (
          <button onClick={handleSubmit} disabled={selected === null} className={styles.submitButton}>
            Submit Answer
          </button>
        ) : (
          <div className={styles.feedback}>
            {selected === current.correct ? (
              <p className={styles.correct}>✓ Correct!</p>
            ) : (
              <p className={styles.incorrect}>✗ Incorrect</p>
            )}
            <div className={styles.feedbackControls}>
              <button 
                onClick={() => {
                  setCurrentIndex(Math.max(0, currentIndex - 1))
                  setSelected(null)
                  setAnswered(false)
                }} 
                disabled={currentIndex === 0}
                className={styles.undoButton}
                title="Go to previous question"
              >
                <Image src={undoImg} alt="Undo" width={16} height={16} />
              </button>
              <button onClick={handleNext} className={styles.nextButton}>
                {currentIndex === mockQuestions.length - 1 ? "See Results" : "Next Question"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
