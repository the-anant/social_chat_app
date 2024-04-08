"use client"
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../ui/navigation-menu";

export default function ChatNav(){
    return(
        <>
        <NavigationMenu className="">
            <NavigationMenuList className="gap-x-4 font-extrabold">
                <NavigationMenuItem>
                    <Link href={"/"}  legacyBehavior passHref >
                        <NavigationMenuLink className="{navigationMenuTriggerStyle()}">
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href={"/"}  legacyBehavior passHref >
                        <NavigationMenuLink className="{navigationMenuTriggerStyle()}">
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href={"/"}  legacyBehavior passHref >
                        <NavigationMenuLink className="{navigationMenuTriggerStyle()}">
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href={"/"}  legacyBehavior passHref >
                        <NavigationMenuLink className="{navigationMenuTriggerStyle()}">
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        </>
    )
}