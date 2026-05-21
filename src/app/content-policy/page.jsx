export default function ContentPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Content & AI Usage Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last Updated: February 11, 2026
          </p>
          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
            OneReel is a creative tool built on trust. These guidelines ensure
            our platform remains safe, legal, and ethical for all users.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-10 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Philosophy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              AI is powerful. It can create incredible art, tell stories, and
              bring ideas to life. But with that power comes responsibility.
              This policy outlines what you can and cannot create using OneReel.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-semibold text-orange-600">
              When in doubt, ask yourself: "Would I be comfortable defending
              this content in public?" If not, don't create it.
            </p>
          </section>

          {/* Prohibited Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚫 Prohibited Content
            </h2>
            <p className="text-gray-700 mb-4">
              The following content is strictly forbidden on OneReel and will
              result in immediate account termination:
            </p>
          </section>

          {/* Deepfakes */}
          <section className="bg-red-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-900 mb-3">
              1. Deepfakes and Non-Consensual Impersonation
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p className="font-semibold text-red-800">
                Absolutely No Deepfakes
              </p>
              <p>You may NOT create videos that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Impersonate real people without their explicit consent</li>
                <li>
                  Manipulate someone's likeness to make them appear to say or do
                  things they didn't
                </li>
                <li>
                  Create fake pornographic or intimate content of any person
                </li>
                <li>
                  Falsely depict public figures, celebrities, or private
                  individuals
                </li>
                <li>
                  Generate content intended to deceive viewers about its
                  authenticity
                </li>
              </ul>
            </div>
          </section>

          {/* Harmful Content */}
          <section className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-orange-900 mb-3">
              2. Harmful, Illegal, or Dangerous Content
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>You may NOT create content that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-semibold">Depicts violence:</span>{" "}
                  Graphic violence, gore, torture, or harm to people or animals
                </li>
                <li>
                  <span className="font-semibold">Promotes hate:</span> Content
                  targeting individuals or groups based on race, religion,
                  gender, sexual orientation, disability, or other protected
                  characteristics
                </li>
                <li>
                  <span className="font-semibold">Exploits minors:</span> Any
                  content involving minors in inappropriate, sexual, or harmful
                  situations (ZERO TOLERANCE)
                </li>
                <li>
                  <span className="font-semibold">
                    Promotes illegal activity:
                  </span>{" "}
                  Instructions for making weapons, drugs, bombs, or other
                  illegal items
                </li>
                <li>
                  <span className="font-semibold">Self-harm:</span> Content
                  promoting suicide, eating disorders, or self-injury
                </li>
                <li>
                  <span className="font-semibold">Harassment:</span> Content
                  designed to bully, threaten, or intimidate individuals
                </li>
                <li>
                  <span className="font-semibold">Terrorism:</span> Content that
                  promotes or glorifies terrorist organizations or acts
                </li>
              </ul>
            </div>
          </section>

          {/* Copyright */}
          <section className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-900 mb-3">
              3. Copyright and Intellectual Property
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p className="font-semibold text-yellow-800">
                Respect Others' Creative Work
              </p>
              <p>You may NOT create content that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Infringes on copyrighted material (movies, TV shows, music,
                  books, art)
                </li>
                <li>Uses trademarked brands without permission</li>
                <li>
                  Recreates proprietary characters or stories you don't own
                </li>
                <li>
                  Violates licensing agreements or terms of use of other
                  platforms
                </li>
              </ul>
              <p className="mt-3 font-semibold">What You CAN Do:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Create original content inspired by ideas (not direct copies)
                </li>
                <li>Use public domain or Creative Commons licensed material</li>
                <li>Generate content you have the legal rights to create</li>
              </ul>
              <p className="mt-3 text-sm bg-white rounded p-3 border-l-4 border-yellow-500">
                <span className="font-semibold">DMCA Compliance:</span> If you
                believe your copyrighted work has been infringed on OneReel,
                please contact us at dmca@onereel.ai with details.
              </p>
            </div>
          </section>

          {/* AI Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Best Practices for AI-Generated Content
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-green-700">
                We encourage transparency when sharing AI-generated content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-semibold">Disclose AI Use:</span> When
                  sharing publicly, consider adding "AI-generated" or "Created
                  with OneReel" to your captions
                </li>
                <li>
                  <span className="font-semibold">Context Matters:</span> Be
                  clear about the fictional or creative nature of your content
                </li>
                <li>
                  <span className="font-semibold">Platform Rules:</span> If
                  posting to social media, follow their AI disclosure policies
                </li>
                <li>
                  <span className="font-semibold">Commercial Use:</span> If
                  using for advertising or marketing, clearly indicate AI
                  generation
                </li>
              </ul>
            </div>
          </section>

          {/* Enforcement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🛡️ Enforcement and Reporting
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900">
                How We Moderate Content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Automated AI safety filters analyze prompts before generation
                </li>
                <li>User reports are reviewed by our moderation team</li>
                <li>Repeated violations result in escalating consequences</li>
                <li>
                  Severe violations result in immediate termination and law
                  enforcement reporting
                </li>
              </ul>

              <p className="font-semibold text-gray-900 mt-6">
                Consequences for Violations:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>First offense: Warning + content removal</li>
                <li>
                  Second offense: Temporary account suspension (7-30 days)
                </li>
                <li>Third offense: Permanent account termination</li>
                <li>
                  Severe violations: Immediate permanent ban + potential legal
                  action
                </li>
              </ul>

              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <p className="font-semibold text-gray-900 mb-2">
                  Report Inappropriate Content:
                </p>
                <p>
                  If you encounter content that violates this policy, please
                  report it immediately through the platform or email
                  safety@onereel.ai
                </p>
              </div>
            </div>
          </section>

          {/* Creative Freedom */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎨 What You CAN Create
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-green-600">
                OneReel is built for creativity. Here's what we love to see:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Original stories, animations, and visual narratives</li>
                <li>Educational content and tutorials</li>
                <li>Artistic experiments and creative projects</li>
                <li>Marketing and promotional videos for your business</li>
                <li>Personal projects, memories, and celebrations</li>
                <li>Fictional characters and worlds you create</li>
                <li>Music videos, lyric videos, and visualizers</li>
                <li>Product demos and explainer videos</li>
              </ul>
              <p className="mt-4 italic text-gray-600">
                The possibilities are endless. Create responsibly, and let your
                imagination run wild.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you're unsure whether your content complies with this policy,
              contact us at safety@onereel.ai before creating it. We're here to
              help.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-12 space-x-6">
          <a
            href="/terms"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Privacy Policy
          </a>
          <a href="/" className="text-gray-600 hover:text-gray-700">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
