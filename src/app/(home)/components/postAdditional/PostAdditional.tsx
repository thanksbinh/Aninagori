import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarCheck, faCalendarDays, faCaretDown, faTv } from "@fortawesome/free-solid-svg-icons"
import HeadlessTippy from "@tippyjs/react/headless"
import "tippy.js/dist/tippy.css"
import { useState } from "react"

const nowYear = new Date().getFullYear()
const days = Array.from(Array(31).keys()).map((i) => i + 1)
const months = Array.from(Array(12).keys()).map((i) => i + 1)
const years = Array.from(Array(20).keys()).map((i) => nowYear - i)

function PostAdditional({ className }: { className: string }) {
  const [day, setDay] = useState({ start: 0, end: 0, openStart: false, openEnd: false })
  const [month, setMonth] = useState({ start: 0, end: 0, openStart: false, openEnd: false })
  const [year, setYear] = useState({ start: 0, end: 0, openStart: false, openEnd: false })
  const [rewatchTime, setRewatchTime] = useState("")

  return (
    <div className={`${className} mt-2 flex-col`}>
      <div className="flex items-center justify-between my-6">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendarDays} className="text-blue-400 text-2xl mx-3" />
          <p className="font-semibold text-lg mr-4">Start Date</p>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ChooseDate data={day} setData={setDay} type={"Day"} progress="start" />
          <ChooseDate data={month} setData={setMonth} type={"Month"} progress="start" />
          <ChooseDate data={year} setData={setYear} type={"Year"} progress="start" />
        </div>
      </div>
      <div className="flex items-center justify-between my-6">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendarCheck} className="text-green-500 text-2xl mx-3" />
          <p className="font-semibold text-lg mr-4">Finish Date</p>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ChooseDate data={day} setData={setDay} type={"Day"} progress="finish" />
          <ChooseDate data={month} setData={setMonth} type={"Month"} progress="finish" />
          <ChooseDate data={year} setData={setYear} type={"Year"} progress="finish" />
        </div>
      </div>
      <div className="flex items-center my-6">
        <FontAwesomeIcon icon={faTv} className="text-yellow-500 text-xl ml-3 mr-2" />
        <p className="font-semibold text-lg mr-4">Re-watching</p>
        <div className="ml-[28px] flex items-center">
          <p className="text-base mr-3">Total: </p>
          <input
            type="text"
            className="w-[84px] h-10 rounded-lg bg-[#4e5d78] text-white text-center outline-none"
            value={rewatchTime}
            onChange={(e) => {
              const regex = /^\d+$/;
              if (regex.test(e.target.value) && parseInt(e.target.value) <= 255 || e.target.value === "") {
                setRewatchTime(e.target.value)
              }
            }}
          />
          <p className="text-base ml-3">times</p>
        </div>
      </div>
    </div>
  )
}

function ChooseDate({ data, setData, type, progress }: { data: any; setData: any; type: string; progress: string }) {
  var choiceData = days
  if (type === "Month") {
    choiceData = months
  } else if (type === "Year") {
    choiceData = years
  }

  return (
    <>
      <p className="text-base mx-3">{type}: </p>
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
          className={`${type === "Year" ? "w-[100px]" : "w-[83px]"} relative cursor-pointer px-8 py-2 rounded-lg bg-[#4e5d78] text-center`}
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

export default PostAdditional
