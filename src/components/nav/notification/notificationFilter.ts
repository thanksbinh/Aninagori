import { Notification } from "./Notification.types"

export function noticationFilter(notiArray: Notification[]) {
  const sortedArray = notiArray.sort((a: any, b: any) => a.timestamp - b.timestamp)

  const notiMap = new Map()
  const filteredArray = []
  for (let i = 0; i < sortedArray.length; i++) {
    if (sortedArray[i].type != "reaction") {
      filteredArray.push(sortedArray[i])
      continue
    }

    if (notiMap.has(sortedArray[i].url) && notiMap.get(sortedArray[i].url).some((noti: Notification) => noti.sender.username === sortedArray[i].sender.username)) {
      continue
    } else if (notiMap.has(sortedArray[i].url)) {
      notiMap.set(sortedArray[i].url, [...notiMap.get(sortedArray[i].url), sortedArray[i]])
    } else {
      notiMap.set(sortedArray[i].url, [sortedArray[i]])
    }
  }

  notiMap.forEach((value: Notification[], key) => {
    if (value.length == 1) {
      filteredArray.push(value[0])
    } else if (value.length >= 2) {
      const newNoti = {
        title: value[0].title.replace(value[0].sender.username, value[value.length - 1].sender.username + " and " + (value.length == 2 ? value[0].sender.username : (value.length - 1) + " others")),
        url: value[0].url,
        sender: {
          username: value[value.length - 1].sender.username,
          image: value[value.length - 1].sender.image,
        },
        type: "reaction",
        timestamp: value[value.length - 1].timestamp,
      }
      filteredArray.push(newNoti)
    }
  })

  return filteredArray.sort((a: any, b: any) => b.timestamp - a.timestamp)
}