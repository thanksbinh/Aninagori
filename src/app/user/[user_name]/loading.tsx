import classNames from "classnames/bind"
import styles from "./Profile.module.scss"

const cx = classNames.bind(styles)

export default function loading() {
  return (
    <div className='bg-ani-black w-full flex justify-center mt-14'>
      <div className='w-[81%] xl-max:w-full'>
        <div className="h-screen">Loading...</div>
      </div>
    </div>
  )
}
