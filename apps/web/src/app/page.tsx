import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/home"); // Redirect to the main app if logged in
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full border border-beacon-amber/20 animate-pulse-slow"></div>
        <div className="w-[450px] h-[450px] rounded-full border border-beacon-amber/10 absolute animate-[pulse-slow_3s_ease-out_infinite]"></div>
      </div>

      <div className="z-10 flex flex-col items-center space-y-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-dusk-navy border border-beacon-amber/30 rounded-full mb-4 shadow-[0_0_30px_rgba(255,182,39,0.15)] relative">
          <Shield className="w-10 h-10 text-beacon-amber" />
          <div className="absolute inset-0 rounded-full border border-beacon-amber animate-pulse-slow"></div>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-mist-white">
          Kavach
        </h1>
        
        <p className="text-lg text-slate-300 max-w-sm mb-8 font-body">
          Your silent, intelligent safety net. Not just an alarm, but a companion that routes you to safety when it matters most.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
          className="w-full"
        >
          <button
            type="submit"
            className="w-full py-4 px-6 bg-beacon-amber text-dusk-navy font-bold rounded-xl text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-beacon-amber/20 flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <p className="text-sm text-slate-500 max-w-xs mt-6">
          By signing in, you agree to our <Link href="/terms" className="underline hover:text-slate-300 transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-slate-300 transition-colors">Privacy Policy</Link>. Kavach only uses Google for secure sign-in.
        </p>
      </div>
    </main>
  );
}
