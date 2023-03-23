import { Notification } from "./Notification.types"

// Todo: Optimization
export function noticationFilter(notiArray: Notification[]) {
  const sortedArray = notiArray.sort((a: any, b: any) => b.timestamp - a.timestamp)

  const notiMap = new Map()
  const filteredArray = [] as any
  sortedArray.forEach((thisNoti: Notification) => {
    let url = ""
    if (thisNoti.type === "reaction") {
      url = thisNoti.url + "/type=reaction"
    }
    else if (thisNoti.type === "comment reply") {
      url = thisNoti.url + "/type=comment_reply"
    }
    else if (thisNoti.type === "post comment") {
      url = thisNoti.url.split("/comment/")[0] + "/type=post_comment"
    }
    else if (thisNoti.type === "comment mention") {
      // Gộp các thông báo của cùng 1 người
      url = thisNoti.url + "/type=comment_mention/user/" + thisNoti.sender.username
    }

    if (notiMap.has(url) && notiMap.get(url).some((noti: Notification) => noti.sender.username === thisNoti.sender.username)) {

    } else if (notiMap.has(url)) {
      notiMap.set(url, [...notiMap.get(url), thisNoti])
    } else {
      notiMap.set(url, [thisNoti])
    }
  })

  notiMap.forEach((value: Notification[], key) => {
    if (value.length == 1) {
      filteredArray.push(value[0])
    } else if (value.length >= 2) {
      const newNoti = {
        title: value[0].title.replace(value[0].sender.username, value[0].sender.username + " and " + (value.length == 2 ? value[value.length - 1].sender.username : (value.length - 1) + " others")),
        url: value[0].url,
        sender: {
          username: value[0].sender.username,
          image: value[0].sender.image,
        },
        type: value[0].type,
        timestamp: value[0].timestamp,
      }
      filteredArray.push(newNoti)
    }
  })

  return filteredArray.sort((a: any, b: any) => b.timestamp - a.timestamp)
}