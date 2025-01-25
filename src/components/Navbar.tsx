// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
 return (
   <nav className="bg-white shadow">
     <div className="max-w-7xl mx-auto px-4">
       <div className="flex justify-between h-16">
         <div className="flex">
           <Link href="/" className="flex items-center text-gray-800">
             Quiz App
           </Link>
         </div>
         <div className="flex items-center space-x-4">
           <Link 
             href="/auth/login"
             className="text-gray-600 hover:text-gray-900"
           >
             Login
           </Link>
           <Link 
             href="/auth/register"
             className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
           >
             Register
           </Link>
         </div>
       </div>
     </div>
   </nav>
 );
}