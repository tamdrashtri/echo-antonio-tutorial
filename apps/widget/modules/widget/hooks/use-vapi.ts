import Vapi from "@vapi-ai/web";
import {useEffect, useState } from "react";

interface TranscriptMessage {
    role: "user" | "assistant";
    text: string;
}

export const useVapi = () => {
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

    useEffect(() => {
        // only for testing the API
        const vapi = new Vapi("");
        setVapi(vapi);

        vapi.on("call-start", () => {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([]);
        });
        vapi.on("call-end", () => {
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
            setTranscript([]);
        });

        vapi.on("speech-start", () => {
            setIsSpeaking(true);
        });
        vapi.on("speech-end", () => {
            setIsSpeaking(false);
        });

        vapi.on("error", (error) => {
            console.log(error, "VAPI_ERROR")
            setIsConnecting(false);
        });

        vapi.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setTranscript((prev) => [
                    ...prev,
                    {
                        role: message.role === "user" ? "user" : "assistant",
                        text: message.transcript,
                    },
                ]);
            }
        });

        return () => {
            vapi?.stop()
        }
    }, []);

    const startCall = () => {
        setIsConnecting(true);
        vapi?.start("");
    }

    const endCall = () => {
        vapi?.stop();
    }

    return {
        isConnected,
        isConnecting,
        isSpeaking,
        transcript,
        startCall,
        endCall,
    }
}

