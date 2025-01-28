'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const cookies = document.cookie;
      setIsLoggedIn(cookies.includes('auth-token'));
    };

    checkLoginStatus();
    // ログアウト後の状態更新のため、イベントリスナーを追加
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    window.location.href = '/';
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center text-gray-800">
            Quiz App
          </Link>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/quiz" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Quiz
                </Link>
                <Link 
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
              
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}