"use client";

import { AlertTriangleIcon, ChevronRightIcon, MessageSquareIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, organizationIdAtom, contactSessionIdAtomFamily } from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { conversationIdAtom } from "../../atoms/widget-atoms";
import { errorMessageAtom } from "../../atoms/widget-atoms";

export const WidgetSelectionScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const contactSessionId = useAtomValue(
        contactSessionIdAtomFamily(organizationId || "default")
    );
    const createConversation = useMutation(api.public.conversations.create);
    const [isPending, setIsPending] = useState(false);

    const handleNewConversation = () => {
        setIsPending(true);
        if (!organizationId || !contactSessionId) {
            return;
        }
        setIsPending(false);
        createConversation({ organizationId, contactSessionId })
            .then((res) => {
                setConversationId(res.conversationId);
                setScreen("chat");
            })  
            .catch(() => {
                setErrorMessage("Failed to create conversation");
                setScreen("error");
            });
    }

    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p>
                        Select a channel
                    </p>
                    <p className="text-lg">
                        Select a channel to start a conversation
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto"> 
            <Button className="h-16 w-full justify-between" variant="outline" 
            disabled={isPending}
            onClick={handleNewConversation} > <div className="flex items-center gap-x-2"> 
            <MessageSquareIcon className="size-4" /> <span>Start chat</span> </div>
            <ChevronRightIcon className="size-4" />
            </Button>
            </div>
        </>
    )
}