"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Map as MapIcon, LogOut, Phone, Navigation, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomeDashboard() {
  const router = useRouter();
  const [alertActive, setAlertActive] = useState(false);
  const [reports, setReports] = useState<{ id: string; lat: number; lng: number }[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/reports')
      .then(res => res.json())
      .then(data => {
        if(data.reports) setReports(data.reports);
      }).catch(console.error);
  }, []);

  const triggerSOS = async () => {
    // In a real app, this hits the Express backend to create an alert via Socket.io/REST
    setAlertActive(true);
  };

  const markSafe = () => {
    setAlertActive(false);
  };

  return (
    <main className={`min-h-screen flex flex-col p-4 transition-colors duration-300 ${alertActive ? 'bg-dusk-navy/95' : 'bg-dusk-navy'} text-mist-white relative`}>
      {/* Top Bar */}
      <header className="flex justify-between items-center mb-4 z-10">
        <h1 className="font-display font-bold text-2xl tracking-tight text-white">Kavach</h1>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 text-slate-400 hover:text-white">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Map Area */}
      <div className="flex-1 rounded-3xl overflow-hidden relative border border-white/5 bg-slate-900 shadow-xl mb-24 z-10">
        {/* Placeholder for Leaflet Map */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <MapIcon className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Heatmap Layer */}
            {reports.map((r) => (
              <div 
                key={r.id} 
                className="absolute w-24 h-24 rounded-full bg-red-500/30 blur-xl z-0"
                style={{ 
                  top: `${Math.max(10, Math.min(90, 50 + (r.lat - 28.6139) * 2000))}%`,
                  left: `${Math.max(10, Math.min(90, 50 + (r.lng - 77.2090) * 2000))}%` 
                }}
              />
            ))}
            
            {/* User Location Marker with Pulse */}
            <div className="relative flex items-center justify-center z-10">
              <div className={`w-4 h-4 rounded-full z-10 ${alertActive ? 'bg-alert-crimson' : 'bg-beacon-amber'}`} />
              <div className={`absolute w-16 h-16 rounded-full border ${alertActive ? 'border-alert-crimson animate-pulse-fast' : 'border-beacon-amber animate-pulse-slow'}`} />
            </div>
          </div>
        </div>

        {/* Active Alert Overlay */}
        {alertActive && (
          <div className="absolute inset-x-0 bottom-0 bg-dusk-navy/90 backdrop-blur-md border-t border-alert-crimson/30 p-4 animate-in slide-in-from-bottom-8">
            <p className="text-center text-alert-crimson font-medium mb-4">Your trusted contacts have been notified</p>
            
            <h3 className="font-display font-bold text-sm text-slate-300 mb-2 uppercase tracking-wider">Nearest Safe Points</h3>
            <ul className="space-y-2 mb-6">
              {[
                { name: "Sharma Medical Store", distance: "140m", type: "Pharmacy" },
                { name: "Metro Security Desk", distance: "320m", type: "Guard" },
                { name: "24/7 Convenience Store", distance: "450m", type: "Shop" }
              ].map((sp, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 active:bg-white/10">
                  <div>
                    <p className="font-bold">{sp.name}</p>
                    <p className="text-xs text-slate-400">{sp.type}</p>
                  </div>
                  <span className="font-mono text-beacon-amber">{sp.distance}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={markSafe}
              className="w-full py-4 bg-guardian-teal text-dusk-navy font-bold rounded-xl text-lg flex items-center justify-center shadow-lg"
            >
              I&apos;m safe now
            </button>
          </div>
        )}
      </div>

      {/* Ambient Status Bar (Calm State) */}
      {!alertActive && (
        <div className="absolute bottom-28 inset-x-0 flex justify-center pointer-events-none z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
            <p className="text-xs font-mono text-slate-300">All quiet · last checked 2 min ago</p>
          </div>
        </div>
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 p-6 flex justify-between items-end z-20 pointer-events-none">
        <div className="flex flex-col space-y-3 pointer-events-auto">
          <button 
            onClick={() => router.push('/fake-call')}
            className="flex items-center space-x-2 px-6 py-3 rounded-full border border-guardian-teal text-guardian-teal bg-dusk-navy hover:bg-guardian-teal/10 transition-colors shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Fake Call</span>
          </button>

          <button 
            onClick={() => router.push('/plan-route')}
            className="flex items-center space-x-2 px-6 py-3 rounded-full border border-slate-400 text-slate-300 bg-dusk-navy hover:bg-white/10 transition-colors shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            <span>Plan Route</span>
          </button>
          
          <button 
            onClick={() => router.push('/journey')}
            className="flex items-center space-x-2 px-6 py-3 rounded-full border border-blue-400 text-blue-300 bg-dusk-navy hover:bg-blue-400/10 transition-colors shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            <span>Journey Shield</span>
          </button>

          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-2 px-6 py-3 rounded-full border border-orange-400 text-orange-300 bg-dusk-navy hover:bg-orange-400/10 transition-colors shadow-lg"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>

        <button
          onClick={triggerSOS}
          disabled={alertActive}
          className={`pointer-events-auto flex items-center justify-center w-24 h-24 rounded-full shadow-2xl transition-all duration-300 ${
            alertActive 
              ? 'bg-alert-crimson scale-90 opacity-0 pointer-events-none' 
              : 'bg-beacon-amber hover:bg-yellow-400 active:scale-95'
          }`}
        >
          <ShieldAlert className="w-10 h-10 text-dusk-navy" />
        </button>
      </div>

      {/* Alert Full Screen Flash Effect */}
      {alertActive && (
        <div className="fixed inset-0 pointer-events-none bg-alert-crimson/20 animate-[pulse-fast_0.8s_ease-out_infinite] z-0" />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Report an Incident</h2>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  fetch('http://localhost:4000/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: 28.6139 + (Math.random()-0.5)*0.04, lng: 77.2090 + (Math.random()-0.5)*0.04, category: 'Harassment', description: 'Anonymous report' })
                  }).then(() => {
                    setShowReportModal(false);
                    fetch('http://localhost:4000/api/reports').then(r=>r.json()).then(d => {if(d.reports) setReports(d.reports)});
                  });
                }}
                className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 font-medium"
              >
                Harassment / Unsafe person
              </button>
              <button 
                onClick={() => {
                   fetch('http://localhost:4000/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: 28.6139 + (Math.random()-0.5)*0.04, lng: 77.2090 + (Math.random()-0.5)*0.04, category: 'Poor Lighting', description: 'Anonymous report' })
                  }).then(() => {
                    setShowReportModal(false);
                    fetch('http://localhost:4000/api/reports').then(r=>r.json()).then(d => {if(d.reports) setReports(d.reports)});
                  });
                }}
                className="w-full py-3 bg-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-500/30 font-medium"
              >
                Poor Lighting / Dark Area
              </button>
              <button onClick={() => setShowReportModal(false)} className="w-full py-3 text-slate-400 font-medium mt-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
