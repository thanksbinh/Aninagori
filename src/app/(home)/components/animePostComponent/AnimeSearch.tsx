/* eslint-disable @next/next/no-img-element */
import classNames from "classnames/bind"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import styles from "./AnimeSearch.module.scss"
import HeadlessTippy from "@tippyjs/react/headless"
import "tippy.js/dist/tippy.css"
import { get } from "@/app/api/apiServices/httpRequest"
import { faCaretDown, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
const cx = classNames.bind(styles)

function AnimeSearch(props: any, ref: any) {
  const { animeEpsRef } = props
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [animePic, setAnimepic] = useState("")
  const [animeData, setAnimeData] = useState({ animeName: "", animeID: "" })
  const [animeDataSent, setAnimeDataSent] = useState({ animeName: "", animeID: "" })
  const [resultBoxOpen, setResultBoxOpen] = useState(false)
  const debouncedValue = useDebounce(animeData.animeName, 500)

  useImperativeHandle(ref, () => ({
    getAnimeName: () => {
      return { animeName: animeDataSent.animeName, animeID: animeDataSent.animeID }
    },
  }))

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([])
      return
    }
    setLoading(true)
    const searchAnimeName = async () => {
      try {
        const result = await get("api/anime/search", {
          headers: {
            q: debouncedValue,
            offset: "0",
            limit: "10",
          },
        })
        if (!!result.error) {
          setSearchResult([])
        } else {
          setSearchResult(result.data)
          setResultBoxOpen(true)
        }
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    if (animeData.animeID === "") {
      searchAnimeName()
    } else {
      setLoading(false)
    }
  }, [animeData.animeID, debouncedValue])

  return (
    <HeadlessTippy
      visible={searchResult.length !== 0 && resultBoxOpen}
      onClickOutside={() => {
        setResultBoxOpen(false)
      }}
      appendTo={() => document.body}
      placement="bottom-start"
      interactive={true}
      render={() => {
        return (
          <div className={cx("result-wrapper")} ref={ref}>
            {searchResult.map((ele, index) => {
              return (
                <div
                  onClick={async () => {
                    setAnimepic((ele as any).node.main_picture.medium)
                    setAnimeData({ animeName: (ele as any).node.title, animeID: (ele as any).node.id })
                    setAnimeDataSent({ animeName: (ele as any).node.title, animeID: (ele as any).node.id })
                    setResultBoxOpen(false)
                    animeEpsRef?.current.setAnimeTotal((ele as any).node.num_episodes)
                    if (parseInt(animeEpsRef?.current.getAnimeEpisodes()) > (ele as any).node.num_episodes) {
                      animeEpsRef?.current.setAnimeEpisodes("0")
                    }
                  }}
                  key={index}
                  className={cx("result-children")}
                >
                  <img alt="anime-name" src={(ele as any).node.main_picture.medium}></img>
                  <div>
                    <p>{(ele as any).node.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }}
    >
      <div className={cx("anime-search-wrapper")}>
        <div>
          <input
            value={animeData.animeName}
            placeholder="Search anime name"
            onChange={(e) => {
              const regex = /^\S/
              if (regex.test(e.target.value)) {
                setAnimeData({ ...animeData, animeName: e.target.value })
              } else {
                setAnimeData({ ...animeData, animeName: "" })
              }
            }}
            onKeyDown={(e) => {
              setAnimeData({ ...animeData, animeID: "" })
            }}
          ></input>
        </div>
        {!loading ? (
          <FontAwesomeIcon
            onClick={() => {
              setResultBoxOpen(!resultBoxOpen)
            }}
            className={cx("down-icon")}
            icon={faCaretDown as any}
          ></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon className={cx("loading-icon")} icon={faSpinner as any}></FontAwesomeIcon>
        )}
        <img
          className={cx("anime-preview")}
          src={animePic !== "" ? animePic : "https://static.thenounproject.com/png/660317-200.png"}
          alt="anime-preview"
        ></img>
      </div>
    </HeadlessTippy>
  )
}

function useDebounce(value: any, delay: any) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return debouncedValue
}

export default forwardRef(AnimeSearch)
