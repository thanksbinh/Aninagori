import Link from 'next/link'; 

export default function Homes() {
  return (
    <Link href="/profile" className="text-3xl no-underline text-center w-max">
      Go To Profile
    </Link>
  );
}
