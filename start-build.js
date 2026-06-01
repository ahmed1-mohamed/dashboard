import { execSync } from "child_process";

process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.NEXTAUTH_SECRET = "your-secret-key-here";
process.env.NEXT_PUBLIC_API_URL = "https://demoapi.p-adviser.com/api/dashboard";
process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD = "https://demoapi.p-adviser.com/api";
process.env.NEXT_PUBLIC_API_URL_IMPORTS = "https://demoapi.p-adviser.com/api/imports";

console.log(`🔨 Building app with API: ${process.env.NEXT_PUBLIC_API_URL}`);

try {
  execSync("next build", { stdio: "inherit", env: process.env });
  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed");
  process.exit(1);
}
