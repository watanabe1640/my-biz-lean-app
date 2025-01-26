// src/components/auth/LoginForm.tsx
'use client';
import { useState, FormEvent } from 'react';

interface LoginFormData {
 email: string;
 password: string;
}

export default function LoginForm() {
 const [formData, setFormData] = useState<LoginFormData>({
   email: '',
   password: ''
 });

 async function handleSubmit(e: FormEvent) {
   e.preventDefault();

   try {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData),
     });

     if (response.ok) {
       window.location.href = '/';
     } else {
       const data = await response.json();
       alert(data.error || 'Login failed');
     }
   } catch (err) {
     console.error('Login error:', err);
     alert('Failed to login');
   }
 }

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   setFormData({
     ...formData,
     [e.target.name]: e.target.value
   });
 };

 return (
   <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-6">
     <div>
       <label htmlFor="email" className="block text-sm font-medium">Email</label>
       <input
         type="email"
         name="email"
         required
         value={formData.email}
         onChange={handleChange}
         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
       />
     </div>
     <div>
       <label htmlFor="password" className="block text-sm font-medium">Password</label>
       <input
         type="password"
         name="password"
         required
         value={formData.password}
         onChange={handleChange}
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