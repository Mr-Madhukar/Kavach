"use client";

import { useState, useEffect } from "react";
import { PhoneOff, Phone, Mic, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FakeCall() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  // Fake state for standard call screen
  const [callState, setCallState] = useState<"incoming" | "active">("incoming");
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "active") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Web Speech API for voice
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) || !isListening) return;

    // @ts-expect-error: webkitSpeechRecognition is not typed in standard Window interface
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: {
      resultIndex: number;
      results: {
        length: number;
        [key: number]: {
          isFinal: boolean;
          0: { transcript: string };
        };
      };
    }) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        handleSecretCheck(finalTranscript.toLowerCase());
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [isListening]);

  const handleSecretCheck = async (text: string) => {
    // In a real app, we check if text contains the duress code and trigger API.
    // For the demo, we assume the API does the validation or we just send it if it looks suspicious.
    // We send a silent request.
    const lowerText = text.toLowerCase();
    if (lowerText.trim() !== "") {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lat: 28.6139, lng: 77.2090, // mock location
            isDuress: true,
            inputDuressCode: lowerText.trim()
          })
        });
        // We do NOT change UI state to keep it stealthy.
      } catch {
        // silent fail
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col relative text-white">
      {/* Background blur/gradient to look like iOS/Android call screen */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-black opacity-80" />
      
      <div className="z-10 flex-1 flex flex-col p-8">
        <div className="flex flex-col items-center mt-12 mb-auto text-center">
          <h2 className="text-xl font-medium text-slate-300 mb-2">
             {callState === "incoming" ? "Incoming call" : formatDuration(callDuration)}
          </h2>
          <h1 className="text-4xl font-display font-medium">Mom</h1>
          <p className="text-slate-400 mt-2">Mobile</p>
        </div>

        {/* Stealth Input area (looks like a 'Reply' or 'Notes' feature) */}
        <div className="mb-12">
           <div className="relative flex items-center bg-white/10 rounded-full px-4 py-2">
             <MessageSquare className="w-5 h-5 text-slate-400 mr-2" />
             <input 
               type="text" 
               className="bg-transparent border-none outline-none text-white w-full"
               placeholder="Reply with message..."
               value={inputText}
               onChange={(e) => {
                 setInputText(e.target.value);
                 handleSecretCheck(e.target.value);
               }}
             />
             <button 
               onClick={() => setIsListening(!isListening)}
               className={`p-2 rounded-full ${isListening ? 'bg-red-500/20 text-red-400' : 'text-slate-400'}`}
             >
               <Mic className="w-5 h-5" />
             </button>
           </div>
        </div>

        <div className="flex justify-between items-center w-full max-w-xs mx-auto mb-12">
           {callState === "incoming" && (
             <button 
               onClick={() => router.push('/home')}
               className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition"
             >
               <PhoneOff className="w-8 h-8" />
             </button>
           )}
           
           {callState === "active" && (
             <div className="flex justify-center w-full">
               <button 
                 onClick={() => router.push('/home')}
                 className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition"
               >
                 <PhoneOff className="w-8 h-8" />
               </button>
             </div>
           )}

           {callState === "incoming" && (
             <button 
               onClick={() => setCallState("active")}
               className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition animate-pulse"
             >
               <Phone className="w-8 h-8" />
             </button>
           )}
        </div>
      </div>
    </main>
  );
}
