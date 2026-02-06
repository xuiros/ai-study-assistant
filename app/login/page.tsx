"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import styles from "./login.module.css"
import googleImg from "../../icons/google.png"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    console.log("Email:", email)
    console.log("Password:", password)
    // Redirect to dashboard after successful login
    router.push("/dashboard")
  }

  const handleCreateAccount = () => {
    router.push("/register")
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back — let's learn</h1>
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
        <button onClick={handleLogin} className={styles.button}>
          Login
        </button>
        <button
          onClick={() => console.log("Google sign-in")}
          className={styles.googleButton}
          aria-label="Sign in with Google"
        >
          <span className={styles.googleIcon} aria-hidden="true">
            <Image src={googleImg} alt="Google" width={18} height={18} />
          </span>
          <span>Sign in with Google</span>
        </button>
        <button
          onClick={handleCreateAccount}
          className={styles.createAccountButton}
          aria-label="Create an account"
        >
          Create account
        </button>
      </div>
    </div>
  )
}
