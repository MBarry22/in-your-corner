import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "In Your Corner";
  const hasTwilio =
    !!process.env.TWILIO_ACCOUNT_SID &&
    !!process.env.TWILIO_AUTH_TOKEN &&
    !!process.env.TWILIO_PHONE_NUMBER;
  const hasCron = !!process.env.CRON_SECRET;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-900">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <p>
            <strong>App name:</strong> {appName}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Twilio configured:{" "}
            <span className={hasTwilio ? "text-green-600" : "text-amber-600"}>
              {hasTwilio ? "Yes" : "No"}
            </span>
          </p>
          <p>
            Cron secret set:{" "}
            <span className={hasCron ? "text-green-600" : "text-amber-600"}>
              {hasCron ? "Yes" : "No"}
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <p>
            <strong>Cron (daily send):</strong> GET /api/cron/send-daily-support — use
            Authorization: Bearer &lt;CRON_SECRET&gt; or ?secret=&lt;CRON_SECRET&gt;
          </p>
          <p>
            <strong>Twilio inbound:</strong> POST /api/twilio/inbound — set this as your
            Twilio webhook URL for incoming SMS.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Admin auth</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600">
          <p>
            Admin authentication is not enabled for this MVP. Add middleware or route
            protection when you are ready to restrict access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
