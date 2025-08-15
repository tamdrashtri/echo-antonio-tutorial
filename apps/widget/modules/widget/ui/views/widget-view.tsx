"use client";

import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { WidgetSelectionScreen } from "../screens/widget-selection-screen";
import { WidgetChatScreen } from "../screens/widget-chat-screen";

interface Props {
    organizationId: string; 
};

export const WidgetView = ({organizationId}: Props) => {
    const screen = useAtomValue(screenAtom);
    const screenComponents = {
        auth: <WidgetAuthScreen />,
        error: <WidgetErrorScreen />,
        loading: <WidgetLoadingScreen organizationId={organizationId} />,
        selection: <WidgetSelectionScreen />,
        voice: <p>Voice</p>,
        inbox: <p>Inbox</p>,
        chat: <WidgetChatScreen />,
        contact: <p>Contact</p>,
    };
    return (
        <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">

            {screenComponents[screen]}

            {/* <WidgetFooter /> */}
        </main>
    )
}