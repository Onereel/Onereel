"use client";

import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function LaunchChecklistPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#111418] dark:text-white mb-2">
            🚀 One Reel - Launch Checklist
          </h1>
          <p className="text-[#667085] dark:text-white/60">
            Production readiness audit and go-live plan
          </p>
        </div>

        {/* PHASE 6: HARDENING */}
        <Section title="Phase 6: Platform Hardening" status="complete">
          <ChecklistItem checked>
            Rate limiting implemented (10 reels/min, 100 API calls/min)
          </ChecklistItem>
          <ChecklistItem checked>
            Cost controls active (Free: $5/mo, Pro: $100/mo AI spend)
          </ChecklistItem>
          <ChecklistItem checked>
            Abuse detection (flags users with &gt;15 reels/hour)
          </ChecklistItem>
          <ChecklistItem checked>
            Monitoring endpoint at /api/monitoring (admin-only)
          </ChecklistItem>
          <ChecklistItem checked>
            Database indexes optimized for queries
          </ChecklistItem>
          <ChecklistItem checked>
            Error logging for failed generations
          </ChecklistItem>
          <ChecklistItem checked>
            Payment state validation (Pro tier + active subscription)
          </ChecklistItem>
          <ChecklistItem checked>
            Auth security verified (email + Twitter OAuth)
          </ChecklistItem>
        </Section>

        {/* PHASE 7: ONBOARDING */}
        <Section title="Phase 7: Onboarding Optimization" status="complete">
          <ChecklistItem checked>
            Smart defaults pre-selected (energetic mood, smooth camera)
          </ChecklistItem>
          <ChecklistItem checked>
            Usage indicators shown on dashboard
          </ChecklistItem>
          <ChecklistItem checked>
            Upgrade prompts at limit reached
          </ChecklistItem>
          <ChecklistItem checked>
            First reel creation takes &lt;60 seconds
          </ChecklistItem>
          <ChecklistItem checked>
            Watermark badge shown on free reels
          </ChecklistItem>
          <ChecklistItem checked>
            Success state redirects to reel viewer
          </ChecklistItem>
        </Section>

        {/* PHASE 8: DISTRIBUTION */}
        <Section title="Phase 8: Distribution System" status="ready">
          <ChecklistItem>
            Twitter/X launch thread prepared (7 tweets)
          </ChecklistItem>
          <ChecklistItem>
            Indie Hackers post written (ready to publish)
          </ChecklistItem>
          <ChecklistItem>
            Reddit posts ready (r/SideProject, r/SaaS)
          </ChecklistItem>
          <ChecklistItem>3 demo reels created for social proof</ChecklistItem>
          <ChecklistItem>@OneReelApp Twitter account created</ChecklistItem>
          <ChecklistItem>
            Public profile pages optimized for sharing
          </ChecklistItem>
          <ChecklistItem>SEO metadata added to all pages</ChecklistItem>
          <ChecklistItem checked>
            "Made with One Reel" watermark links to homepage
          </ChecklistItem>
        </Section>

        {/* PHASE 9: REVENUE */}
        <Section title="Phase 9: Revenue Optimization" status="complete">
          <ChecklistItem checked>
            Pricing validated ($19/month Pro tier)
          </ChecklistItem>
          <ChecklistItem checked>
            Upgrade flow takes &lt;30 seconds
          </ChecklistItem>
          <ChecklistItem checked>
            Conversion triggers positioned (limit hit, watermark, HD export)
          </ChecklistItem>
          <ChecklistItem checked>
            Stripe webhook handling subscription events
          </ChecklistItem>
          <ChecklistItem checked>
            Free tier limits enforced (3/day, 10/month)
          </ChecklistItem>
          <ChecklistItem checked>Pro tier removes watermark</ChecklistItem>
          <ChecklistItem checked>Usage tracking per profile</ChecklistItem>
        </Section>

        {/* PHASE 10: LAUNCH */}
        <Section title="Phase 10: Launch & Operate" status="pending">
          <ChecklistItem>
            <strong>Launch Day (Do in order):</strong>
          </ChecklistItem>
          <ChecklistItem indent>
            1. Test full journey: signup → create → download
          </ChecklistItem>
          <ChecklistItem indent>
            2. Verify Stripe checkout end-to-end
          </ChecklistItem>
          <ChecklistItem indent>
            3. Post Twitter launch thread (8am EST)
          </ChecklistItem>
          <ChecklistItem indent>
            4. Submit to Product Hunt (12am PST)
          </ChecklistItem>
          <ChecklistItem indent>5. Post to Indie Hackers</ChecklistItem>
          <ChecklistItem indent>
            6. Post to Reddit (r/SideProject first)
          </ChecklistItem>
          <ChecklistItem indent>7. Email personal network</ChecklistItem>
          <ChecklistItem indent>
            8. Monitor /api/monitoring every hour
          </ChecklistItem>
          <ChecklistItem indent>
            9. Respond to comments within 30 minutes
          </ChecklistItem>
        </Section>

        {/* KEY METRICS */}
        <Section title="📊 Key Metrics (Track Daily)" status="active">
          <Metric name="Signups" target="50+ in Week 1" />
          <Metric name="Reels created per user (Day 1)" target="1.5+" />
          <Metric name="% users hitting limits" target="30-40%" />
          <Metric name="Free → Pro conversion" target="5-10%" />
          <Metric name="Failed generations" target="<5%" />
          <Metric name="Avg generation time" target="<60 seconds" />
        </Section>

        {/* 7-DAY PLAN */}
        <Section title="📅 7-Day Post-Launch Operating Plan" status="active">
          <DayPlan
            day="Day 1"
            tasks={[
              "Launch on X, Product Hunt, Indie Hackers, Reddit",
              "Monitor every hour for bugs/crashes",
              "Respond to ALL comments/questions within 30min",
              "Track: signups, reels created, errors",
            ]}
          />

          <DayPlan
            day="Day 2"
            tasks={[
              "Share user-generated reels on X",
              "Fix critical bugs immediately",
              "DM 10 micro-influencers (offer Pro for promotion)",
              "Post behind-the-scenes build thread",
            ]}
          />

          <DayPlan
            day="Day 3-4"
            tasks={[
              "Analyze conversion funnel (where do users drop off?)",
              "A/B test pricing page if conversion <5%",
              "Reach out to users who hit limits (feedback + upgrade offer)",
              "Create case study from power users",
            ]}
          />

          <DayPlan
            day="Day 5-6"
            tasks={[
              "Optimize AI generation based on cost data",
              "Add most-requested feature (if clear signal)",
              "Post weekly growth update on X",
              "Email early users asking for testimonials",
            ]}
          />

          <DayPlan
            day="Day 7"
            tasks={[
              "Review Week 1 metrics (full analysis)",
              "Plan Week 2 roadmap based on data",
              "Write blog post: 'What I learned launching One Reel'",
              "Decide: double down on growth OR improve product",
            ]}
          />
        </Section>

        {/* DECISION TREE */}
        <Section title="🔀 Week 1 Decision Tree" status="guide">
          <DecisionPath
            condition="If <20 signups in Week 1"
            action="Focus on distribution. Launch on more channels. Reach out to influencers."
          />
          <DecisionPath
            condition="If 50+ signups but low usage (avg <1 reel/user)"
            action="Onboarding problem. Add tutorial video. Simplify UI. Add templates."
          />
          <DecisionPath
            condition="If high usage but 0% Pro conversion"
            action="Pricing issue. Test $9/month. Add annual option. Better value prop."
          />
          <DecisionPath
            condition="If >10% failed generations"
            action="AI quality problem. Improve prompts. Add retry logic. Switch provider."
          />
          <DecisionPath
            condition="If >100 signups + 10%+ conversion"
            action="Working! Scale marketing. Add auto-posting. Build mobile app."
          />
        </Section>

        {/* DISTRIBUTION POSTS */}
        <Section title="📝 Distribution Posts (Ready to Copy)" status="ready">
          <Post
            platform="Twitter/X"
            content={`🎬 Introducing One Reel

The fastest way to create studio-quality vertical reels.

No editing. No prompts. Just pick a mood, camera style, and vibe.

AI does the rest in 60 seconds.

Free to start → [LINK]

Here's how it works 🧵`}
          />

          <Post
            platform="Indie Hackers"
            title="One Reel - Create AI vertical reels in 60 seconds (just launched)"
            content="Hey IH! I just launched One Reel - an AI platform that generates studio-quality vertical reels without editing. Instead of spending hours, creators pick mood/camera/style and AI generates in ~60 seconds. Free: 3/day, Pro: $19/mo unlimited. Would love feedback!"
          />

          <Post
            platform="Reddit (r/SideProject)"
            title="I built an AI tool that creates vertical reels in 60 seconds (no editing)"
            content="Just launched One Reel - create vertical reels by picking vibe (mood, camera, style). AI generates complete reel, no timeline needed. Perfect for X creators, entrepreneurs, anyone who needs vertical content fast. Try it: [LINK]"
          />
        </Section>

        {/* FINAL STATUS */}
        <div className="mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-500">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <div>
              <h2 className="text-2xl font-extrabold text-green-900 dark:text-green-100">
                ✅ LAUNCH READY
              </h2>
              <p className="text-green-700 dark:text-green-200">
                All systems operational. Platform is production-ready.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <StatusCard label="Platform Hardening" status="Complete" />
            <StatusCard label="Onboarding" status="Optimized" />
            <StatusCard label="Revenue System" status="Active" />
            <StatusCard label="Monitoring" status="Live" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, status, children }) {
  const statusColors = {
    complete: "text-green-600 bg-green-50 dark:bg-green-900/20",
    ready: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    pending: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    active: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    guide: "text-gray-600 bg-gray-50 dark:bg-gray-800/20",
  };

  return (
    <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 mb-6 border border-[#E5E7EB] dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#111418] dark:text-white">
          {title}
        </h2>
        {status && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}
          >
            {status}
          </span>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ChecklistItem({ checked, children, indent }) {
  return (
    <div className={`flex items-start gap-3 ${indent ? "ml-8" : ""}`}>
      {checked ? (
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      ) : (
        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
      )}
      <span className="text-[#111418] dark:text-white">{children}</span>
    </div>
  );
}

function Metric({ name, target }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-white/10 last:border-0">
      <span className="font-semibold text-[#111418] dark:text-white">
        {name}
      </span>
      <span className="text-[#667085] dark:text-white/60">{target}</span>
    </div>
  );
}

function DayPlan({ day, tasks }) {
  return (
    <div className="mb-4">
      <h3 className="font-bold text-[#111418] dark:text-white mb-2">{day}</h3>
      <ul className="ml-6 space-y-1">
        {tasks.map((task, i) => (
          <li key={i} className="text-[#667085] dark:text-white/60 list-disc">
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecisionPath({ condition, action }) {
  return (
    <div className="p-4 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl mb-3">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#1DA1F2] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#111418] dark:text-white mb-1">
            {condition}
          </p>
          <p className="text-[#667085] dark:text-white/60 text-sm">
            → {action}
          </p>
        </div>
      </div>
    </div>
  );
}

function Post({ platform, title, content }) {
  return (
    <div className="p-4 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl mb-3">
      <div className="font-bold text-[#1DA1F2] mb-2">{platform}</div>
      {title && (
        <div className="font-semibold text-[#111418] dark:text-white mb-2">
          {title}
        </div>
      )}
      <p className="text-sm text-[#667085] dark:text-white/60 whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

function StatusCard({ label, status }) {
  return (
    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
      <div className="text-sm text-green-700 dark:text-green-300">{label}</div>
      <div className="font-bold text-green-900 dark:text-green-100">
        {status}
      </div>
    </div>
  );
}
