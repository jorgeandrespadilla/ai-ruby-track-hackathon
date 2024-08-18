import React from "react";
import Link from "next/link";
import { CalendarIcon, FileUp, HomeIcon, MailIcon, MailWarning, PackageOpen, PencilIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from '@radix-ui/react-separator';//"@/components/ui/separator"; //Use a better one

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { UserButton } from "@clerk/nextjs";

export type IconProps = React.HTMLAttributes<SVGElement>;

const DATA = {
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home Page" },
    { href: "#", icon: FileUp, label: "Upload" },
    { href: "#", icon: PackageOpen, label: "History" },
    { href: "#", icon: MailWarning, label: "Contact us" },
  ],
};

export function NavBar() {
  return (
    <TooltipProvider>
      <Dock direction="middle">
        {DATA.navbar.map((item) => (
          <DockIcon key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full",
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <UserButton />
            </TooltipTrigger>
          </Tooltip>
        </DockIcon>
      </Dock>
    </TooltipProvider>
  );
}
