/* eslint-disable @next/next/no-img-element */
'use client';

export default function MyAnimeList({ animeList }) {
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">MyAnimeList Lastest Update</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animeList.map((anime) => (
            <div key={anime.entry.mal_id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="flex justify-center py-4">
                <img className="h-40 object-contain" src={anime.entry.images.jpg.image_url} alt={anime.entry.title} />
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">{anime.entry.title}</h3>
                <div className="text-sm leading-5 text-gray-500 mb-4">
                  <a
                    href={anime.entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-700"
                  >
                    MyAnimeList Page
                  </a>
                </div>
                <div className="text-base font-bold text-gray-900 mb-2">
                  Status: <span className="text-gray-700">{anime.status}</span>
                </div>
                <div className="text-base font-bold text-gray-900 mb-2">
                  Score: <span className="text-gray-700">{anime.score}/10</span>
                </div>
                <div className="text-base font-bold text-gray-900 mb-2">
                  Episodes Seen: <span className="text-gray-700">{anime.episodes_seen}</span>
                </div>
                <div className="text-base font-bold text-gray-900 mb-2">
                  Total Episodes: <span className="text-gray-700">{anime.episodes_total}</span>
                </div>
                <div className="text-base font-bold text-gray-900 mb-2">
                  Date: <span className="text-gray-700">{anime.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
