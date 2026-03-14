import { useState, useEffect } from "react"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [allowlistLoading, setAllowlistLoading] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u?.email) {
        setAllowed(false)
        setAuthLoading(false)
        return
      }
      setAllowlistLoading(true)
      try {
        const snap = await getDoc(doc(db, "config", "allowlist"))
        const emails: string[] = snap.exists() ? (snap.data().emails ?? []) : []
        setAllowed(emails.includes(u.email))
      } catch {
        setAllowed(false)
      } finally {
        setAllowlistLoading(false)
        setAuthLoading(false)
      }
    })
  }, [])

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return {
    user,
    authLoading: authLoading || allowlistLoading,
    allowed,
    signInWithGoogle,
    signOut: signOutUser,
  }
}
