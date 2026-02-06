"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./chat.module.css"

type Message = {
  id: string
  role: "user" | "assistant"
  text: string
}

const mockResponses = [
  "That's an interesting question. Based on the document, this relates to...",
  "I found relevant information about that. The document mentions...",
  "Great question! The key concept here is...",
  "Looking at the material, I can explain this as...",
  "The document covers this topic by explaining...",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: "Hello! I'm here to help you understand this document. Feel free to ask any questions about the content.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const mockResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)]
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: mockResponse,
      }
      setMessages((prev) => [...prev, aiMessage])
      setLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Chat with Document</h1>
        <button onClick={() => router.push("/dashboard")} className={styles.backButton}>
          ← Back
        </button>
      </div>

      <div className={styles.chatBox}>
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={styles.content}>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.content}>
                <div className={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the document..."
            className={styles.input}
            rows={3}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} className={styles.sendButton}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
