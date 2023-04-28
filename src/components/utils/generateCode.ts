import { createHash } from "crypto"

export function generateCodeVerifier() {
  const codeVerifier = generateRandomString(128)
  return codeVerifier
}

export function generateCodeChallenge(codeVerifier: string) {
  const hashed = createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
  return hashed
}

function generateRandomString(length: number) {
  let text = ""
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}
