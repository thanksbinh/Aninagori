import { Navbar, Post , Sidebar} from '../components'; 

export default function Home() {
  return (
    <div className="flex item-center justify-between">
      <Sidebar />
      <div className="flex flex-col">
        <Post
          authorName={'Nichan'}
          avatarUrl={''}
          time={'March 1, 2023 at 2:30pm'}
          content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          imageUrl={'/Konosuba.jpg'}
          likes={10}
          comments={10}
        />
      </div>
      <Sidebar />
    </div>
  )
}
