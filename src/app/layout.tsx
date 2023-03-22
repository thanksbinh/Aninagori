import './globals.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';

import { SessionProvider } from '@/app/SessionProvider';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import NavBar from '@/components/nav/NavBar';
import { db } from '@/firebase/firebase-app';
import qs from 'qs';

export const metadata: Metadata = {
  title: 'Aninagori',
  description: 'Share your favourite Animemory with friends',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  refreshUserToken(session);
  return (
    <html lang="en">
      <head />
      <body>
        <main className="bg-ani-gray">
          <SessionProvider session={session}>
            {/* @ts-expect-error Server Component */}
            <NavBar />
            {children}
          </SessionProvider>
        </main>
      </body>
    </html>
  );
}

async function refreshUserToken(session: any) {
  if (!!session?.user) {
    const docRef = doc(db, 'users', (session?.user as any).id);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data();
    if (!!userData?.mal_connect) {
      const token_expire_time =
        (userData?.mal_connect as any).createDate.seconds + (userData?.mal_connect as any).expiresIn;
      const current_timestamp_seconds = Math.floor(Date.now() / 1000);
      const is_token_expired = token_expire_time - current_timestamp_seconds < 1296000; // auto recess token after 15days
      if (is_token_expired) {
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
    }
  }
}
