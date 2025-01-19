'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();  

  const handleRedirect = () => {
    router.push('/bookmarks');  
  };

  const handleSignUp = () => {
    router.push('/signup');  
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        <h1 className="text-4xl font-bold mb-6">Welcome to Bookmark Tracker!</h1>
        <p className="text-lg text-gray-600 mb-4 text-center max-w-md">
          Organize, save, and access your bookmarks effortlessly. Sign in to get started!
        </p>
        <div className="space-x-4">
          <button
            onClick={() => signIn()}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  const userName = session.user?.name || session.user?.username || 'User';

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName}!</h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
        Glad to have you back! Access your bookmarks or manage your account.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handleRedirect}  
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition-all"
        >
          View Bookmarks
        </button>
        <button
          onClick={() => signOut()}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
