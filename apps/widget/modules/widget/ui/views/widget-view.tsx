"use client";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@workspace/ui/components/form";
// import { WidgetFooter } from "@/modules/widget/ui/components/widget-footer";
// import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import {Button} from "@workspace/ui/components/button";
import {useForm} from "react-hook-form";
import { Input } from "@workspace/ui/components/input";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";


interface Props {
    organizationId: string; 
};

export const WidgetView = ({organizationId}: Props) => {
    return (
        <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetAuthScreen />

            {/* <WidgetFooter /> */}
        </main>
    )
}