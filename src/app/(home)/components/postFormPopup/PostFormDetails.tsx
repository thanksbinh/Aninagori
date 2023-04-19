import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarCheck, faCalendarDays, faCaretDown, faTags, faTv } from "@fortawesome/free-solid-svg-icons"
import HeadlessTippy from "@tippyjs/react/headless"
import "tippy.js/dist/tippy.css"
import { forwardRef, useState, useImperativeHandle, useEffect, useContext } from "react"
import classNames from "classnames/bind"
import styles from "./PostFormDetails.module.scss"
import { PostFormContext } from "../postForm/PostFormContext"

const cx = classNames.bind(styles)
const nowYear = new Date().getFullYear()
const days = Array.from(Array(31).keys()).map((i) => i + 1)
const months = Array.from(Array(12).keys()).map((i) => i + 1)
const years = Array.from(Array(20).keys()).map((i) => nowYear - i)

function PostFormDetails({ animeStatusRef, isEditPost }: { animeStatusRef: any, isEditPost: any }, ref: any) {
  const { recentAnimeList } = useContext(PostFormContext)

  // Why can't this just be startDate and endDate?
  const [day, setDay] = useState({ start: 0, end: 0, openStart: false, openEnd: false })
  const [month, setMonth] = useState({ start: 0, end: 0, openStart: false, openEnd: false })
  const [year, setYear] = useState({ start: 0, end: 0, openStart: false, openEnd: false })

  const [rewatchTime, setRewatchTime] = useState("")
  const [nowTag, setNowTag] = useState("")

  // Set default values with the most recent anime (selected)
  useEffect(() => {
    const defaultStart = recentAnimeList[0]?.list_status?.start_date?.split('-')?.map((i: string) => parseInt(i))

    let thisAnimeStatus = "Watching"
    try {
      thisAnimeStatus = animeStatusRef?.getAnimeStatus()
    } catch (error) {
      // console.log(error)
    }

    // This doesn't work, because useState is async, fix this when you change timeState to normal
    // setToday("start")
    // setToday("end")

    const today = new Date()
    if (!isEditPost) {
      if (defaultStart?.length === 3 && thisAnimeStatus === "Finished") {
        setDay({ ...day, start: defaultStart[2], end: today.getDate() })
        setMonth({ ...month, start: defaultStart[1], end: today.getMonth() + 1 })
        setYear({ ...year, start: defaultStart[0], end: today.getFullYear() })
      }
      else if (defaultStart?.length === 3) {
        setDay({ ...day, start: defaultStart[2], end: 0 })
        setMonth({ ...month, start: defaultStart[1], end: 0 })
        setYear({ ...year, start: defaultStart[0], end: 0 })
      }
      else if (thisAnimeStatus === "Finished") {
        setDay({ ...day, start: today.getDate(), end: today.getDate() })
        setMonth({ ...month, start: today.getMonth() + 1, end: today.getMonth() + 1 })
        setYear({ ...year, start: today.getFullYear(), end: today.getFullYear() })
      }
      else if (thisAnimeStatus === "Watching") {
        setToday("start")
      }
      else {
        setDay({ ...day, start: 0, end: 0 })
        setMonth({ ...month, start: 0, end: 0 })
        setYear({ ...year, start: 0, end: 0 })
      }

      setRewatchTime(recentAnimeList[0]?.list_status?.num_times_rewatched?.toString())
      setNowTag(recentAnimeList[0]?.list_status?.tags?.join(', ') || "")
    }
  }, [recentAnimeList, animeStatusRef])

  function setToday(type: string) {
    const today = new Date()
    if (type === "start") {
      setDay({ ...day, start: today.getDate() })
      setMonth({ ...month, start: today.getMonth() + 1 })
      setYear({ ...year, start: today.getFullYear() })
    } else {
      setDay({ ...day, end: today.getDate() })
      setMonth({ ...month, end: today.getMonth() + 1 })
      setYear({ ...year, end: today.getFullYear() })
    }
  }

  function handleInputTag(e: any) {
    setNowTag(e.target.value)
  }

  useImperativeHandle(ref, () => ({
    getStartDate: () => {
      if (day.start === 0 || month.start === 0 || year.start === 0) return ""
      const checkStartDate = new Date(year.start, month.start - 1, day.start)
      // check if checkStartDate is greater than today
      if (checkStartDate > new Date()) return { error: "You can't time travel and watch, please adjust date 😭" }
      return `${year.start}-${checkStartDate.getMonth() + 1 < 10 ? "0" : ""}${checkStartDate.getMonth() + 1}-${checkStartDate.getDate() < 10 ? "0" : ""
        }${checkStartDate.getDate()}`
    },
    getEndDate: () => {
      if (day.end === 0 || month.end === 0 || year.end === 0) return ""
      const checkStartDate = new Date(year.end, month.end - 1, day.end)
      // check if checkStartDate is greater than today
      if (checkStartDate > new Date()) return { error: "You can't time travel and watch, please adjust date 😭" }
      return `${year.end}-${checkStartDate.getMonth() + 1 < 10 ? "0" : ""}${checkStartDate.getMonth() + 1}-${checkStartDate.getDate() < 10 ? "0" : ""
        }${checkStartDate.getDate()}`
    },
    getRewatchTime: () => {
      return rewatchTime
    },
    getAnimeTag: () => {
      const animeTagArray = nowTag.split(",");
      const newArray = animeTagArray.map((e: any) => {
        return e.trim()
      }).filter((e: any) => e !== "")
      return newArray
    },
    resetAdditionalPost: () => {
      setNowTag("")
      setRewatchTime("");
      setDay({ start: 0, end: 0, openStart: false, openEnd: false })
      setMonth({ start: 0, end: 0, openStart: false, openEnd: false })
      setYear({ start: 0, end: 0, openStart: false, openEnd: false })
    },
    setData: (animeData: any) => {

      if (!!animeData?.list_status?.start_date) {
        const dateStartArray = animeData?.list_status?.start_date.split("-").map((i: string) => parseInt(i))
        setDay({ ...day, start: dateStartArray[2] })
        setMonth({ ...month, start: dateStartArray[1] })
        setYear({ ...year, start: dateStartArray[0] })
      } else {
        setDay({ ...day, start: 0 })
        setMonth({ ...month, start: 0 })
        setYear({ ...year, start: 0 })
      }
      if (!!animeData?.list_status?.finish_date) {
        const dateEndArray = animeData?.list_status?.finish_date.split("-").map((i: string) => parseInt(i))
        setDay((prev) => ({ ...prev, end: dateEndArray[2] }))
        setMonth((prev) => ({ ...prev, end: dateEndArray[1] }))
        setYear((prev) => ({ ...prev, end: dateEndArray[0] }))
      } else {
        setDay((prev) => ({ ...prev, end: 0 }))
        setMonth((prev) => ({ ...prev, end: 0 }))
        setYear((prev) => ({ ...prev, end: 0 }))
      }
      if (!!animeData?.list_status?.tags) {
        setNowTag(animeData?.list_status?.tags.join(", "))
      }
      if (!!animeData?.list_status?.num_times_rewatched) {
        setRewatchTime(animeData?.list_status?.num_times_rewatched.toString())
      }
    },
  }))

  return (
    <div ref={ref} className={`flex-col`}>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center min-w-[142px]">
          <FontAwesomeIcon icon={faCalendarDays} className="text-blue-400 text-2xl mx-3" />
          <p className="font-semibold text-sm">Start Date</p>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ChooseDate data={day} setData={setDay} type={"Day"} progress="start" />
          <ChooseDate data={month} setData={setMonth} type={"Month"} progress="start" />
          <ChooseDate data={year} setData={setYear} type={"Year"} progress="start" />
          <p
            onClick={() => {
              setToday("start")
            }}
            className="ml-4 underline text-green-400 text-xs cursor-pointer"
          >
            Insert Today
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center min-w-[142px]">
          <FontAwesomeIcon icon={faCalendarCheck} className="text-green-500 text-2xl mx-3" />
          <p className="font-semibold text-sm">Finish Date</p>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ChooseDate data={day} setData={setDay} type={"Day"} progress="finish" />
          <ChooseDate data={month} setData={setMonth} type={"Month"} progress="finish" />
          <ChooseDate data={year} setData={setYear} type={"Year"} progress="finish" />
          <p
            onClick={() => {
              setToday("finish")
            }}
            className="ml-4 underline text-green-400 text-xs cursor-pointer"
          >
            Insert Today
          </p>
        </div>
      </div>
      <div className="flex items-center my-4 min-w-[145px]">
        <FontAwesomeIcon icon={faTv} className="text-yellow-500 text-xl ml-3 mr-2" />
        <p className="font-semibold text-sm mr-4">Re-watching</p>
        <div className="flex-1 flex justify-center items-center mr-8">
          <p className="text-sm mr-3">Total: </p>
          <input
            type="text"
            className="w-[77px] h-10 rounded-lg bg-[#4e5d78] text-white text-center outline-none"
            value={rewatchTime}
            onChange={(e) => {
              const regex = /^\d+$/
              if ((regex.test(e.target.value) && parseInt(e.target.value) <= 255) || e.target.value === "") {
                setRewatchTime(e.target.value)
              }
            }}
          />
          <p className="text-sm ml-3">times</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 mb-4">
        <div className="flex items-center min-w-[145px]">
          <FontAwesomeIcon icon={faTags} className="text-red-500 text-2xl ml-3 mr-2" />
          <p className="font-semibold text-sm">Anime Tags</p>
        </div>
        <div className="flex flex-1 justify-center">
          <div className={cx("container")}>
            <div className={cx("input-tag-wrapper")}>
              <div className={cx("input-text-wrapper")}>
                <input
                  placeholder='Each tag follow by ","'
                  value={nowTag}
                  onChange={handleInputTag}
                  type="text"
                  className={cx("input-text")}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(PostFormDetails)

function ChooseDate({ data, setData, type, progress }: { data: any; setData: any; type: string; progress: string }) {
  var choiceData = days
  if (type === "Month") {
    choiceData = months
  } else if (type === "Year") {
    choiceData = years
  }

  return (
    <>
      <p className="text-sm mx-3">{type}: </p>
      <HeadlessTippy
        visible={progress === "start" ? data.openStart : data.openEnd}
        appendTo={() => document.body}
        onClickOutside={() => {
          setData(progress === "start" ? { ...data, openStart: false } : { ...data, openEnd: false })
        }}
        interactive={true}
        placement="bottom-start"
        render={() => {
          return (
            <div className="max-h-72 overflow-y-scroll rounded-lg">
              {choiceData.map((dataChild) => (
                <div
                  key={dataChild}
                  onClick={() => {
                    setData(
                      progress === "start"
                        ? { ...data, start: dataChild, openStart: false }
                        : { ...data, end: dataChild, openEnd: false },
                    )
                  }}
                  className="cursor-pointer px-8 py-2 bg-[#4e5d78] hover:bg-[#22427e] text-center"
                >
                  {dataChild}
                </div>
              ))}
            </div>
          )
        }}
      >
        <div
          className={`${type === "Year" ? "w-[100px]" : "w-[83px]"
            } relative cursor-pointer px-8 py-2 rounded-lg bg-[#4e5d78] text-center`}
          onClick={() => {
            setData(
              progress === "start" ? { ...data, openStart: !data.openStart } : { ...data, openEnd: !data.openEnd },
            )
          }}
        >
          <p
            style={
              (data.start === 0 && progress === "start") || (data.end === 0 && progress === "finish")
                ? { color: "#4e5d78" }
                : { color: "white" }
            }
          >
            {progress === "start" ? data.start : data.end}
          </p>
          <FontAwesomeIcon icon={faCaretDown} className="absolute right-2 top-2 text-xl" />
        </div>
      </HeadlessTippy>
    </>
  )
}
