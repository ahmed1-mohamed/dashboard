import { execSync } from "child_process";

process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.NEXTAUTH_SECRET = "your-secret-key-here";
process.env.NEXT_PUBLIC_API_URL = "https://demoapi.p-adviser.com/api/dashboard";
process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD = "https://demoapi.p-adviser.com/api";
process.env.NEXT_PUBLIC_API_URL_IMPORTS = "https://demoapi.p-adviser.com/api/imports";

let port = 3000;
const portMatch = process.env.NEXTAUTH_URL.match(/http:\/\/localhost:(\d+)/);
if (portMatch && portMatch[1]) {
  port = portMatch[1];
}

console.log(`📡 Starting server on port ${port} with API: ${process.env.NEXT_PUBLIC_API_URL}`);

try {
  execSync(`next dev -p ${port}`, { stdio: "inherit", env: process.env });
} catch (error) {
  process.exit(1);
}
