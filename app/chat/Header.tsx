'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, MessageCircleCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserAvatar: React.FC<{ user?: { name?: string | null; email?: string | null; image?: string | null } }> = ({ user }) => {
  if (user?.image) {
    return (
      <Image 
        src={user.image} 
        alt={user.name || 'User'} 
        width={32} 
        height={32} 
        className="rounded-full"
      />
    );
  }
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
  return (
    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
      {initials}
    </div>
  );
};

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700/80">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between w-full ">
        <div onClick={() => router.push('/')} className="flex items-center space-x-3 cursor-pointer">
          <MessageCircleCode size={28} className="text-purple-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">AIProductiv</h1>
        </div>
        
        {session?.user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserAvatar user={session.user} />
              <span className="text-sm text-gray-300 hidden md:inline">{session.user.name || session.user.email}</span>
            </div>
            <button 
              onClick={handleSignOut} 
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 