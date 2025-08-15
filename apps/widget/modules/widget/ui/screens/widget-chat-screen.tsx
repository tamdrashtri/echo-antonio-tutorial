"use client";

import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { ArrowLeftIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, organizationIdAtom, contactSessionIdAtomFamily, conversationIdAtom } from "../../atoms/widget-atoms";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import {
    AIConversation,
    AIConversationContent,
    AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
    AIInput,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools,
    AIInputSubmit,
} from "@workspace/ui/components/ai/input";
import {
    AIMessage,
    AIMessageContent,
    AIMessageAvatar,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import {
    AISuggestions,
    AISuggestion,
} from "@workspace/ui/components/ai/suggestion";
import { Form, FormControl, FormField, FormItem } from "@workspace/ui/components/form";

// Form schema for message input
const messageFormSchema = z.object({
    message: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});

type MessageFormData = z.infer<typeof messageFormSchema>;

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
    const createMessage = useAction(api.public.messages.create);

    // React Hook Form setup
    const form = useForm<MessageFormData>({
        resolver: zodResolver(messageFormSchema),
        defaultValues: {
            message: "",
        },
    });

    // Get conversation data to access threadId
    const conversationData = useQuery(
        api.public.conversations.getOne,
        conversationId && contactSessionId ? { conversationId, contactSessionId } : "skip"
    );

    const messages = useThreadMessages(
        api.public.messages.getMany,
        conversationData?.threadId && contactSessionId
            ? {
                threadId: conversationData.threadId,
                contactSessionId,
            }
            : "skip",
        {initialNumItems: 10}
    );

    const uiMessages = toUIMessages(messages.results || []);

    // Conversation state helpers
    const isConversationResolved = conversationData?.status === "resolved";
    const isConversationEscalated = conversationData?.status === "escalated";
    const canSendMessages = conversationData && !isConversationResolved;

    // Create conversation and set threadId when component mounts
    useEffect(() => {
        const initializeConversation = async () => {
            if (!conversationId && organizationId && contactSessionId) {
                try {
                    const result = await createConversation({ organizationId, contactSessionId });
                    setConversationId(result.conversationId);
                    // You'll need to get the threadId from the conversation
                    // This might require another query to get the conversation details
                } catch (error) {
                    setErrorMessage("Failed to create conversation");
                    setScreen("error");
                }
            }
        };
        initializeConversation();
    }, [conversationId, organizationId, contactSessionId, createConversation, setConversationId, setErrorMessage, setScreen]);

    const handleBackToSelection = () => {
        setScreen("selection");
    };

    const handleSendMessage = async (data: MessageFormData) => {
        const message = data.message.trim();
        if (!message || !conversationData?.threadId || !contactSessionId) return;

        // Prevent sending messages on resolved conversations
        if (isConversationResolved) {
            setErrorMessage("Cannot send messages to a resolved conversation");
            return;
        }

        try {
            await createMessage({
                prompt: message,
                threadId: conversationData.threadId,
                contactSessionId,
            });

            // Reset form after successful send
            form.reset();
        } catch (error) {
            setErrorMessage("Failed to send message");
            console.error("Error sending message:", error);
        }
    };

    const handleSuggestionClick = async (suggestion: string) => {
        // Set the suggestion in the form and submit
        form.setValue("message", suggestion);
        await handleSendMessage({ message: suggestion });
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
                            <div className="flex items-center gap-2">
                                <h2 className="font-semibold text-sm">Chat Support</h2>
                                {isConversationResolved && (
                                    <Badge variant="secondary" className="text-xs">
                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                        Resolved
                                    </Badge>
                                )}
                                {isConversationEscalated && (
                                    <Badge variant="outline" className="text-xs">
                                        <AlertCircleIcon className="h-3 w-3 mr-1" />
                                        Escalated
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {isConversationResolved
                                    ? "This conversation has been resolved"
                                    : "We're here to help"
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                            isConversationResolved ? "bg-gray-400" : "bg-green-500"
                        }`}></div>
                        <span className="text-xs text-muted-foreground">
                            {isConversationResolved ? "Resolved" : "Online"}
                        </span>
                    </div>
                </div>
            </WidgetHeader>

            {/* Resolved Conversation Alert */}
            {isConversationResolved && (
                <div className="p-4 border-b">
                    <Alert>
                        <CheckCircleIcon className="h-4 w-4" />
                        <AlertDescription>
                            This conversation has been resolved. You can start a new conversation if you need further assistance.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* AI Conversation */}
            <div className="flex-1 flex flex-col min-h-0">
                <AIConversation className="flex-1">
                    <AIConversationContent>
                        {uiMessages.map((message) => (
                            <AIMessage key={message.id} from={message.role === "user" ? "user" : "assistant"}>
                                <AIMessageAvatar
                                    src={message.role === "user" ? "/user-avatar.png" : "/bot-avatar.png"}
                                    name={message.role === "user" ? "You" : "Assistant"}
                                />
                                <AIMessageContent>
                                    {message.role === "assistant" ? (
                                        <AIResponse>{message.content}</AIResponse>
                                    ) : (
                                        <div className="text-sm">{message.content}</div>
                                    )}
                                </AIMessageContent>
                            </AIMessage>
                        ))}
                    </AIConversationContent>
                    <AIConversationScrollButton />
                </AIConversation>

                {/* AI Input with React Hook Form */}
                {canSendMessages ? (
                    <div className="border-t bg-background p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSendMessage)} className="space-y-0">
                                <AIInput>
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <AIInputTextarea
                                                        {...field}
                                                        placeholder="Type your message..."
                                                        className="min-h-[44px] resize-none"
                                                        disabled={isConversationResolved}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey && !isConversationResolved) {
                                                                e.preventDefault();
                                                                form.handleSubmit(handleSendMessage)();
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <AIInputToolbar>
                                        <AIInputTools />
                                        <AIInputSubmit
                                            disabled={
                                                form.formState.isSubmitting ||
                                                !form.watch("message")?.trim() ||
                                                isConversationResolved
                                            }
                                        />
                                    </AIInputToolbar>
                                </AIInput>
                            </form>
                        </Form>
                    </div>
                ) : (
                    <div className="border-t bg-background p-4">
                        <div className="flex items-center justify-center py-4 text-muted-foreground">
                            <div className="text-center">
                                <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                <p className="text-sm font-medium">Conversation Resolved</p>
                                <p className="text-xs">This conversation has been marked as resolved.</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={handleBackToSelection}
                                >
                                    Start New Conversation
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Suggestions - show when no user messages yet, no resolved conversation */}
            {canSendMessages && (!conversationData || uiMessages.filter(msg => msg.role === "user").length === 0) && (
                <div className="p-4 border-t">
                    <AISuggestions>
                        <AISuggestion
                            suggestion="How can I get started?"
                            onClick={(suggestion) => handleSuggestionClick(suggestion)}
                        />
                        <AISuggestion
                            suggestion="What features are available?"
                            onClick={(suggestion) => handleSuggestionClick(suggestion)}
                        />
                        <AISuggestion
                            suggestion="I need help with my account"
                            onClick={(suggestion) => handleSuggestionClick(suggestion)}
                        />
                    </AISuggestions>
                </div>
            )}
        </>
    );
};