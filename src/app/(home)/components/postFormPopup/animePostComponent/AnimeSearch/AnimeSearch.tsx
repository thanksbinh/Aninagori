/* eslint-disable @next/next/no-img-element */
import classNames from "classnames/bind"
import { useState, useEffect, forwardRef, useImperativeHandle, FocusEvent, useContext } from "react"
import styles from "./AnimeSearch.module.scss"
import HeadlessTippy from "@tippyjs/react/headless"
import "tippy.js/dist/tippy.css"
import { faCaretDown, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { PostFormContext } from "../../../postForm/PostFormContext"
import { getTotalEps, searchAnimeName } from "./search"
const cx = classNames.bind(styles)

function AnimeSearch({ animeEpsRef }: any, ref: any) {
  const { recentAnimeList, setRecentAnimeList } = useContext(PostFormContext)

  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [animePic, setAnimePic] = useState("")
  const [animeData, setAnimeData] = useState({ animeName: "", animeID: "" })
  const [animeDataSent, setAnimeDataSent] = useState({ animeName: "", animeID: "" })
  const [resultBoxOpen, setResultBoxOpen] = useState(false)
  const debouncedValue = useDebounce(animeData.animeName, 500)

  useImperativeHandle(ref, () => ({
    getAnimeName: () => {
      return { animeName: animeDataSent.animeName, animeID: animeDataSent.animeID }
    },
    resetAnimeSearch: () => {
      setAnimeData({ ...animeData, animeName: "" })
      setAnimeDataSent({ animeName: "", animeID: "" })
      setAnimePic("")
      setLoading(false);
    }
  }))

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult(recentAnimeList)
      return
    }
    setLoading(true)

    if (animeData.animeID === "") {
      const searchAnime = async () => {
        const result = await searchAnimeName(debouncedValue)
        setSearchResult(result)
        setLoading(false)
      }
      searchAnime()
    } else {
      setLoading(false)
    }

  }, [animeData.animeID, debouncedValue])

  // set recent anime list and select the first anime as default
  useEffect(() => {
    if (!recentAnimeList.length || recentAnimeList[0].node.id == animeData.animeID) return;

    setSearchResult(recentAnimeList)
    onSelectAnime(recentAnimeList[0])
  }, [recentAnimeList])

  // update recent anime list order when select an anime
  const updateRecentAnimeList = (ele: any) => {
    if (!!(ele as any)?.list_status) {
      const index = recentAnimeList.findIndex((item: any) => item.node.id === (ele as any).node.id)
      setRecentAnimeList([recentAnimeList[index], ...recentAnimeList.slice(0, index), ...recentAnimeList.slice(index + 1)])
    } else {
      if (!!recentAnimeList[0]?.list_status && recentAnimeList[0]?.node.id !== (ele as any).node.id)
        setRecentAnimeList([ele, ...recentAnimeList])
      else
        setRecentAnimeList([ele, ...recentAnimeList.slice(1)])
    }
  }

  const onSelectAnime = async (ele: any) => {
    const animeInfo = {
      animeName: (ele as any).node.title,
      animeID: (ele as any).node.id
    }

    setAnimePic((ele as any).node.main_picture.medium)
    setAnimeData(animeInfo)
    setAnimeDataSent(animeInfo)
    setResultBoxOpen(false)

    animeEpsRef?.current?.setAnimeEpisodes((ele as any)?.list_status?.num_episodes_watched || "0")
    if ((ele as any).node.num_episodes)
      animeEpsRef?.current?.setAnimeTotal((ele as any).node.num_episodes)
    else {
      animeEpsRef?.current?.setAnimeTotal(await getTotalEps((ele as any).node.id))
    }

    updateRecentAnimeList(ele)
  }

  const inputFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
    if (recentAnimeList.length || animeData.animeName) setResultBoxOpen(true)
  }

  return (
    <HeadlessTippy
      visible={resultBoxOpen}
      onClickOutside={() => {
        setResultBoxOpen(false)
      }}
      appendTo={() => document.body}
      placement="bottom-start"
      interactive={true}
      render={() => {
        return (
          <div className={cx("result-wrapper")} ref={ref}>
            {searchResult.map((ele: any, index: number) => {
              return (
                <div
                  onClick={() => onSelectAnime(ele)}
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
            onFocus={inputFocus}
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
