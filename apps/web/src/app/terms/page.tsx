import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Kavach application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Kavach is a personal safety application designed to provide users with tools to alert trusted contacts and access safety resources. It is not a replacement for professional emergency services (e.g., 911, 112, 100). Always contact local authorities directly in life-threatening situations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
          <p className="mb-4">
            You agree to provide accurate information when setting up your profile and emergency contacts. You are responsible for maintaining the confidentiality of your account credentials and for any activity that occurs under your account. You agree not to misuse the SOS features or submit false alerts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
          <p className="mb-4">
            Kavach is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not warrant that the service will be uninterrupted, timely, secure, or error-free. To the fullest extent permitted by law, Kavach and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any significant changes by updating the date at the top of this page. Continued use of the app after such changes constitutes your acceptance of the new Terms of Service.
          </p>
        </section>
      </div>
    </main>
  );
}
