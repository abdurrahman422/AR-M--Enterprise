function read(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export const publicEnv = {
  siteUrl: read("NEXT_PUBLIC_SITE_URL"),
  contactEmail: read("NEXT_PUBLIC_CONTACT_EMAIL"),
  contactPhone: read("NEXT_PUBLIC_CONTACT_PHONE"),
  whatsapp: read("NEXT_PUBLIC_WHATSAPP"),
  address: read("NEXT_PUBLIC_ADDRESS"),
  linkedin: read("NEXT_PUBLIC_LINKEDIN"),
  facebook: read("NEXT_PUBLIC_FACEBOOK"),
  instagram: read("NEXT_PUBLIC_INSTAGRAM"),
  youtube: read("NEXT_PUBLIC_YOUTUBE"),
  x: read("NEXT_PUBLIC_X"),
};

export const serverEnv = {
  dataDriver: read("DATA_DRIVER") || (read("DATABASE_URL") ? "neon" : "catalog"),
  databaseUrl: read("DATABASE_URL"),
  authSecret: read("AUTH_SECRET"),
  adminEmail: read("ADMIN_EMAIL"),
  adminPassword: read("ADMIN_PASSWORD"),
  resendApiKey: read("RESEND_API_KEY"),
  inquiryNotifyEmail: read("INQUIRY_NOTIFY_EMAIL"),
  emailFrom: read("EMAIL_FROM"),
};

export function isFilled(value: string | undefined | null): value is string {
  return Boolean(value && value.trim().length > 0);
}
