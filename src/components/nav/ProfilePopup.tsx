import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ProfilePopup: React.FC<Props> = ({ isOpen, onClose }) => {
    const { data: session } = useSession();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-14 right-1 z-50 w-56 py-2 mt-1 bg-white rounded-md shadow-lg">
            <div className="px-4 py-2 text-gray-800">{session?.user?.email}</div>
            <div className="border-t border-gray-100"></div>
            <Link
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                href="/profile"
            >
                View Profile
            </Link>
            <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default ProfilePopup;