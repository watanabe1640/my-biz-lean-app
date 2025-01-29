import LoginForm from "@/components/auth/LoginForm";

// src/app/auth/login/page.tsx
export default function LoginPage() {
	return (
	  <div className="min-h-screen bg-gray-50 flex flex-col justify-center text-gray-900">
		<div className="max-w-md w-full mx-auto">
		  <div className="text-center mb-8">
			<h2 className="text-3xl font-extrabold">Login</h2>
		  </div>
		  <LoginForm />
		</div>
	  </div>
	);
   }