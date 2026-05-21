export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last Updated: February 11, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-10 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Commitment to Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At OneReel, we respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, store, and protect your information when you use our
              AI video generation platform.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-semibold text-blue-600">
              We never sell your data. Period.
            </p>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Account Information
                </h3>
                <p>When you create an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Email address</li>
                  <li>Name (if provided)</li>
                  <li>Profile information you choose to share</li>
                  <li>Authentication credentials (encrypted)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Content You Create
                </h3>
                <p>We store:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Video prompts and descriptions you provide</li>
                  <li>AI-generated videos you create</li>
                  <li>Thumbnails and metadata associated with your content</li>
                  <li>Creative settings (mood, style, camera preferences)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                <p>We automatically collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Number of videos generated</li>
                  <li>Feature usage patterns</li>
                  <li>Browser type and device information</li>
                  <li>
                    IP address and approximate location (city/country level)
                  </li>
                  <li>Time and date of service access</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Payment Information
                </h3>
                <p>
                  Payment processing is handled by Stripe. We do not store your
                  credit card details. We receive only:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Subscription status</li>
                  <li>Last 4 digits of payment method (via Stripe)</li>
                  <li>Billing history</li>
                  <li>Customer ID for subscription management</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Operate and maintain the One Reel platform</li>
              <li>Connect creators with freelancers</li>
              <li>Process payments securely via Stripe</li>
              <li>Send notifications about your account activity</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Improve our services based on usage patterns</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-gray-900">Public Information:</strong>{" "}
              Your username, profile image, bio, skills, gigs, and reviews are
              visible to all users browsing the marketplace.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-gray-900">
                We DO NOT sell your data.
              </strong>{" "}
              We share information only in these cases:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>With Stripe to process payments securely</li>
              <li>When required by law or legal process</li>
              <li>To prevent fraud or protect user safety</li>
            </ul>
          </section>

          {/* Payment Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Payment Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All payments are processed by Stripe, a PCI-DSS compliant payment
              processor. One Reel never stores or has access to your credit card
              information. Stripe handles all payment card data according to
              industry security standards.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your account information as long as your account is
              active. If you delete your account, we will remove your personal
              information within 30 days, except for transaction records
              required for legal compliance (retained for 7 years).
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access your personal data at any time</li>
              <li>Update your profile information</li>
              <li>Delete your account and associated data</li>
              <li>
                Opt out of marketing emails (transactional emails still sent)
              </li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          {/* Cookies & Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cookies & Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              One Reel uses cookies to maintain your login session and improve
              user experience. We do not use third-party advertising cookies or
              sell data to advertisers.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Third-Party Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              One Reel integrates with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong className="text-gray-900">Stripe:</strong> For secure
                payment processing
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              These services have their own privacy policies. We recommend
              reviewing them.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your
              data, including encrypted connections (HTTPS), secure databases,
              and regular security audits. However, no system is 100% secure. If
              you suspect unauthorized access to your account, contact us
              immediately.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              One Reel is not intended for users under 18. We do not knowingly
              collect information from children. If we learn that a user is
              under 18, we will delete their account.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes via email or platform
              notification. Continued use after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  privacy@onereel.ai
                </p>
                <p>
                  <span className="font-semibold">Support:</span> Through the
                  OneReel platform support system
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-12 space-x-6">
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Terms of Service
          </a>
          <a
            href="/content-policy"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Content Policy
          </a>
          <a href="/" className="text-gray-600 hover:text-gray-700">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
