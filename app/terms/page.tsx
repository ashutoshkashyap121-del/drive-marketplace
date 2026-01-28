export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Terms & Conditions
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Last updated: January 2026
        </p>

        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <p>
            This platform connects users with independent driving trainers.
          </p>

          <p>
            Users must be 18+ and hold a valid Learner’s or Permanent Driving
            License.
          </p>

          <p>
            The platform acts only as a facilitator and is not responsible for
            training outcomes.
          </p>

          <p>
            Driving involves risk. Users agree to follow trainer instructions
            and traffic laws.
          </p>

          <p>
            No personal accident insurance is provided unless explicitly stated.
          </p>

          <p>
            Continued use of the platform implies acceptance of these terms.
          </p>
        </div>
      </div>
    </main>
  );
}
