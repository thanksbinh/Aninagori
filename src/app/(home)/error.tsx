"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex justify-center pt-4">
      <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 w-full">
        <div className="flex justify-center pt-10 h-screen">
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </div>
    </div>
  )
}
