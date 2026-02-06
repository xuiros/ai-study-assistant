"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./flashcards.module.css"
import undoImg from "../../icons/undo.png"

type FlashcardProps = {
  question: string
  answer: string
}

function Flashcard({ question, answer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className={styles.flashcardWrapper} onClick={() => setFlipped(!flipped)}>
      <div className={`${styles.flashcard} ${flipped ? styles.flipped : ""}`}>
        <div className={styles.front}>{question}</div>
        <div className={styles.back}>{answer}</div>
      </div>
    </div>
  )
}

type FlashcardsPageProps = {
  data?: {
    docName: string
    flashcards: { q: string; a: string }[]
  }
}

export default function FlashcardsPage({ data }: FlashcardsPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  // Mock flashcards if no data passed
  const flashcards = data?.flashcards || [
    { q: "What is photosynthesis?", a: "The process by which plants use sunlight to synthesize nutrients." },
    { q: "What is the capital of France?", a: "Paris" },
    { q: "Define momentum.", a: "The product of mass and velocity (p = mv)." },
    { q: "What is DNA?", a: "Deoxyribonucleic acid, the molecule carrying genetic instructions." },
  ]

  const current = flashcards[currentIndex]

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={() => router.push("/dashboard")} className={styles.backBtn}>← Back to Dashboard</button>
        <h1 className={styles.title}>Flashcards</h1>
        <div style={{ width: 120 }}></div>
      </div>
      <p className={styles.subtitle}>Click to flip</p>

      <div className={styles.cardContainer}>
        <Flashcard question={current.q} answer={current.a} />
      </div>

      <div className={styles.progress}>
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div className={styles.controls}>
        <button onClick={handlePrev} disabled={currentIndex === 0} className={styles.button} title="Previous card">
          <Image src={undoImg} alt="Undo" width={16} height={16} />
        </button>
        <button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} className={styles.button}>
          Next →
        </button>
      </div>
    </div>
  )
}
