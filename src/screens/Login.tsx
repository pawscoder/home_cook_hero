import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

export default function Login() {
  const { signInWithGoogle, signOut, user, allowed } = useAuth()
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    setError(null)
    try {
      await signInWithGoogle()
    } catch {
      setError("Sign-in failed. Please try again.")
    }
  }

  // Signed in but not on the allowlist
  const blocked = user && !allowed

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: "1.5rem",
      fontFamily: "sans-serif",
    }}>
      <div style={{ fontSize: "3rem" }}>🍳</div>
      <h1 style={{ margin: 0 }}>Home Cook Hero</h1>

      {blocked ? (
        <>
          <p style={{ color: "#c00", textAlign: "center", maxWidth: 320 }}>
            <strong>{user.email}</strong> is not authorised to use this app.
            Please sign in with one of the household accounts.
          </p>
          <button onClick={signOut} style={btnStyle}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <p style={{ color: "#555" }}>Sign in to access your household</p>
          <button onClick={handleSignIn} style={btnStyle}>
            Sign in with Google
          </button>
          {error && <p style={{ color: "#c00" }}>{error}</p>}
        </>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  background: "#4285F4",
  color: "#fff",
  cursor: "pointer",
}
