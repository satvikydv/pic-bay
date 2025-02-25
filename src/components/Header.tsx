"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Home, User, LogOut, Package, ShieldCheck } from "lucide-react"
import { useNotification } from "./Notification"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {
  const { data: session } = useSession()
  const { showNotification } = useNotification()

  const handleSignOut = async () => {
    try {
      await signOut()
      showNotification("Signed out successfully", "success")
    } catch {
      showNotification("Failed to sign out", "error")
    }
  }

  const getInitials = (email: string) => {
    return email?.split("@")[0]?.slice(0, 2)?.toUpperCase() || "U"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold"
            prefetch={true}
            onClick={() => showNotification("Welcome to ImageKit Shop", "info")}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Home className="h-5 w-5" />
            </Button>
            <span className="hidden md:inline-block">ImageKit Shop</span>
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {session?.user?.email ? getInitials(session.user.email) : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" alignOffset={11} forceMount>
              {session ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.email?.split("@")[0]}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {session.user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex w-full cursor-pointer items-center"
                        onClick={() => showNotification("Welcome to Admin Dashboard", "info")}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex w-full cursor-pointer items-center">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="flex w-full cursor-pointer items-center"
                    onClick={() => showNotification("Please sign in to continue", "info")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

