"use client";

import { ArrowLeftIcon, SendIcon, UserIcon, BotIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, organizationIdAtom, contactSessionIdAtomFamily } from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState, useRef, useEffect } from "react";
import { conversationIdAtom } from "../../atoms/widget-atoms";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import { cn } from "@workspace/ui/lib/utils";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

export const WidgetChatScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const conversationId = useAtomValue(conversationIdAtom);
    const contactSessionId = useAtomValue(
        contactSessionIdAtomFamily(organizationId || "default")
    );
    const createConversation = useMutation(api.public.conversations.create);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content: "Hello! How can I help you today?",
            role: "assistant",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleBackToSelection = () => {
        setScreen("selection");
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue.trim(),
            role: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Create conversation if it doesn't exist
        if (!conversationId && organizationId && contactSessionId) {
            try {
                const result = await createConversation({ organizationId, contactSessionId });
                setConversationId(result.conversationId);
            } catch (error) {
                setErrorMessage("Failed to create conversation");
                setScreen("error");
                return;
            }
        }

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "Thank you for your message. I'm here to help you with any questions you might have.",
                role: "assistant",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <WidgetHeader>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleBackToSelection}
                            className="h-8 w-8"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                        </Button>
                        <div>
                            <h2 className="font-semibold text-sm">Chat Support</h2>
                            <p className="text-xs text-muted-foreground">We're here to help</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                </div>
            </WidgetHeader>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0">
                <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
                    <div className="space-y-4 py-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    message.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                    message.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}>
                                    {message.role === "user" ? (
                                        <UserIcon className="h-4 w-4" />
                                    ) : (
                                        <BotIcon className="h-4 w-4" />
                                    )}
                                </div>
                                <div className={cn(
                                    "rounded-lg px-3 py-2 text-sm",
                                    message.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}>
                                    <p>{message.content}</p>
                                    <p className={cn(
                                        "text-xs mt-1 opacity-70",
                                        message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <BotIcon className="h-4 w-4" />
                                </div>
                                <div className="bg-muted rounded-lg px-3 py-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t bg-background p-4">
                <div className="flex gap-2">
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        size="icon"
                        className="h-9 w-9"
                    >
                        <SendIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
};