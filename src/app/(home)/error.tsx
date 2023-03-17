'use client';

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div className='flex justify-center pt-10 h-screen'>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
