"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Navigation, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";

export default function PlanRoute() {
  const router = useRouter();
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [contextText, setContextText] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<{ risk: string; reason: string } | null>(null);

  const checkRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRiskData(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/route-risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, destination, contextText })
      });
      const data = await res.json();
      setRiskData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'high': return 'bg-red-500/20 border-red-500 text-red-400';
      default: return 'bg-slate-500/20 border-slate-500 text-slate-400';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch(risk) {
      case 'low': return <ShieldCheck className="w-8 h-8 text-green-400" />;
      case 'medium': return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'high': return <AlertCircle className="w-8 h-8 text-red-400" />;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col p-6 text-white relative">
      <header className="flex items-center mb-8 mt-2">
        <button onClick={() => router.back()} className="p-2 mr-4 text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold font-display">Plan Safe Route</h1>
      </header>

      <form onSubmit={checkRoute} className="space-y-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl space-y-4 border border-slate-700">
          <div className="flex items-center space-x-3">
             <MapPin className="text-slate-400 w-5 h-5" />
             <input 
               type="text" 
               required
               value={start}
               onChange={(e) => setStart(e.target.value)}
               placeholder="Current Location / Start"
               className="bg-transparent border-b border-slate-700 focus:border-beacon-amber outline-none py-2 w-full transition-colors"
             />
          </div>
          <div className="flex items-center space-x-3">
             <Navigation className="text-beacon-amber w-5 h-5" />
             <input 
               type="text" 
               required
               value={destination}
               onChange={(e) => setDestination(e.target.value)}
               placeholder="Where to?"
               className="bg-transparent border-b border-slate-700 focus:border-beacon-amber outline-none py-2 w-full transition-colors"
             />
          </div>
          <div className="pt-2">
            <label className="text-sm text-slate-400 mb-1 block">Any extra context? (optional)</label>
            <input 
               type="text" 
               value={contextText}
               onChange={(e) => setContextText(e.target.value)}
               placeholder="e.g. Walking alone, taking a cab..."
               className="bg-slate-900 border border-slate-700 focus:border-beacon-amber rounded-lg outline-none p-3 w-full transition-colors"
             />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !start || !destination}
          className="w-full py-4 bg-beacon-amber text-slate-900 font-bold rounded-xl flex justify-center items-center disabled:opacity-50"
        >
          {loading ? "Analyzing Risk..." : "Evaluate Route"}
        </button>
      </form>

      {riskData && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
           <h2 className="text-lg font-medium text-slate-400 mb-4 uppercase tracking-wider">AI Route Assessment</h2>
           
           <div className={`p-6 rounded-2xl border ${getRiskColor(riskData.risk)} flex flex-col items-center text-center space-y-4`}>
              {getRiskIcon(riskData.risk)}
              <h3 className="text-3xl font-bold font-display uppercase tracking-widest">{riskData.risk} RISK</h3>
              <p className="text-lg">{riskData.reason}</p>
           </div>
           
           <div className="mt-8 flex space-x-4">
             <button onClick={() => router.push('/home')} className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold text-center border border-slate-700">
               Cancel
             </button>
             <button onClick={() => router.push('/home')} className="flex-1 py-4 bg-guardian-teal text-slate-900 rounded-xl font-bold text-center">
               Start Journey
             </button>
           </div>
        </div>
      )}
    </main>
  );
}
