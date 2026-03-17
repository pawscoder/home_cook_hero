import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { friendlyAuthError } from "../utils/authErrors"

interface Props {
  onSwitchToSignUp: () => void
}

export default function Login({ onSwitchToSignUp }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: unknown) {
      setError(friendlyAuthError(err, "Login failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>Home Cook Hero 🍳</h2>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={{ padding: "8px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            style={{ padding: "8px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
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
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p style={{ margin: 0, textAlign: "center", fontSize: "14px" }}>
          No account yet?{" "}
          <button type="button" onClick={onSwitchToSignUp} style={{ background: "none", border: "none", color: "#e67e22", cursor: "pointer", padding: 0, fontSize: "14px" }}>
            Sign up
          </button>
        </p>
      </form>
    </div>
  )
}
