import { banUser } from "./banUser";
import { moveToTrash } from "./moveToTrash";

const guestOptions = [
  {
    name: 'Turn on/off notifications for this post',
    action: (postId: string) => console.log('Turn on/off notifications for this post'),
  },
  {
    name: 'Hide post',
    action: (postId: string) => console.log('Hide post'),
  },
  {
    name: 'Report post',
    action: (postId: string) => console.log('Report post'),
  },
];

const authorOptions = [
  {
    name: 'Turn on/off notifications for this post',
    action: (postId: string) => console.log('Turn on/off notifications for this post'),
  },
  {
    name: 'Edit post',
    action: (postId: string) => console.log('Edit post'),
  },
  {
    name: 'Move to trash',
    action: async (postId: string) => await moveToTrash(postId),
  },
];

const adminOptions = [
  {
    name: 'Turn on/off notifications for this post',
    action: (postId: string) => console.log('Turn on/off notifications for this post'),
  },
  {
    name: 'Move to trash',
    action: async (postId: string) => await moveToTrash(postId),
  },
  {
    name: 'Ban this user',
    action: async (postId: string, authorName?: string) => await banUser(authorName),
  },
];

export { guestOptions, authorOptions, adminOptions }