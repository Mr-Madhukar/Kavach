import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            When you use Kavach, we collect information that you provide to us directly, such as your name, email address, phone number, and emergency contacts. We also collect real-time location data when you use our safety features, such as SOS alerts or journey tracking.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to provide and improve our safety services. Your location data is used to alert your trusted contacts and local authorities (if applicable) when you trigger an SOS. We may also use anonymized data for community safety insights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information. Your location and emergency details are shared with your designated trusted contacts only when you actively use a safety feature (like SOS or Journey Planning).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@kavach.app.
          </p>
        </section>
      </div>
    </main>
  );
}
