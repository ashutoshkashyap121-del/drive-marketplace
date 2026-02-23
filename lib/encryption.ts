import crypto from "crypto";

const algorithm = "aes-256-gcm";

const key = Buffer.from(process.env.AADHAAR_ENCRYPTION_KEY!, "hex");

if (!process.env.AADHAAR_ENCRYPTION_KEY) {
  throw new Error("AADHAAR_ENCRYPTION_KEY is not set");
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decrypt(encryptedData: {
  encrypted: string;
  iv: string;
  authTag: string;
}) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encryptedData.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.encrypted, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}