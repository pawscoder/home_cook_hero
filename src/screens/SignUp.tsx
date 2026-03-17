import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { friendlyAuthError } from "../utils/authErrors"

interface Props {
  onSwitchToLogin: () => void
}

export default function SignUp({ onSwitchToLogin }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // onAuthStateChanged in App.tsx picks up the new user automatically
    } catch (err: unknown) {
      setError(friendlyAuthError(err, "Sign up failed"))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { padding: "8px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>Home Cook Hero 🍳</h2>
        <p style={{ margin: 0, textAlign: "center", color: "#666", fontSize: "14px" }}>Create your household account</p>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            style={inputStyle}
          />
        </label>

        {error && (
          <p style={{ color: "red", margin: 0, fontSize: "14px" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", fontSize: "16px", borderRadius: "6px", border: "none", background: "#e67e22", color: "white", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p style={{ margin: 0, textAlign: "center", fontSize: "14px" }}>
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} style={{ background: "none", border: "none", color: "#e67e22", cursor: "pointer", padding: 0, fontSize: "14px" }}>
            Sign in
          </button>
        </p>
      </form>
    </div>
  )
}
