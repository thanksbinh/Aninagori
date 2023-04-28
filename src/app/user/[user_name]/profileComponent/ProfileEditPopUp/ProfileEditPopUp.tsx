/* eslint-disable @next/next/no-img-element */
"use client"
import classNames from "classnames/bind"
import styles from "../ProfileHeader/ProfileHeader.module.scss"
import Button from "@/components/button/Button"
import { forwardRef } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase-app"
import "tippy.js/dist/tippy.css"
import { updateAvatarUrl } from "./updateAvatarUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileSignature, faImage, faUser } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/navigation"
const cx = classNames.bind(styles)

function ProfilEditPopUp(props: any, ref: any) {
  const { setUserName, setAvatar, setWallpaper, setCloseBox, admin, userName, wallpaper, avatar } = props
  const router = useRouter()
  return (
    <div className={cx("modal_body")} ref={ref}>
      <h4 className={cx("edit-title")}>Edit your profile information</h4>
      <div className={cx("form-group")}>
        <div className="flex max-w-[150px] min-w-[150px]">
          <FontAwesomeIcon icon={faFileSignature} className='text-yellow-400 text-xl mr-2 min-w-[22.5px]' />
          <h5 className={cx("form-title")}>Username: </h5>
        </div>
        <input
          onChange={(e) => {
            setUserName(e.target.value)
          }}
          className={cx("form-control")}
          placeholder="Enter your display name"
        ></input>
      </div>
      <div className={cx("form-group")}>
        <div className="flex max-w-[150px] min-w-[150px]">
          <FontAwesomeIcon icon={faUser} className='text-green-500 text-xl mr-2 min-w-[22.5px]' />
          <h5 className={cx("form-title")}>Avatar link: </h5>
        </div>
        <input
          onChange={(e) => {
            setAvatar(e.target.value)
          }}
          className={cx("form-control")}
          placeholder="Enter your avatar link"
        ></input>
      </div>
      <div className={cx("form-group")}>
        <div className="flex max-w-[150px] min-w-[150px]">
          <FontAwesomeIcon icon={faImage} className='text-blue-500 text-xl mr-2 min-w-[22.5px]' />
          <h5 className={cx("form-title")}>Wallpaper link: </h5>
        </div>
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
              await updateAvatarUrl(admin.id, avatar)
            }
            if (userName !== "" || wallpaper !== "" || avatar !== "") {
              router.refresh();
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
