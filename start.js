import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Load .env file manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
      } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
        value = value.replace(/^'|'$/g, '').replace(/\\n/g, '\n');
      }
      process.env[key] = value;
    }
  });
}

process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key-here";
process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://demoapi.p-adviser.com/api/dashboard";
process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD = process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD || "https://demoapi.p-adviser.com/api";
process.env.NEXT_PUBLIC_API_URL_IMPORTS = process.env.NEXT_PUBLIC_API_URL_IMPORTS || "https://demoapi.p-adviser.com/api/imports";

let port = 3000;
const portMatch = process.env.NEXTAUTH_URL.match(/http:\/\/localhost:(\d+)/);
if (portMatch && portMatch[1]) {
  port = portMatch[1];
}

const args = process.argv.slice(2);
const command = args[0] || "dev";

try {
  if (command === "dev" || command === "start") {
    execSync(`npx next ${command} -p ${port}`, { stdio: "inherit" });
  } else {
    execSync(`npx next ${command}`, { stdio: "inherit" });
  }
} catch (error) {
  process.exit(1);
}
