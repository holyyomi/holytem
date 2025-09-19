import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH = "/admin";
const allowedIPs = (process.env.ADMIN_ALLOWED_IPS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const adminUser = process.env.ADMIN_USER || "";
const adminPass = process.env.ADMIN_PASS || "";

function getClientIP(req: NextRequest) {
  // Vercel 프록시 고려
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.ip ?? "";
}

function isIPAllowed(ip: string) {
  // 간단: 정확히 일치만 허용 (CIDR 등은 MVP에서 제외)
  return ip && allowedIPs.includes(ip);
}

function basicAuthOk(req: NextRequest) {
  const auth = req.headers.get("authorization"); // "Basic base64"
  if (!auth?.startsWith("Basic ")) return false;
  try {
    const [, b64] = auth.split(" ");
    const [user, pass] = Buffer.from(b64, "base64").toString().split(":");
    return user === adminUser && pass === adminPass;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (!url.pathname.startsWith(ADMIN_PATH)) return NextResponse.next();

  const ip = getClientIP(req);
  if (!isIPAllowed(ip)) {
    return new NextResponse("Forbidden (IP)", { status: 403 });
  }
  if (!basicAuthOk(req)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="HolyTem Admin"' },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
