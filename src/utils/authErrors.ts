export function friendlyAuthError(err: unknown, fallback = "An error occurred") {
    if (err && typeof err === "object") {
        const e = err as any;
        const code: string | undefined = e.code || (typeof e.message === "string" ? (e.message.match(/\((auth\/[^)]+)\)/)?.[1]) : undefined);
        if (code) {
            switch (code) {
                case "auth/invalid-credential":
                    return "Invalid credentials — please check your email and password.";
                case "auth/wrong-password":
                    return "Incorrect password.";
                case "auth/invalid-email":
                    return "Please enter a valid email address.";
                case "auth/user-not-found":
                    return "No account found for that email.";
                case "auth/email-already-in-use":
                    return "That email is already in use.";
                case "auth/weak-password":
                    return "Password is too weak (min 6 characters).";
                case "auth/too-many-requests":
                    return "Too many attempts — try again later.";
                case "auth/admin-restricted-operation":
                    return "Sign up is unavailable";
                default:
                    return typeof e.message === "string" ? e.message : fallback;
            }
        }
        if (typeof e.message === "string") return e.message;
    }
    return typeof err === "string" ? err : fallback;
}
