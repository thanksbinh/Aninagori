import { banUser, hidePost, moveToTrash } from "./postOptions"

const guestOptions = [
  {
    name: "Turn on/off notifications for this post",
    action: ({ postId }: { postId: string }) => console.log("Turn on/off notifications for this post"),
  },
  {
    name: "Hide post",
    action: async ({ postId, username }: { postId: string; username: string }) => await hidePost(postId, username),
  },
  {
    name: "Report post",
    action: ({ postId }: { postId: string }) => console.log("Report post"),
  },
]

const authorOptions = [
  {
    name: "Turn on/off notifications for this post",
    action: ({ postId }: { postId: string }) => console.log("Turn on/off notifications for this post"),
  },
  {
    name: "Edit post",
    action: ({ setOpenEditForm }: { setOpenEditForm: any }) => {
      setOpenEditForm(true)
      if (document.documentElement.scrollTop === 0 || document.body.scrollTop === 0) {
        window.scrollBy(0, 1)
      }
      disableScroll()
    },
  },
  {
    name: "Move to trash",
    action: async ({ postId }: { postId: string }) => await moveToTrash(postId),
  },
]

const adminOptions = [
  {
    name: "Turn on/off notifications for this post",
    action: ({ postId }: { postId: string }) => console.log("Turn on/off notifications for this post"),
  },
  {
    name: "Move to trash",
    action: async ({ postId }: { postId: string }) => await moveToTrash(postId),
  },
  {
    name: "Ban this user",
    action: async ({ authorName }: { authorName?: string }) => await banUser(authorName),
  },
]

function disableScroll() {
  var TopScroll = window.pageYOffset || document.documentElement.scrollTop
  var LeftScroll = window.pageXOffset || document.documentElement.scrollLeft
  window.onscroll = function () {
    window.scrollTo(LeftScroll, TopScroll)
  }
}

function enableScroll() {
  window.onscroll = function () {}
}

export { guestOptions, authorOptions, adminOptions, disableScroll, enableScroll }
