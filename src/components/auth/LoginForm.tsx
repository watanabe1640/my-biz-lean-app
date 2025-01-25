// src/components/auth/LoginForm.tsx
'use client';
import { useState } from 'react';

export default function LoginForm() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   // APIの実装は後ほど
   console.log('Login attempt:', { email, password });
 };

 return (
   <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-6">
     <div>
       <label htmlFor="email" className="block text-sm font-medium">
         Email
       </label>
       <input
         id="email"
         type="email"
         required
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
       />
     </div>
     <div>
       <label htmlFor="password" className="block text-sm font-medium">
         Password
       </label>
       <input
         id="password"
         type="password"
         required
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
       />
     </div>
     <button
       type="submit"
       className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
     >
       Login
     </button>
   </form>
 );
}