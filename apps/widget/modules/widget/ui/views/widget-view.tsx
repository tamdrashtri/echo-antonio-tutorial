"use client";

import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { error } from "console";

interface Props {
    organizationId: string; 
};

export const WidgetView = ({organizationId}: Props) => {
    const screen = useAtomValue(screenAtom);
    const screenComponents = {
        auth: <WidgetAuthScreen />,
        error: <p>Error</p>,
        loading: <p>Loading</p>,
        selection: <p>Selection</p>,
        voice: <p>Voice</p>,
        inbox: <p>Inbox</p>,
        chat: <p>Chat</p>,
        contact: <p>Contact</p>,
    };
    return (
        <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetAuthScreen />

            {/* <WidgetFooter /> */}
        </main>
    )
}