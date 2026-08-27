export type SiteSettings = {
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  youtube: string;
  x: string;
  seoTitle: string;
  seoDescription: string;
  notifyEmail: string;
  notifyEnabled: boolean;
};

export const emptySettings = (): SiteSettings => ({
  contactEmail: "",
  contactPhone: "",
  whatsapp: "",
  address: "",
  linkedin: "",
  facebook: "",
  instagram: "",
  youtube: "",
  x: "",
  seoTitle: "",
  seoDescription: "",
  notifyEmail: "",
  notifyEnabled: false,
});
