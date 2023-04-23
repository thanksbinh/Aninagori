/* eslint-disable @next/next/no-img-element */
"use client"
import { useFirebaseSession } from "@/app/SessionProvider"
import { get } from "@/app/api/apiServices/httpRequest"
import { generateCodeChallenge, generateCodeVerifier } from "@/app/api/auth/route"
import Button from "@/components/button/Button"
import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
import { db } from "@/firebase/firebase-app"
import { faCheck, faImage, faPenToSquare, faPlug } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Tippy from "@tippyjs/react"
import classNames from "classnames/bind"
import { setCookie } from "cookies-next"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import "tippy.js/dist/tippy.css"
import ProfilEditPopUp from "../ProfileEditPopUp/ProfileEditPopUp"
import AddFriendBtn from "./AddFriendBtn"
import styles from "./ProfileHeader.module.scss"

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
  const { data: session } = useFirebaseSession()
  const [closeBox, setCloseBox] = useState(true)

  useEffect(() => {
    setCookie("username", admin.username)
    setCookie("userID", admin.id)
  }, [admin.id, admin.username])

  return (
    <div className={cx("wrapper")}>
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
          className={cx("change-wallpaper")}
        >
          Change your wallpaper
        </Button>
      )}
      {open && (
        <div className="px-2 absolute bottom-1/4 right-3 z-10 rounded-2xl overflow-hidden">
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
      <div className={cx("user-display")}>
        <div className={cx("avatar-wrapper")}>
          <img
            src={guess.image || "/bocchi.jpg"}
            alt="avatar"
            className={cx("avatar")}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = "/bocchi.jpg"
            }}
          ></img>
          <div className={cx("user-information")}>
            <strong className={cx("user-name")}>{guess.name || guess.username}</strong>
            {!!guess.friend_list ? (
              <>
                <div className={cx("friends-count")}>
                  <span>{guess.friend_list.length}</span> friends
                </div>
                <div className={cx("friends-information")}>
                  {guess.friend_list.map((data, index) => {
                    if (index < 5) {
                      return (
                        <Tippy placement="bottom" key={index} content={data.username} delay={[250, 0]}>
                          <img
                            key={index}
                            src={data.image || "/bocchi.jpg"}
                            alt="avatar"
                            className={cx("friends-avatar")}
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
                onClick={() => { }}
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
