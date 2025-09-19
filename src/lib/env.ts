export const ENV = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  adminIPs: (process.env.ADMIN_ALLOWED_IPS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  adminUser: process.env.ADMIN_USER || "",
  adminPass: process.env.ADMIN_PASS || "",
};
