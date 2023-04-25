'use client'

import { get } from "@/app/api/apiServices/httpRequest";
import { generateCodeChallenge, generateCodeVerifier } from "@/app/api/auth/route";
import getProductionBaseUrl from "@/components/utils/getProductionBaseURL";
import { setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";

export default function ApplicationsSettings({ id, mal_connect }: { id: string, mal_connect: any }) {
  const onConnectMAL = async () => {
    try {
      const codeChallenge = generateCodeChallenge(generateCodeVerifier())
      setCookie("codechallenge", codeChallenge)
      const result = await get(getProductionBaseUrl() + "/api/auth", {
        headers: {
          codeChallenge: codeChallenge,
          userID: id,
        },
      })
      window.location.href = result.url
    } catch (err) {
      console.log(err)
    }
  }

  const onRemoveMAL = async () => {
    console.log("remove MAL")
  }

  return (
    <div className="w-full">
      <h2 className="text-ani-text-white font-bold text-2xl mb-4">Applications settings</h2>

      <div className="border-b-[1px] border-ani-light-gray py-4 flex items-center gap-2">
        <Image src="/MyAnimeList_Logo.png" alt="MyAnimeList_Logo" width={50} height={50} />
        <h2 className="text-ani-text-white font-bold text-2xl">MyAnimeList</h2>
      </div>
      {mal_connect ? (
        <>
          <div className="flex p-4 mb-12">
            <div className="flex-1">
              <p>Aninagori have access your MyAnimeList account</p><br />

              <p>Aninagori can:</p>
              <ul className="list-disc px-4">
                <li>See and modify basic profile information</li>
                <li>See and modify your list data</li>
                <li>Post information to MyAnimeList for you</li>
              </ul>

            </div>

            <div className="flex-1 flex justify-center">
              <Link href={`https://myanimelist.net/profile/${mal_connect.myAnimeList_username}`} target="_blank" className="flex flex-col items-center gap-2">
                <Image src="/bocchi.jpg" alt="MyAnimeList_Logo" width={100} height={100} />
                <div className="text-ani-text-white font-bold text-lg">{mal_connect.myAnimeList_username}</div>
              </Link>
            </div>
          </div>

          <button onClick={onRemoveMAL} className="my-4 py-2 px-4 rounded-md bg-blue-500 font-semibold mr-4">
            Synchronize anime list
          </button>

          <button onClick={onRemoveMAL} className="my-4 py-2 px-4 rounded-md bg-red-500 font-semibold">
            Remove MAL connection
          </button>
        </>
      ) : (
        <button onClick={onConnectMAL} className="my-4 py-2 px-4 rounded-md bg-blue-500 font-semibold">
          Connect with MAL
        </button>
      )}
    </div>
  )
}