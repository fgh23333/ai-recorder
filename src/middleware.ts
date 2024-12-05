import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace("/api/", "");

  const url = `https://whisper-large-v3.lepton.run/api/v1/${path}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);

  headers.set("Authorization", `Bearer ${process.env.LEPTON_TOKEN}`);

  return NextResponse.rewrite(new URL(url), {
    request: {
      headers: headers,
    },
  });
}

export const config = {
  matcher: "/api/:path*",
};
