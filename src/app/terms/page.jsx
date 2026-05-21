export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Terms of Service
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
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to OneReel. By accessing or using our platform, you agree
              to be bound by these Terms of Service and all applicable laws and
              regulations. If you do not agree with any part of these terms, you
              may not use our service.
            </p>
          </section>

          {/* Content Ownership */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Content Ownership and License
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900">
                You Own Your Content
              </p>
              <p>
                You retain all ownership rights to any content you create,
                upload, or generate using OneReel. We do not claim ownership of
                your videos, images, text, or any other materials you produce on
                our platform.
              </p>
              <p className="font-semibold text-gray-900 mt-6">
                License Grant to OneReel
              </p>
              <p>
                By using OneReel, you grant us a limited, non-exclusive,
                royalty-free license to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process your content through our AI generation systems</li>
                <li>Store your generated media on our servers</li>
                <li>Display your content back to you within the platform</li>
                <li>
                  Perform technical operations necessary to provide the service
                </li>
              </ul>
              <p className="mt-4">
                This license exists solely to enable the functionality of our
                service and terminates when you delete your content or account.
              </p>
            </div>
          </section>

          {/* Prohibited Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Prohibited Content and Conduct
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>You agree NOT to create, upload, or generate content that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Violates any local, state, national, or international law
                </li>
                <li>Infringes on intellectual property rights of others</li>
                <li>
                  Contains illegal, abusive, threatening, or harassing material
                </li>
                <li>Promotes violence, hatred, or discrimination</li>
                <li>Depicts or exploits minors in any way</li>
                <li>Contains deepfakes or misleading impersonations</li>
                <li>Violates the privacy or publicity rights of others</li>
                <li>Contains malware, viruses, or harmful code</li>
                <li>Attempts to bypass our content moderation systems</li>
              </ul>
              <p className="mt-4 font-semibold text-red-600">
                Violation of these terms may result in immediate account
                suspension or termination without refund.
              </p>
            </div>
          </section>

          {/* Subscription and Billing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Subscription and Billing
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900">Free Tier</p>
              <p>
                OneReel offers a free tier with limited video generations and
                watermarked content. Free tier access may be modified or
                discontinued at our discretion.
              </p>

              <p className="font-semibold text-gray-900 mt-6">
                Pro Subscription
              </p>
              <p>
                Pro subscriptions are billed monthly or annually via Stripe. By
                subscribing, you authorize us to charge your payment method on a
                recurring basis until you cancel.
              </p>

              <p className="font-semibold text-gray-900 mt-6">Cancellation</p>
              <p>
                You may cancel your subscription at any time through your
                account settings. Cancellations take effect at the end of the
                current billing period. No partial refunds are provided for
                unused time.
              </p>

              <p className="font-semibold text-gray-900 mt-6">Price Changes</p>
              <p>
                We reserve the right to modify subscription pricing with 30 days
                advance notice. Existing subscribers will be grandfathered at
                their current rate for at least one billing cycle.
              </p>
            </div>
          </section>

          {/* AI Generation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. AI-Generated Content
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                OneReel uses artificial intelligence to generate videos based on
                your prompts and inputs. AI-generated content may be
                unpredictable and is provided "as is."
              </p>
              <p>
                You are responsible for reviewing all AI-generated content
                before publishing or distributing it. OneReel is not liable for
                how third parties interpret or use your AI-generated media.
              </p>
              <p className="font-semibold text-gray-900 mt-4">
                Best Practice: When sharing AI-generated content publicly, we
                recommend disclosing that it was created using AI.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="uppercase font-bold text-gray-900">
                SERVICE PROVIDED "AS IS"
              </p>
              <p>
                OneReel is provided "as is" and "as available" without
                warranties of any kind, either express or implied, including but
                not limited to implied warranties of merchantability, fitness
                for a particular purpose, or non-infringement.
              </p>
              <p className="mt-4">We do not guarantee that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The service will be uninterrupted or error-free</li>
                <li>AI generations will meet your specific requirements</li>
                <li>All content will be successfully generated or stored</li>
                <li>The service will be available at all times</li>
              </ul>
              <p className="mt-4 uppercase font-bold text-gray-900">
                Limitation of Damages
              </p>
              <p>
                To the maximum extent permitted by law, OneReel shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or inability to use the service</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of the service</li>
                <li>Any bugs, viruses, or other harmful code</li>
                <li>Content or conduct of any third party on the service</li>
              </ul>
              <p className="mt-4">
                Our total liability shall not exceed the amount you paid to
                OneReel in the 12 months prior to the event giving rise to
                liability, or $100 USD, whichever is greater.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Termination
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900">Your Rights</p>
              <p>
                You may terminate your account at any time by contacting support
                or using the account deletion feature. Upon termination, your
                access to the service will cease.
              </p>

              <p className="font-semibold text-gray-900 mt-6">Our Rights</p>
              <p>
                We reserve the right to suspend or terminate your account
                immediately, without prior notice, if you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate these Terms of Service</li>
                <li>Create prohibited content</li>
                <li>Engage in abusive behavior toward other users or staff</li>
                <li>Attempt to reverse-engineer or compromise the platform</li>
                <li>Use the service for illegal purposes</li>
              </ul>
              <p className="mt-4">
                Terminated accounts are not eligible for refunds.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms of Service from time to time. We will
              notify users of material changes via email or through the
              platform. Your continued use of OneReel after changes take effect
              constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of the United States, without regard to its conflict of
              law provisions.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms of Service, please contact
              us through the platform support system or email support@onereel.ai
            </p>
          </section>

          {/* Acceptance */}
          <section className="border-t pt-8">
            <p className="text-gray-700 leading-relaxed">
              By using OneReel, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-12 space-x-6">
          <a
            href="/privacy"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Privacy Policy
          </a>
          <a
            href="/content-policy"
            className="text-purple-600 hover:text-purple-700 font-medium"
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
