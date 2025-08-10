"use client"

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex flex-col items-center justify-center min-h-svh max-w-md mx-auto w-full">
        <p>apps/widget</p>
        <Button onClick={startCall}>
            Start call
        </Button>
        <Button onClick={endCall} variant={"destructive"}>
            End call
        </Button>
        <p>isConnected {isConnected ? "true" : "false"}</p>
        <p>isConnecting {isConnecting ? "true" : "false"}</p>
        <p>isSpeaking {isSpeaking ? "true" : "false"}</p>
        <p>transcript {JSON.stringify(transcript, null, 2)}</p>
    </div>
  )
}
