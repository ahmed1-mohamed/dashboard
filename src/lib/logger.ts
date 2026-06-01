
const isDevelopment = process.env.NODE_ENV === "development";

export const apiLogger = {
  request: (config: any) => {
    if (!isDevelopment) return; 
    
    console.group("📤 API REQUEST");
    console.log("➡️ URL:", (config.baseURL || "") + config.url);
    console.log("➡️ Method:", config.method?.toUpperCase());
    console.log("➡️ Headers:", config.headers);
    console.log("➡️ Params:", config.params);
    console.log("➡️ Data:", config.data);
    console.groupEnd();
  },

  response: (response: any) => {
    if (!isDevelopment) return;

    console.group("📥 API RESPONSE");
    console.log("⬅️ URL:", response.config.url);
    console.log("⬅️ Status:", response.status);
    console.log("⬅️ Headers:", response.headers);
    console.log("⬅️ Data:", response.data);
    console.groupEnd();
  },

  error: (error: any) => {
    if (!isDevelopment) return;

    console.group("❌ API ERROR");
    console.log("❌ Message:", error.message);
    console.log("❌ Status:", error.response?.status);
    console.log("❌ URL:", error.config?.url);
    console.log("❌ Request Headers:", error.config?.headers);
    console.log("❌ Response Data:", error.response?.data);
    console.groupEnd();
  },

  auth: (message: string, data?: any) => {
    if (!isDevelopment) return;

    console.group("🔐 AUTH");
    console.log(message);
    if (data) console.log("DATA:", data);
    console.groupEnd();
  }
};
