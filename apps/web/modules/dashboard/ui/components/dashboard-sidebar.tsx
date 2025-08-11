'use client';

import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import {
    Building,
    CreditCardIcon,
    InboxIcon,
    LayoutDashboardIcon,
    LibraryBigIcon,
    Mic,
    PaletteIcon
} from "lucide-react";


import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@workspace/ui/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";



const customerSupportItems = [
    {
        label: "Conversations",
        url: "/conversations",
        icon: InboxIcon, 
    },
    {
        label: "Knowledge Base",
        url: "/files",
        icon: LibraryBigIcon,
    }
]

const configurationItems = [
    {
        title: "Widget Customization",
        url: "/widget-customization",
        icon: PaletteIcon,
    },
    {
        title: "Integrations",
        url: "/Integrations",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Voice Assistant",
        url: "/plugin/vapi",
        icon: Mic,
    }
]

const accountItems = [
    {
        title: "Billing",
        url: "/billing",
        icon: CreditCardIcon,
    }
]

export const DashboardSidebar = () => {
    const pathname = usePathname();
    const { isMobile } = useSidebar();
    const { user } = useUser();

    const isActive = (url : string) => {
        if (url === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(url);
    }

    return (
        <Sidebar className="group" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex items-center gap-2 w-full">
                                <div className="group-data-[collapsible=icon]:hidden w-full">
                                    <OrganizationSwitcher hidePersonal skipInvitationScreen />
                                </div>
                                <div className="group-data-[state=expanded]:hidden flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md text-sm font-semibold">
                                    <Building className="size-4" />
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Customer Support */}
                <SidebarGroup>
                    <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {customerSupportItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        isActive={isActive(item.url)}
                                        asChild
                                 
                                        tooltip={item.label}
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                        
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                )
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* Customization */}
                <SidebarGroup>
                    <SidebarGroupLabel>Customization</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {configurationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={isActive(item.url)}
                                        asChild
                               
                                        tooltip={item.title}
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >

                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                )
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            {/* Account */}
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={isActive(item.url)}
                                        asChild
                                        tooltip={item.title}
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >

                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                )
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user?.imageUrl}
                                    alt={user?.fullName || user?.firstName || "User"}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user?.fullName || user?.firstName || "User"}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.emailAddresses?.[0]?.emailAddress || "Account"}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {/* Hidden UserButton for functionality */}
                <div className="sr-only">
                    <UserButton />
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}