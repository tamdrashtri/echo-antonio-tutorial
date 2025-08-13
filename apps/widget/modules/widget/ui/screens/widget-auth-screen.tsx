import { WidgetHeader } from "../components/widget-header";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Must be a valid email.",
    }),
})

export const WidgetAuthScreen = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })
    const organizationId = 1;
    const createContactSession = useMutation(api.public.contactSessions.create);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!organizationId) {
            return;
        }
        const metadata: Doc<"contactSessions">["metadata"] = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages.join(', '),
            platform: navigator.platform,
            vendor: navigator.vendor,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timezone: new Date().getTimezoneOffset().toString(),
            timezoneOffset: new Date().getTimezoneOffset().toString(),
            cookieEnabled: navigator.cookieEnabled.toString(),
            referrer: document.referrer,
            currentUrl: window.location.href,
        }
        const contactSessionId = await createContactSession({
            ...values,
            organizationId,
            metadata,
            expiredAt: Date.now() + (1000 * 60 * 60 * 24), // 1 day from now
        });
        console.log({contactSessionId});
    }
    
    return (
        <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p>
                        Hi there!
                    </p>
                    <p className="text-lg">
                        Let's get you started
                    </p>
                </div>
            </WidgetHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        type="text"
                                        className="h-10 bg-background"
                                        placeholder="Name" {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}  
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        type="text"
                                        className="h-10 bg-background"
                                        placeholder="email" {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}  
                    />
                    <Button
                     disabled={!form.formState.isValid}
                     type="submit" 
                     className="h-10 bg-primary">
                        Continue
                    </Button>
                </form>
            </Form>
            <div className="flex flex-1">
                <div className="flex-1 p-4">
                    Widget Auth Screen
                </div>
            </div>
        </main>
    )
}