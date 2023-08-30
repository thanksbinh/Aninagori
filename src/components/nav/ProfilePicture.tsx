'use client'

import { useFirebaseSession } from '@/app/SessionProvider';
import { auth } from '@/firebase/firebase-app';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { UserInfo } from "../../global/UserInfo.types";
import UsernamePopup from '../utils/UsernamePopup';
import { signOut as firebaseSignOut } from "firebase/auth";
import Avatar from '../avatar/Avatar';

interface Props {
	myUserInfo: UserInfo | undefined
}

const ProfilePicture: React.FC<Props> = ({ myUserInfo }) => {
	const session = useFirebaseSession();
	const ref = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [openUsernamePopup, setOpenUsernamePopup] = useState(false)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (myUserInfo?.username === "guess")
			setOpenUsernamePopup(true)
	}, [myUserInfo])

	const handleLogout = async () => {
		try {
			setIsOpen(false);
			await firebaseSignOut(auth);
			await signOut();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div ref={ref} className='flex-shrink-0 h-[40px]'>
			<button onClick={() => setIsOpen(!isOpen)}>
				<Avatar imageUrl={myUserInfo?.image || '/bocchi.jpg'} altText="My profile" size={10} />
			</button>
			{isOpen &&
				<div className="absolute top-14 right-8 z-40 w-56 py-2 bg-ani-gray rounded-md shadow-lg">
					{myUserInfo?.username === "guess" ?
						<button onClick={() => setOpenUsernamePopup(true)} className="px-4 py-2 text-ani-text-white hover:bg-slate-50/25 w-full text-left">Set username</button> :
						<div className="px-4 py-2 text-ani-text-white">{myUserInfo?.username}</div>
					}
					<div className="border-t border-gray-700"></div>

					<Link
						href={`/user/${myUserInfo?.username}`}
						onClick={() => setIsOpen(false)}
						className="block px-4 py-2 text-ani-text-white hover:bg-slate-50/25 w-full text-left rounded-md"
					>
						View Profile
					</Link>

					<Link
						href={`/settings?tab=account`}
						onClick={() => setIsOpen(false)}
						className="block px-4 py-2 text-ani-text-white hover:bg-slate-50/25 w-full text-left rounded-md"
					>
						Settings
					</Link>

					<button
						onClick={handleLogout}
						className="block px-4 py-2 text-ani-text-white hover:bg-slate-50/25 w-full text-left rounded-md"
					>
						Logout
					</button>
				</div>
			}
			{openUsernamePopup &&
				<UsernamePopup
					isOpen={openUsernamePopup}
					onClose={() => setOpenUsernamePopup(false)}
					session={session}
				/>
			}
		</div>
	);
};

export default ProfilePicture;