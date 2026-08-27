import { saveSettingsAction } from "@/app/admin/catalog-actions";
import { SettingsForm } from "@/components/admin/settings-form";
import { DriverNote } from "@/components/admin/driver-note";
import { data, getDataProvider } from "@/lib/data";
export default async function AdminSettingsPage() { const provider = getDataProvider(); const settings = await data.settings.get(); return <div className="space-y-6"><div><p className="text-xs uppercase tracking-[0.18em] text-muted">Configuration</p><h1 className="mt-2 font-heading text-3xl">Settings</h1><DriverNote driver={provider.driver} writable={provider.writable} entity="Settings" /></div><SettingsForm settings={settings} action={saveSettingsAction} /></div>; }
