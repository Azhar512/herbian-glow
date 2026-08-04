import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getSiteSetting, updateSiteSetting } from "@/lib/settings";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  loader: async () => {
    const whatsapp = await getSiteSetting("whatsapp_number", "923164782073");
    return { whatsapp };
  },
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { whatsapp } = Route.useLoaderData();
  const [whatsappNumber, setWhatsappNumber] = useState(whatsapp);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    const success = await updateSiteSetting("whatsapp_number", whatsappNumber);
    setSaving(false);
    if (success) {
      alert("Settings saved successfully!");
      router.invalidate();
    } else {
      alert("Failed to save settings. Please check your permissions.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-cocoa">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your global store settings</p>
      </div>

      <div className="max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-serif text-xl text-cocoa">Contact Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-cocoa">
              WhatsApp Number
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground">+</span>
              <input
                type="text"
                id="whatsapp"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="923000000000"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your country code and number without spaces or symbols (e.g., 923164782073).
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blush px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-blush-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
