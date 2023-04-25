/* eslint-disable @next/next/no-img-element */
"use client"
import classNames from "classnames/bind"
import styles from "./ProfileHeader.module.scss"
import Button from "@/components/button/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faImage, faPenToSquare, faPlug } from "@fortawesome/free-solid-svg-icons"
import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase-app"
import AddFriendBtn from "./AddFriendBtn"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { get } from "@/app/api/apiServices/httpRequest"
import { generateCodeChallenge, generateCodeVerifier } from "@/app/api/auth/route"
import { setCookie } from "cookies-next"
import ProfilEditPopUp from "../ProfileEditPopUp/ProfileEditPopUp"
import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"

const cx = classNames.bind(styles)

function ProfileHeader({ guess, admin }) {
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState("")
  const [load, setLoad] = useState(true)
  const [userName, setUserName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [wallpaper, setWallpaper] = useState("")
  const [currentImage, setCurrentImage] = useState("/wallpaper.png")
  const editBox = useRef()
  const editBoxWrapper = useRef()
  const { data: session } = useSession()
  const [closeBox, setCloseBox] = useState(true)

  useEffect(() => {
    setCookie("username", admin.username)
    setCookie("userID", admin.id)
  }, [admin.id, admin.username])

  return (
    <div className="flex flex-col item-center relative">
      <div
        className={cx("modal", {
          hidden: closeBox,
          flex: !closeBox,
        })}
        ref={editBoxWrapper}
      >
        <div className={cx("modal_overlay")}></div>
        <ProfilEditPopUp
          ref={editBox}
          setUserName={setUserName}
          setAvatar={setAvatar}
          setWallpaper={setWallpaper}
          setCloseBox={setCloseBox}
          admin={admin}
          userName={userName}
          wallpaper={wallpaper}
          avatar={avatar}
        />
      </div>
      <div className="relative">
        <img
          src={guess.wallpaper || currentImage}
          alt="wallpaper"
          className={cx("wallpaper")}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = "/wallpaper.png"
          }}
          onLoad={() => {
            setLoad(false)
          }}
          width={1044}
          height={281}
        ></img>
        {admin.username === guess.username && (
          <Button
            onClick={() => {
              setOpen(!open)
            }}
            leftIcon={<FontAwesomeIcon icon={faImage} />}
            small
            primary
            className="absolute bottom-[12%] right-5 !text-black bg-white opacity-70 outline-none border-none md-max:bottom-[40%]"
          >
            Change your wallpaper
          </Button>
        )}
      </div>
      {open && (
        <div className="px-2 absolute bottom-24 right-3 z-10 rounded-2xl overflow-hidden">
          <input
            type="text"
            className="border border-gray-300 py-2 px-4 w-64 text-black outline-none"
            placeholder="Enter wallpaper link here"
            onChange={(e) => {
              setLink(e.target.value)
            }}
            value={link}
          />
          <button
            onClick={async () => {
              if (!load) {
                setCurrentImage(link)
                const docRef = doc(db, "users", admin.id)
                if (link !== "") {
                  await updateDoc(docRef, {
                    wallpaper: link,
                  })
                  setLink("")
                  location.reload()
                }
              }
            }}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
          >
            Save
          </button>
        </div>
      )}
      <div className="w-full h-[120px] pr-5 pl-[30px] flex justify-end relative md-max:h-64 md-max:flex-col">
        <div className="absolute flex flex-row left-9 -top-9 md-max:flex-col md-max:items-center md-max:left-0 md-max:-top-24 md-max:w-full">
          <img
            src={guess.image || "/bocchi.jpg"}
            alt="avatar"
            className="w-[160px] h-[160px] rounded-full object-cover border-4 border-solid border-ani-black mr-[14px] md-max:w-[180px] md-max:h-[180px] md-max:mr-0 md-max:mb-2"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = "/bocchi.jpg"
            }}
          ></img>
          <div className="flex flex-col justify-end pb-[10px] md-max:items-center">
            <strong className="text-2xl md-max:text-3xl">{guess.name || guess.username}</strong>
            {!!guess.friend_list ? (
              <>
                <div className="text-base text-[#b19898] font-normal mb-1 md-max:font-xl md-max:font-bold">
                  <span>{guess.friend_list.length}</span> friends
                </div>
                <div className="flex items-center">
                  {guess.friend_list.map((data, index) => {
                    if (index < 5) {
                      return (
                        <Tippy placement="bottom" key={index} content={data.username} delay={[250, 0]}>
                          <img
                            key={index}
                            src={data.image || "/bocchi.jpg"}
                            alt="avatar"
                            className={cx("friends-avatar") + " w-8 h-8 rounded-full object-cover"}
                            onClick={() => {
                              window.location.href = getProductionBaseUrl() + "/user/" + data.username
                            }}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null
                              currentTarget.src = "/bocchi.jpg"
                            }}
                          ></img>
                        </Tippy>
                      )
                    }
                  })}
                </div>
              </>
            ) : (
              <>
                <div className={cx("friends-count")}>
                  <span>Only 1</span> friend
                </div>
                <div className={cx("friends-information")}>
                  <img
                    src={guess.image}
                    alt="avatar"
                    className={cx("friends-avatar")}
                    onClick={() => {
                      window.location.href = getProductionBaseUrl() + "/user/" + guess.username
                    }}
                  ></img>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={cx("profile-interact")}>
          {admin.username === guess.username ? (
            <>
              <Button
                onClick={async () => {
                  if (!!!guess?.mal_connect?.myAnimeList_username) {
                    try {
                      const codeChallenge = generateCodeChallenge(generateCodeVerifier())
                      setCookie("codechallenge", codeChallenge)
                      const result = await get(getProductionBaseUrl() + "/api/auth", {
                        headers: {
                          codeChallenge: codeChallenge,
                          userID: session.user?.id,
                        },
                      })
                      window.location.href = result.url
                    } catch (err) {
                      console.log(err)
                    }
                  }
                }}
                small
                gradient
                leftIcon={
                  guess?.mal_connect?.myAnimeList_username ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faPlug} />
                  )
                }
              >
                {guess?.mal_connect?.myAnimeList_username ? "Connected with MAL" : "Connect with MAL"}
              </Button>
              <Button
                onClick={() => {
                  editBox.current.classList.add(cx("Fadein"))
                  setCloseBox(false)
                }}
                small
                primary
                leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
              >
                Edit profile
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {}}
                small
                gradient
                href={
                  guess?.mal_connect?.myAnimeList_username
                    ? "https://myanimelist.net/profile/" + guess?.mal_connect?.myAnimeList_username
                    : false
                }
                target="_blank"
                leftIcon={<FontAwesomeIcon icon={faPlug} />}
              >
                {guess?.mal_connect?.myAnimeList_username ? "Visit MAL profile" : "....Feature"}
              </Button>
              <AddFriendBtn myUserInfo={admin} userInfo={guess}>
                {" "}
                Button{" "}
              </AddFriendBtn>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
