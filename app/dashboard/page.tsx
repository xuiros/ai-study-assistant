"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./dashboard.module.css"
import notesImg from "../../icons/notes.png"

type Doc = {
  id: string
  name: string
  extractedText: string
}

export default function DashboardPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [processing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)
  const [aiResult, setAiResult] = useState<{summary?: string; flashcards?: string[]; quiz?: string[]} | null>(null)
  const router = useRouter()

  // Load documents from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("documents")
    if (saved) {
      try {
        setDocs(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load documents:", e)
      }
    }
  }, [])

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(docs))
  }, [docs])

  const handleLogout = () => {
    router.push("/login")
  }

  const uploadFile = async (file?: File) => {
    if (!file) return
    setProcessing(true)
    setStatusText("Processing your file...")
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      const doc: Doc = { id: data.id, name: data.name, extractedText: data.extractedText }
      setDocs((s) => [doc, ...s])
      setSelectedDoc(doc)
      setStatusText("Your study materials are ready")
    } catch (err) {
      console.error(err)
      setStatusText("Failed to process file")
    } finally {
      setProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) uploadFile(f)
  }

  const generateSummary = () => {
    if (!selectedDoc) return
    // Simple mock AI processing based on extracted text
    const text = selectedDoc.extractedText
    const summary = text.split(" ").slice(0, 40).join(" ") + (text.split(" ").length > 40 ? "..." : "")
    const flashcards = [
      "Key concept: " + text.split(" ").slice(0, 6).join(" "),
      "Important term: " + text.split(" ").slice(6, 12).join(" "),
    ]
    const quiz = ["Q: What is the main idea? A:", "Q: Name an important term. A:"]
    setAiResult({ summary, flashcards, quiz })
  }

  const handleFlashcards = () => {
    router.push("/flashcards")
  }

  const handleQuiz = () => {
    router.push("/quiz")
  }

  const handleChat = () => {
    router.push("/chat")
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1>Dashboard</h1>
        </div>
        <div className={styles.uploadButton}>
          <label htmlFor="file-input" className={styles.uploadLabel}>
            {processing ? (
              <div className={styles.progressIndicator} aria-hidden="true" />
            ) : (
              <Image src={notesImg} alt="Notes" width={18} height={18} />
            )}
            <span>{processing ? "Processing..." : "Upload Notes"}</span>
          </label>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
        <input id="file-input" type="file" onChange={handleFileChange} className={styles.hiddenInput} accept=".pdf,.doc,.docx,.txt" />
      </div>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <h3>Your Documents</h3>
          <ul>
            {docs.length === 0 && <li className={styles.empty}>No documents yet</li>}
            {docs.map((d) => (
              <li key={d.id}>
                <button className={styles.docButton} onClick={() => setSelectedDoc(d)}>{d.name}</button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.content}>
          {processing && <div className={styles.status}>⏳ {statusText}</div>}
          {!processing && selectedDoc && (
            <>
              <h2>{selectedDoc.name}</h2>
              <div className={styles.actions}>
                <button onClick={generateSummary} className={styles.actionButton}>📚 Generate Summary</button>
                <button onClick={handleFlashcards} className={styles.actionButton}>🧠 Generate Flashcards</button>
                <button onClick={handleQuiz} className={styles.actionButton}>📝 Generate Quiz</button>
                <button onClick={handleChat} className={styles.actionButton}>💬 Chat with Document</button>
              </div>

              {aiResult && (
                <div className={styles.results}>
                  <h3>Summary</h3>
                  <p>{aiResult.summary}</p>

                  <h3>Flashcards</h3>
                  <ul>
                    {aiResult.flashcards?.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>

                  <h3>Quiz</h3>
                  <ul>
                    {aiResult.quiz?.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}

          {!processing && !selectedDoc && <div className={styles.emptyPane}>Upload a document to get started.</div>}
        </section>
      </div>
    </div>
  )
}
