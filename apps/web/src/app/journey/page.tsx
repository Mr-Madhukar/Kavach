"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, MapPin, Clock, AlertOctagon, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function JourneyShield() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [status, setStatus] = useState<"setup" | "active" | "escalated" | "completed">("setup");
  const [etaMins, setEtaMins] = useState(15);
  
  // Mock tracking
  useEffect(() => {
    if (status === "active" && journeyId) {
      const interval = setInterval(() => {
        // Ping location
        fetch(`http://localhost:4000/api/journeys/${journeyId}/pings`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.id || 'test'}` 
          },
          body: JSON.stringify({ lat: 28.6139, lng: 77.2090 })
        }).then(res => res.json()).then(data => {
          if (data.escalated) setStatus("escalated");
        }).catch(console.error);
      }, 5000); // Ping every 5 seconds for demo
      return () => clearInterval(interval);
    }
  }, [status, journeyId, session]);

  const startJourney = async () => {
    try {
      const arrival = new Date(Date.now() + etaMins * 60000);
      const res = await fetch('http://localhost:4000/api/journeys', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id || 'test'}`
        },
        body: JSON.stringify({ 
          destinationLat: 28.62, 
          destinationLng: 77.21, 
          expectedArrival: arrival.toISOString() 
        })
      });
      const data = await res.json();
      if (data.success) {
        setJourneyId(data.journeyId);
        setStatus("active");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markArrived = async () => {
    if (!journeyId) return;
    try {
      await fetch(`http://localhost:4000/api/journeys/${journeyId}/arrived`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.user?.id || 'test'}` }
      });
      setStatus("completed");
      setTimeout(() => router.push('/home'), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const simulateAnomaly = async () => {
    if (!journeyId) return;
    try {
      const res = await fetch(`http://localhost:4000/api/journeys/${journeyId}/pings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id || 'test'}` 
        },
        body: JSON.stringify({ lat: 28.6139, lng: 77.2090, simulateAnomaly: true })
      });
      const data = await res.json();
      if (data.escalated) setStatus("escalated");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {status === "active" && (
        <div className="absolute inset-0 bg-blue-500/10 animate-[pulse-slow_3s_ease-out_infinite]" />
      )}
      {status === "escalated" && (
        <div className="absolute inset-0 bg-red-600/20 animate-[pulse-fast_0.8s_ease-out_infinite]" />
      )}
      
      <div className="z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        <div className="flex items-center justify-center mb-6">
          <Shield className={`w-16 h-16 ${
            status === 'setup' ? 'text-guardian-teal' : 
            status === 'active' ? 'text-blue-400' : 
            status === 'escalated' ? 'text-red-500' : 'text-green-500'
          }`} />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-center mb-2">Journey Shield</h1>
        
        {status === "setup" && (
          <div className="space-y-6 mt-8">
            <p className="text-slate-400 text-center mb-6">We will track your route and auto-alert if you deviate or stop moving.</p>
            
            <div className="bg-slate-800 rounded-xl p-4 flex items-center space-x-4">
              <MapPin className="text-guardian-teal w-6 h-6" />
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Destination</p>
                <p className="font-medium text-lg">Central Metro Station</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 flex items-center space-x-4">
              <Clock className="text-guardian-teal w-6 h-6" />
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Expected Time</p>
                <div className="flex items-center space-x-2 mt-1">
                  <input 
                    type="number" 
                    value={etaMins} 
                    onChange={e => setEtaMins(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-white/20 rounded p-1 text-center"
                  />
                  <span>minutes</span>
                </div>
              </div>
            </div>

            <button 
              onClick={startJourney}
              className="w-full py-4 bg-guardian-teal text-slate-900 font-bold rounded-xl text-lg hover:bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all"
            >
              Start Shield
            </button>
            <button onClick={() => router.push('/home')} className="w-full py-2 text-slate-400 font-medium">Cancel</button>
          </div>
        )}

        {status === "active" && (
          <div className="text-center space-y-8 mt-6">
            <p className="text-blue-200 text-lg">Your journey is being monitored securely.</p>
            
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>

            <div className="space-y-4">
              <button 
                onClick={markArrived}
                className="w-full py-4 bg-green-500 text-white font-bold rounded-xl text-lg flex items-center justify-center shadow-lg hover:bg-green-400"
              >
                <CheckCircle2 className="mr-2" /> I&apos;m safe, Arrived
              </button>
              
              {/* Dev Only Button for Demo */}
              <button 
                onClick={simulateAnomaly}
                className="w-full py-3 border border-red-500/50 text-red-400 rounded-xl font-medium hover:bg-red-500/10 flex items-center justify-center"
              >
                <AlertOctagon className="mr-2 w-4 h-4" /> [Demo] Simulate Deviation
              </button>
            </div>
          </div>
        )}

        {status === "escalated" && (
          <div className="text-center space-y-6 mt-6">
             <h2 className="text-2xl font-bold text-red-500">Alert Escalated!</h2>
             <p className="text-red-200">We detected an anomaly in your journey. Your trusted contacts have been notified automatically.</p>
             <button 
                onClick={markArrived}
                className="w-full py-4 mt-4 border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/10"
              >
                Cancel Alert / I&apos;m Safe
              </button>
          </div>
        )}

        {status === "completed" && (
          <div className="text-center space-y-6 mt-6">
             <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
             <h2 className="text-2xl font-bold text-green-400">Journey Complete</h2>
             <p className="text-slate-400">Tracking disabled.</p>
          </div>
        )}
      </div>
    </main>
  );
}
