"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./register.module.css"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = () => {
    setError("")
    
    if (!email || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    console.log("Registering:", email)
    // Mock registration - in real app, send to backend
    router.push("/dashboard")
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
        />
        
        <button onClick={handleRegister} className={styles.button}>
          Create Account
        </button>
        
        <div className={styles.footer}>
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className={styles.link}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
