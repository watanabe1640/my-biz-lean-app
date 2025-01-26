// src/components/auth/RegisterForm.tsx
'use client';
import { useState, FormEvent } from 'react';

interface RegisterFormData {
 name: string;
 email: string;
 password: string;
 confirmPassword: string;
}

export default function RegisterForm() {
 const [formData, setFormData] = useState<RegisterFormData>({
   name: '',
   email: '',
   password: '',
   confirmPassword: ''
 });

 async function handleSubmit(e: FormEvent) {
   e.preventDefault();
   if (formData.password !== formData.confirmPassword) {
     alert('Passwords do not match');
     return;
   }

   try {
     const response = await fetch('/api/auth/register', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         name: formData.name,
         email: formData.email,
         password: formData.password,
       }),
     });

     if (response.ok) {
       window.location.href = '/auth/login';
     } else {
       const data = await response.json();
       alert(data.error || 'Registration failed');
     }
   } catch (err) {
     console.error('Registration error:', err);
     alert('Failed to register');
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
       <label htmlFor="name" className="block text-sm font-medium">Name</label>
       <input
         type="text"
         name="name"
         required
         value={formData.name}
         onChange={handleChange}
         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
       />
     </div>
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
     <div>
       <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
       <input
         type="password"
         name="confirmPassword"
         required
         value={formData.confirmPassword}
         onChange={handleChange}
         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
       />
     </div>
     <button
       type="submit"
       className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
     >
       Register
     </button>
   </form>
 );
}