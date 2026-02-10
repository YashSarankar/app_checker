
import { NextResponse } from 'next/server'

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
}

export default async function middleware(req) {
    const url = req.nextUrl
    const hostname = req.headers.get("host")

    // rewrite root path for snapplay subdomain
    if (hostname.startsWith("snapplay") && (url.pathname === "/" || url.pathname === "")) {
        url.pathname = "/snapplay"
        return NextResponse.rewrite(url)
    }

    // rewrite root path for amozea subdomain
    if (hostname.startsWith("amozea") && (url.pathname === "/" || url.pathname === "")) {
        url.pathname = "/amozea"
        return NextResponse.rewrite(url)
    }

    return NextResponse.next()
}
