"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";
import { signOut } from "next-auth/react";
// import { io } from "socket.io-client";

interface Alert {
  id: string;
  userName: string;
  distance: string;
  time: string;
  urgency: number;
  active: boolean;
}

export default function GuardianDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Connect to Socket.io in a real implementation
    // const socket = io("http://localhost:4000");
    // socket.emit("join-dashboard", "user-id-here");
    // socket.on("alert-triggered", (data) => {
    //   setAlerts(prev => [data, ...prev]);
    // });
    // socket.on("alert-resolved", (data) => {
    //   setAlerts(prev => prev.filter(a => a.alert.id !== data.alertId));
    // });
    
    // Mock data for UI development
    setAlerts([
      {
        id: "1",
        userName: "Riya",
        distance: "40m away",
        time: "Just now",
        urgency: 92,
        active: true
      },
      {
        id: "2",
        userName: "Aman",
        distance: "1.2km away",
        time: "10 mins ago",
        urgency: 61,
        active: true
      }
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-dusk-navy flex flex-col p-4 text-mist-white">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight">Guardian View</h1>
          <p className="text-xs text-slate-400">Monitoring 2 contacts</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 text-slate-400 hover:text-white">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Map Area */}
      <div className="flex-1 rounded-3xl overflow-hidden relative bg-slate-900 border border-white/5 shadow-xl mb-4">
        {/* Placeholder for Leaflet Guardian Map */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80">
          <p className="text-slate-500 font-mono text-sm mb-4">Map Layer Active</p>
          <div className="flex space-x-12">
             <div className="relative">
               <div className="w-4 h-4 bg-alert-crimson rounded-full z-10 relative" />
               <div className="absolute inset-0 border border-alert-crimson rounded-full animate-pulse-fast scale-150" />
               <p className="absolute top-6 -left-4 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">Riya</p>
             </div>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex-shrink-0 animate-in slide-in-from-bottom-8">
        <h2 className="font-display font-bold text-sm text-slate-300 mb-4 uppercase tracking-wider flex items-center">
          <ShieldAlert className="w-4 h-4 mr-2" /> Active Alerts ({alerts.length})
        </h2>
        
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-dusk-navy border border-alert-crimson/30 hover:border-alert-crimson/60 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                {/* Urgency Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono ${alert.urgency > 80 ? 'bg-alert-crimson/20 text-alert-crimson' : 'bg-beacon-amber/20 text-beacon-amber'}`}>
                  {alert.urgency}
                </div>
                <div>
                  <p className="font-bold text-lg">{alert.userName}</p>
                  <p className="text-xs text-slate-400 font-mono">{alert.time} · {alert.distance}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                View
              </button>
            </div>
          ))}
        </div>

        {/* Resolved History */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase">Past 24 Hours</h3>
          <div className="flex items-center space-x-3 text-slate-400 opacity-70 p-2">
             <CheckCircle2 className="w-4 h-4 text-guardian-teal" />
             <div>
               <p className="text-sm">Meera marked safe</p>
               <p className="text-xs font-mono">Yesterday · 09:41 PM</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
