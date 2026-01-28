export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Last updated: January 2026
        </p>

        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <p>
            We collect basic booking details such as name, mobile number, city,
            and pickup address.
          </p>

          <p>
            This information is shared only with the assigned trainer.
          </p>

          <p>
            We do not sell or misuse user data.
          </p>

          <p>
            Reasonable security practices are followed to protect information.
          </p>

          <p>
            By using the platform, you consent to this privacy policy.
          </p>
        </div>
      </div>
    </main>
  );
}
