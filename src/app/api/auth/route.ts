import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';
import { getCookies, getCookie, setCookie, setCookies, removeCookies } from 'cookies-next';
import { cookies } from 'next/headers';

const MYANIMELIST_CLIENT_ID = process.env.X_MAL_CLIENT_ID;
const MYANIMELIST_CLIENT_SECRET = process.env.X_MAL_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}api/auth`;

export async function GET(request: Request, { params }: { params: any }) {
  setCookie('haha', 'haha');
  const codeChallenge = generateCodeChallenge(generateCodeVerifier());
  // TODO: Luu code challenge vao google firebase 
  if (request.url === REDIRECT_URI) {
    const url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${MYANIMELIST_CLIENT_ID}&code_challenge=${codeChallenge}&state=RequestID42`;
    return NextResponse.redirect(url);
  } else {
    const oAuth2Code = request.url.split('?')[1];
    return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + '/user/LostArrow');
  }
}

export const getServerSideProps = ({ req, res }: { req: any; res: any }) => {
  setCookie('test', 'value', { req, res, maxAge: 60 * 6 * 24 });
  return { props: {} };
};

export function generateCodeVerifier() {
  const codeVerifier = generateRandomString(128);
  return codeVerifier;
}

export function generateCodeChallenge(codeVerifier: string) {
  const hashed = createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return hashed;
}

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
