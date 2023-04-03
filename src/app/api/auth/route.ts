import { createHash } from "crypto"
import { NextResponse } from "next/server"
import { db } from "@/firebase/firebase-app"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"
import qs from "qs"

const MYANIMELIST_CLIENT_ID = process.env.X_MAL_CLIENT_ID + ""
const MYANIMELIST_CLIENT_SECRET = process.env.X_MAL_CLIENT_SECRET + ""

export async function GET(request: Request, { params }: { params: any }) {
  const url = new URL(request.url)
  const origin = `${url.protocol}//${url.hostname}${url.port ? ":" + url.port : ""}`
  const REDIRECT_URI = `${origin}/api/auth`
  //first step of auth
  if (request.url === REDIRECT_URI) {
    const urlRedirect = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${MYANIMELIST_CLIENT_ID}&code_challenge=${request.headers.get(
      "codechallenge",
    )}&state=RequestID42`
    return NextResponse.json({ url: urlRedirect })
  }
  // second step of auth
  //1: get userID and codechallenge
  const str = request.headers.get("cookie")
  const obj = str?.split("; ").reduce((acc: any, curr: any) => {
    const [key, value] = curr.split("=")
    acc[key] = decodeURIComponent(value)
    return acc
  }, {})
  //2: get oauthCode
  const urlParams = new URLSearchParams(new URL(request.url).search)
  const authCode = urlParams.get("code")
  //3: get AccessToken
  const urlParamsOauth = {
    client_id: MYANIMELIST_CLIENT_ID,
    client_secret: MYANIMELIST_CLIENT_SECRET,
    code_verifier: obj.codechallenge as any,
    grant_type: "authorization_code",
    code: authCode as any,
  }
  const urlEncodedParams = qs.stringify(urlParamsOauth)
  try {
    const res = await fetch("https://myanimelist.net/v1/oauth2/token", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncodedParams,
    })
    const result = await res.json()

    //4: Save Access Token and RefreshToken
    const docRef = doc(db, "users", obj.userID)
    //5: Get User information and saved info to firebase
    const accessToken = result.access_token
    const url = "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics"
    fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const res = await updateDoc(docRef, {
          mal_connect: {
            myAnimeList_username: data.name,
            accessToken: result.access_token,
            refreshToken: result.refresh_token,
            expiresIn: result.expires_in,
            createDate: serverTimestamp(),
          },
        })
        return NextResponse.redirect(`${origin}`)
      })
      .catch((error) => console.error(error))
    return NextResponse.redirect(`${origin}`)
  } catch (error) {
    console.log(error)
  }
}

export const getServerSideProps = ({ req, res }: { req: any; res: any }) => {
  return { props: {} }
}

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
