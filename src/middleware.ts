import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const {pathname} = req.nextUrl

        // allow webhook endpoint
        if(pathname.startsWith("/api/webhook")){
            return true
        }

        // allow auth-related routes
        if(
            pathname.startsWith("/api/auth") ||
            pathname === "/login" ||
            pathname === "/register"
        ){
            return true
        }

        //allow public routes
        if(
            pathname === "/" ||
            pathname === "/api/products" ||
            pathname === "/products"
        ){
            return true
        }
        
        // allow admin routes only for admin users
        if(pathname.startsWith("/admin")){
            return token?.role === "admin"
        }

        //all other routes require authentication
        return !!token
      }
    },
  },
)

export const config = {
    matcher: [
      /*
       * Match all request paths except:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - public folder
       */
      "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};