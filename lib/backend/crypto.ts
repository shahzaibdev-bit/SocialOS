import crypto from "crypto";

const PASSWORD_ITERATIONS = 120_000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = "sha512";

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString("hex");

  return `${PASSWORD_ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [iterationsRaw, salt, hash] = storedHash.split(":");
  const iterations = Number(iterationsRaw);

  if (!iterations || !salt || !hash) {
    return false;
  }

  const candidate = crypto.pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST);
  const expected = Buffer.from(hash, "hex");

  return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
}

export function createSecret(prefix: string) {
  return `${prefix}_${crypto.randomBytes(24).toString("base64url")}`;
}

export function hashSecret(secret: string) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

function getEncryptionKey() {
  const material =
    process.env.TOKEN_ENCRYPTION_SECRET ||
    process.env.SESSION_SECRET ||
    process.env.META_APP_SECRET ||
    process.env.LINKEDIN_CLIENT_SECRET ||
    "omnisocial-local-development-key";

  return crypto.createHash("sha256").update(material).digest();
}

export function encryptSecret(secret: string) {
  if (!secret) {
    return "";
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `enc:v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${encrypted.toString("base64url")}`;
}

export function decryptSecret(stored: string) {
  if (!stored || !stored.startsWith("enc:v1:")) {
    return stored;
  }

  const [, , ivRaw, tagRaw, encryptedRaw] = stored.split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));

  return Buffer.concat([decipher.update(Buffer.from(encryptedRaw, "base64url")), decipher.final()]).toString("utf8");
}
