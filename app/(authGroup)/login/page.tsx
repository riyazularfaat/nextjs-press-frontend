import LoginForm from "../_components/LoginForm";

export  default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-gray-500">Enter your details below.</p>
          </div>
          <LoginForm />
          {/* <div className="spline-container absolute top-0 left-0 w-full h-full -z-10">
            <iframe
              src="https://my.spline.design/dunes-3fd4468737972c9a084de27efa2263c4" frameBorder="0" width="100%"
              height="100%" id="aura-spline">
            </iframe>
          </div> */}
        </div>
      </div>
      
      
    </>
  )
}
