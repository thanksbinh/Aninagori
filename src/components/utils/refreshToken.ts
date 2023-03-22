import { db } from '@/firebase/firebase-app';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import qs from 'qs';

export async function refreshUserToken(session: any) {
  if (!session?.user) return;
  const docRef = doc(db, 'users', (session?.user as any).id);
  const docSnap = await getDoc(docRef);
  const userData = docSnap.data();
  if (!userData?.mal_connect) return;
  const token_expire_time =
    (userData?.mal_connect as any).createDate.seconds + (userData?.mal_connect as any).expiresIn;
  const current_timestamp_seconds = Math.floor(Date.now() / 1000);
  const is_token_expired = token_expire_time - current_timestamp_seconds < 1296000; // auto recess token after 15days
  if (!is_token_expired) return;
  const urlParamsOauth = {
    client_id: process.env.X_MAL_CLIENT_ID,
    client_secret: process.env.X_MAL_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: (userData?.mal_connect as any).refreshToken,
  };
  const urlEncodedParams = qs.stringify(urlParamsOauth);
  const res = await fetch('https://myanimelist.net/v1/oauth2/token', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncodedParams,
  });
  const result = await res.json();
  await updateDoc(docRef, {
    mal_connect: {
      myAnimeList_username: userData?.mal_connect.myAnimeList_username,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      createDate: serverTimestamp(),
    },
  });
}
