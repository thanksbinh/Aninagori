'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex">
      <div className="hidden sm:block w-[360px] h-screen py-20 px-2 bg-ani-gray border-r-[1px] border-ani-light-gray">

      </div>

      <div className="flex-1 pt-20 mx-14">
        <div className="flex justify-center pt-10 h-screen">
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </div>
    </div>
  )
}
