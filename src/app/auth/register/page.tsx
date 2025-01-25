// src/app/auth/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
 return (
   <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
     <div className="max-w-md w-full mx-auto">
       <h2 className="text-3xl font-extrabold text-center mb-8">Register</h2>
       <RegisterForm />
     </div>
   </div>
 );
}