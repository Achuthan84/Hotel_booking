import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary env missing: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  // Helpful sanity log (does not print secrets)
  console.log(`CLOUDINARY configured: ${cloudName} (key ${String(apiKey).slice(0, 6)}...)`);

  // Validate credentials early with a lightweight call
  try {
    await cloudinary.api.ping();
    console.log("CLOUDINARY ping: OK");
  } catch (err) {
    const httpCode = err?.http_code || err?.error?.http_code;
    const msg = err?.message || err?.error?.message || "Unknown Cloudinary error";
    console.error("CLOUDINARY ping failed:", { httpCode, msg });
  }
};

export default connectCloudinary;