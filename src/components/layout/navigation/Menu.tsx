"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {useAuth} from "@/store/Auth";

export function NavMenu() {
  const {logout} = useAuth()
  return (
    <NavigationMenu className="w-full">
      <div className='w-full'>
        <NavigationMenuList className="w-full">
          <div className='flex justify-between w-full'>
            <NavigationMenuItem className="w-full flex justify-between">
              <NavigationMenuLink asChild>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <div className='flex'>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/profile" className="whitespace-nowrap">My Profile</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button className="cursor-pointer" onClick={logout}>
                    Logout
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </div>
          </div>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}
