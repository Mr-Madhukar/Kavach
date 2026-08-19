"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapPin, ShieldCheck, ChevronRight } from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [contacts, setContacts] = useState([{ name: "", phone: "" }]);
  const [homeLocation, setHomeLocation] = useState<{ lat: number; lng: number } | null>(null);

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: "", phone: "" }]);
    }
  };

  const updateContact = (index: number, field: "name" | "phone", value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const completeOnboarding = async () => {
    // In a real app, we would send this data to the /api/onboarding endpoint
    // await fetch('/api/onboarding', { method: 'POST', body: JSON.stringify({ contacts, homeLocation }) });
    router.push("/home");
  };

  return (
    <main className="min-h-screen bg-dusk-navy flex flex-col p-6 text-mist-white">
      <div className="flex items-center space-x-2 mb-8 mt-4">
        <div className={`h-2 rounded-full flex-1 ${step >= 1 ? 'bg-beacon-amber' : 'bg-slate-muted'}`} />
        <div className={`h-2 rounded-full flex-1 ${step >= 2 ? 'bg-beacon-amber' : 'bg-slate-muted'}`} />
      </div>

      {step === 1 && (
        <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-display font-bold mb-2">Trusted Contacts</h2>
          <p className="text-slate-300 font-body mb-8">
            Add 2-3 people you trust. We&apos;ll alert them instantly if you trigger an SOS.
          </p>

          <div className="space-y-4 flex-1">
            {contacts.map((contact, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-muted/40 bg-white/5 space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateContact(i, "name", e.target.value)}
                    placeholder="e.g. Mom"
                    className="w-full bg-transparent border-b border-slate-muted focus:border-beacon-amber outline-none py-2 text-lg transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(i, "phone", e.target.value)}
                    placeholder="+91 "
                    className="w-full bg-transparent border-b border-slate-muted focus:border-beacon-amber outline-none py-2 text-lg font-mono transition-colors"
                  />
                </div>
              </div>
            ))}

            {contacts.length < 3 && (
              <button
                onClick={addContact}
                className="flex items-center text-beacon-amber py-2 px-4 rounded-lg font-medium hover:bg-white/5 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add another contact
              </button>
            )}
          </div>

          <button
            disabled={!contacts[0].name || !contacts[0].phone}
            onClick={() => setStep(2)}
            className="w-full py-4 mt-8 bg-beacon-amber text-dusk-navy font-bold rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Continue <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-display font-bold mb-2">Home Base & Duress Code</h2>
          <p className="text-slate-300 font-body mb-8">
            Set your safe location and a secret word.
          </p>

          <div className="flex-1 space-y-8">
            <div className="p-4 rounded-xl border border-slate-muted/40 bg-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="text-beacon-amber w-6 h-6" />
                <h3 className="text-xl font-bold">Home Location</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                We use this to establish a baseline for your daily routes.
              </p>
              <button 
                onClick={() => setHomeLocation({ lat: 28.6139, lng: 77.2090 })}
                className={`w-full py-3 rounded-lg border flex items-center justify-center transition-colors ${
                  homeLocation ? 'border-guardian-teal text-guardian-teal' : 'border-slate-muted text-mist-white hover:border-beacon-amber'
                }`}
              >
                {homeLocation ? <><ShieldCheck className="w-5 h-5 mr-2" /> Saved</> : 'Use Current Location'}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-muted/40 bg-white/5">
              <h3 className="text-xl font-bold mb-2">Duress Code Word</h3>
              <p className="text-sm text-slate-400 mb-4">
                A word that quietly alerts your contacts if you say or type it — pick something you won&apos;t say by accident.
              </p>
              <input
                type="text"
                placeholder="e.g. Pineapple"
                className="w-full bg-dusk-navy border border-slate-muted focus:border-beacon-amber rounded-lg outline-none p-4 text-lg transition-colors"
              />
            </div>
          </div>

          <button
            onClick={completeOnboarding}
            className="w-full py-4 mt-8 bg-guardian-teal text-dusk-navy font-bold rounded-xl text-lg flex items-center justify-center"
          >
            Complete Setup
          </button>
        </div>
      )}
    </main>
  );
}
