"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { errorMessageAtom, loadingMessageAtom, contactSessionIdAtom, screenAtom, organizationIdAtom } from "../../atoms/widget-atoms";
import { Loader2Icon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";


type InitStep = "storage" | "org" | "session" | "setting" | "done" | "vapi" | "selection" | "auth";

export const WidgetLoadingScreen = ({organizationId}: {organizationId: string | null}) => {
    const [step, setStep] = useState<InitStep>("org");
    const contactSessionId = useAtomValue(contactSessionIdAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setScreen = useSetAtom(screenAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const validateOrganization = useAction(api.public.organizations.validate);
    const validateContactSession = useMutation(api.public.contactSessions.validate);

    // Set the organization ID when the component mounts
    useEffect(() => {
        if (organizationId) {
            setOrganizationId(organizationId);
        }
    }, [organizationId, setOrganizationId]);

    // Organization validation effect
    useEffect(() => {
        if (step !== "org") return;

        setLoadingMessage("Validating organization");

        if (!organizationId) {
            setErrorMessage("Organization not found");
            setScreen("error");
            return;
        }

        validateOrganization({organizationId})
            .then((res) => {
                if (!res.valid) {
                    setErrorMessage("Organization not found");
                    setScreen("error");
                    return;
                }
                setStep("session");
            })
            .catch(() => {
                setErrorMessage("Error validating organization");
                setScreen("error");
            });
    }, [organizationId, setErrorMessage, setLoadingMessage, step, validateOrganization, setScreen]);

    // Session validation effect
    useEffect(() => {
        if (step !== "session") return;

        setLoadingMessage("Checking session");

        if (contactSessionId) {
            validateContactSession({ contactSessionId })
                .then((res) => {
                    if (res.valid) {
                        setScreen("selection");
                    } else {
                        setScreen("auth");
                    }
                })
                .catch(() => {
                    setScreen("auth");
                });
        } else {
            setScreen("auth");
        }
    }, [step, contactSessionId, validateContactSession, setLoadingMessage, setScreen]);

    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p>
                        Loading
                    </p>
                    <p className="text-lg">
                        {loadingMessage}
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1">
                <div className="flex-1 p-4">
                    <Loader2Icon />
                    <p>
                        {loadingMessage || "Loading..."} 
                    </p>
                </div>
            </div>
        </>
    )
}