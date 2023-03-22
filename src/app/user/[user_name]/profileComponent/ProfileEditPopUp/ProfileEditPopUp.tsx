/* eslint-disable @next/next/no-img-element */
"use client"
import classNames from "classnames/bind"
import styles from "../ProfileHeader/ProfileHeader.module.scss"
import Button from "@/components/button/Button"
import { forwardRef } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase-app"
import "tippy.js/dist/tippy.css"
const cx = classNames.bind(styles)

function ProfilEditPopUp(props: any, ref: any) {
  const { setUserName, setAvatar, setWallpaper, setCloseBox, admin, userName, wallpaper, avatar } = props
  return (
    <div className={cx("modal_body")} ref={ref}>
      <h4 className={cx("edit-title")}>Edit your profile information</h4>
      <div className={cx("form-group")}>
        <h5 className={cx("form-title")}>Username: </h5>
        <input
          onChange={(e) => {
            setUserName(e.target.value)
          }}
          className={cx("form-control")}
          placeholder="Enter your display name"
        ></input>
      </div>
      <div className={cx("form-group")}>
        <h5 className={cx("form-title")}>Avatar link: </h5>
        <input
          onChange={(e) => {
            setAvatar(e.target.value)
          }}
          className={cx("form-control")}
          placeholder="Enter your avatar link"
        ></input>
      </div>
      <div className={cx("form-group")}>
        <h5 className={cx("form-title")}>Wallpaper link: </h5>
        <input
          onChange={async (e) => {
            setWallpaper(e.target.value)
          }}
          className={cx("form-control")}
          placeholder="Enter your wallpaper link"
        ></input>
      </div>
      <div className={cx("form-btn")}>
        <Button
          small
          primary
          to={undefined}
          href={undefined}
          onClick={() => {
            ref.current.classList.add(cx("Fadeout"))
            ref.current.classList.remove(cx("Fadein"))
            setTimeout(() => {
              ref.current.classList.remove(cx("Fadeout"))
              setCloseBox(true)
            }, 300)
          }}
          leftIcon={undefined}
          rightIcon={undefined}
        >
          Close
        </Button>
        <Button
          small
          primary
          to={undefined}
          href={undefined}
          onClick={async () => {
            const docRef = doc(db, "users", admin.id)
            if (userName !== "") {
              await updateDoc(docRef, {
                name: userName,
              })
            }
            if (wallpaper !== "") {
              await updateDoc(docRef, {
                wallpaper: wallpaper,
              })
            }
            if (avatar !== "") {
              await updateDoc(docRef, {
                image: avatar,
              })
            }
            if (userName !== "" || wallpaper !== "" || avatar !== "") {
              location.reload()
            } else {
              alert("Please fill up at least 1 fill :((")
            }
          }}
          leftIcon={undefined}
          rightIcon={undefined}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default forwardRef(ProfilEditPopUp)
