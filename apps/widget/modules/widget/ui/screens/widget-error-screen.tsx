"use client";

import { useAtomValue } from "jotai";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import { AlertTriangleIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";

export const WidgetErrorScreen = () => {
    const errorMessage = useAtomValue(errorMessageAtom);
    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p>
                        Error
                    </p>
                    <p className="text-lg">
                        {errorMessage}
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1">
                <div className="flex-1 p-4">
                    <AlertTriangleIcon />
                    <p>
                        {errorMessage}
                    </p>
                </div>
            </div>
        </>
    )
}