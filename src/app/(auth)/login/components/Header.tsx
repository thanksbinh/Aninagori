import Link from "next/link"

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = "#"
}: {
  heading: string,
  paragraph: string,
  linkName: string,
  linkUrl: string
}) {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <img
          alt=""
          className="h-14 w-14"
          src="favicon.ico" />
      </div>
      <h2 className="w-full mt-6 text-center text-3xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className="text-center text-sm text-gray-600 mt-5">
        {paragraph} {' '}
        <Link href={linkUrl} className="font-medium text-red-600 hover:text-red-500">
          {linkName}
        </Link>
      </p>
    </div>
  )
}