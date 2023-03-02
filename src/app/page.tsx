import Link from 'next/link';

export default function Homes() {
  const handleSearch = () => {
    fetch('https://api.myanimelist.net/v2/anime?q=one+piece&offset=0&limit=4', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-MAL-CLIENT-ID': process.env.X_MAL_CLIENT_ID,
      } as any
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  handleSearch();

  return (
    <div>
      <Link className="text-3xl font-bold underline" href="./profile">
        Hello world!
      </Link>
      <button>Click me</button>
    </div>
  );
}
