export type AdminRole = "admin";

export type AdminSession = {
  email: string;
  role: AdminRole;
  issuedAt: number;
  expiresAt: number;
};
