import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MARKETPLACE SEEDING
 * Generate high-quality starter collaborations to prevent empty state
 * ═══════════════════════════════════════════════════════════════════════
 */

const SEED_COLLABORATIONS = [
  {
    title: "Travel YouTube Series Seeking Video Editor",
    vision:
      "Building a travel YouTube channel focused on off-the-beaten-path destinations. Looking for an editor who can create cinematic, engaging content that keeps viewers hooked. Great opportunity to grow your portfolio with high-quality travel content.",
    roles: ["Video Editor", "Colorist"],
    skills: [
      "premiere pro",
      "davinci resolve",
      "color grading",
      "storytelling",
    ],
    type: "paid",
    compensation: "$300-500 per episode",
    timeline: "Within 1 week",
    style: "remote",
    industry: "YouTube",
    niche: "Travel",
    urgency: "normal",
  },
  {
    title: "Podcast Launch Team - Co-Host & Producer Needed",
    vision:
      "Starting a tech podcast covering AI, startups, and innovation. Need a co-host with strong tech knowledge and a producer to handle editing and distribution. Perfect for someone passionate about the future of technology.",
    roles: ["Co-Host", "Producer", "Sound Designer"],
    skills: ["audio editing", "podcast production", "tech knowledge"],
    type: "partnership",
    compensation: "Revenue share after monetization",
    timeline: "Within 1 month",
    style: "hybrid",
    industry: "Podcast",
    niche: "Technology",
    urgency: "normal",
  },
  {
    title: "AI Creator Studio - Building Content Automation Tools",
    vision:
      "Creating a suite of AI tools for content creators. Looking for developers, designers, and content strategists to build something revolutionary. Equity-based opportunity with huge growth potential.",
    roles: ["Developer", "Designer", "Content Strategist"],
    skills: ["javascript", "react", "ui design", "content strategy"],
    type: "equity",
    compensation: "5-10% equity share",
    timeline: "ASAP - Ready to start now",
    style: "remote",
    industry: "Brand Content",
    niche: "AI & Tech",
    urgency: "urgent",
  },
  {
    title: "Indie Short Film Crew - Cinematographer & Sound Designer",
    vision:
      "Working on a 15-minute dramatic short film about human connection in the digital age. Need talented cinematographer and sound designer who are passionate about storytelling. Festival submission planned.",
    roles: ["Cinematographer", "Sound Designer", "Assistant Director"],
    skills: ["cinematography", "sound design", "film production"],
    type: "passion",
    compensation: "Portfolio credit + festival exposure",
    timeline: "Within 1 month",
    style: "local",
    location: "Los Angeles, CA",
    industry: "Film & Video",
    niche: "Independent Film",
    urgency: "normal",
  },
  {
    title: "Remote TikTok Growth Team - Editors & Strategists",
    vision:
      "Building a viral TikTok account focused on productivity hacks and life optimization. Need editors who understand short-form content and strategists who know what makes content pop on TikTok.",
    roles: ["Video Editor", "Content Strategist", "Thumbnail Designer"],
    skills: ["short-form editing", "tiktok trends", "viral content"],
    type: "paid",
    compensation: "$200-400 per week",
    timeline: "ASAP - Ready to start now",
    style: "remote",
    industry: "TikTok",
    niche: "Lifestyle",
    urgency: "high",
  },
  {
    title: "Music Video Production - Director & Cinematographer",
    vision:
      "Creating a music video for an upcoming indie artist. Looking for a director with a unique visual style and cinematographer who can execute it beautifully. Budget allocated for professional production.",
    roles: ["Director", "Cinematographer", "Editor"],
    skills: ["music video", "directing", "cinematography"],
    type: "paid",
    compensation: "$1,500-2,500 total budget",
    timeline: "Within 1 week",
    style: "local",
    location: "New York, NY",
    industry: "Music Video",
    niche: "Indie Music",
    urgency: "urgent",
  },
  {
    title: "Brand Content Series - Motion Designer Needed",
    vision:
      "Working with multiple brands to create engaging social content. Need a motion designer who can create eye-catching animations and graphics. Ongoing work opportunity for the right person.",
    roles: ["Motion Designer", "Animator"],
    skills: ["after effects", "motion graphics", "brand design"],
    type: "paid",
    compensation: "$500+ per project",
    timeline: "Flexible timeline",
    style: "remote",
    industry: "Brand Content",
    niche: "Social Media",
    urgency: "normal",
  },
  {
    title: "Documentary Film - Research Assistant & Editor",
    vision:
      "Documenting climate change solutions around the world. Need a research assistant to help with story development and an editor for post-production. Meaningful project with real impact.",
    roles: ["Research Assistant", "Editor", "Producer"],
    skills: ["research", "documentary editing", "storytelling"],
    type: "partnership",
    compensation: "Revenue share + grant funding",
    timeline: "Within 1 month",
    style: "hybrid",
    industry: "Documentary",
    niche: "Environment",
    urgency: "normal",
  },
  {
    title: "Animation Series - 2D Animator & Character Designer",
    vision:
      "Creating an animated web series with unique characters and storytelling. Looking for 2D animators and character designers who want to be part of something special from the ground up.",
    roles: ["Animator", "Character Designer", "Storyboard Artist"],
    skills: ["2d animation", "character design", "storyboarding"],
    type: "passion",
    compensation: "Portfolio credit + potential revenue share",
    timeline: "Flexible timeline",
    style: "remote",
    industry: "Animation",
    niche: "Web Series",
    urgency: "low",
  },
  {
    title: "Instagram Brand Partnership - Photographer & Editor",
    vision:
      "Working with lifestyle brands to create Instagram content that converts. Need a photographer for product shots and editor for batch editing. Steady work with multiple brands.",
    roles: ["Photographer", "Editor", "Social Media Manager"],
    skills: ["product photography", "photo editing", "instagram"],
    type: "paid",
    compensation: "$400-700 per brand",
    timeline: "ASAP - Ready to start now",
    style: "hybrid",
    industry: "Instagram",
    niche: "Lifestyle Brands",
    urgency: "high",
  },
];

const SEED_CREATOR_PROFILES = [
  {
    name: "Alex Chen",
    username: "alexchen",
    bio: "Travel filmmaker & content creator",
    verified: true,
  },
  {
    name: "Sarah Mitchell",
    username: "sarahmitchell",
    bio: "Tech podcaster & startup advisor",
    verified: false,
  },
  {
    name: "Marcus Johnson",
    username: "marcusj",
    bio: "Full-stack developer & AI enthusiast",
    verified: true,
  },
  {
    name: "Emma Rodriguez",
    username: "emmarodriguez",
    bio: "Independent filmmaker & cinematographer",
    verified: false,
  },
  {
    name: "David Park",
    username: "davidpark",
    bio: "TikTok strategist & viral content expert",
    verified: true,
  },
  {
    name: "Maya Thompson",
    username: "mayathompson",
    bio: "Music video director",
    verified: false,
  },
  {
    name: "Jordan Lee",
    username: "jordanlee",
    bio: "Motion designer & brand specialist",
    verified: true,
  },
  {
    name: "Priya Patel",
    username: "priyapatel",
    bio: "Documentary filmmaker",
    verified: false,
  },
  {
    name: "Chris Anderson",
    username: "chrisanderson",
    bio: "2D animator & character artist",
    verified: true,
  },
  {
    name: "Sofia Martinez",
    username: "sofiamartinez",
    bio: "Brand photographer & content strategist",
    verified: false,
  },
];

export async function GET(request) {
  try {
    // Check total collaborations
    const totalCollabs = await sql`
      SELECT COUNT(*) as count FROM collaborations WHERE status = 'active'
    `;

    const count = parseInt(totalCollabs[0].count);

    if (count >= 15) {
      return Response.json({
        success: true,
        message: "Marketplace has sufficient collaborations",
        count,
        seeded: false,
      });
    }

    // Get or create seed creator profiles
    const seededProfiles = [];

    for (const creator of SEED_CREATOR_PROFILES) {
      // Check if profile exists
      let profile = await sql`
        SELECT id FROM profiles WHERE x_username = ${creator.username}
      `;

      if (!profile || profile.length === 0) {
        // Create system user for this seed profile
        // Note: This creates profiles without auth users - they're system-generated
        const created = await sql`
          INSERT INTO profiles (
            user_id,
            x_username,
            x_user_id,
            name,
            bio,
            x_verified,
            role
          ) VALUES (
            ${"seed_" + creator.username},
            ${creator.username},
            ${"seed_" + creator.username},
            ${creator.name},
            ${creator.bio},
            ${creator.verified},
            'both'
          )
          RETURNING id
        `;
        profile = created;
      }

      seededProfiles.push(profile[0].id);
    }

    // Create seed collaborations
    const needed = Math.min(15 - count, SEED_COLLABORATIONS.length);
    const toCreate = SEED_COLLABORATIONS.slice(0, needed);

    const created = [];

    for (let i = 0; i < toCreate.length; i++) {
      const collab = toCreate[i];
      const creatorId = seededProfiles[i % seededProfiles.length];

      const result = await sql`
        INSERT INTO collaborations (
          creator_id,
          title,
          vision,
          roles_needed,
          required_skills,
          collab_type,
          compensation_details,
          estimated_timeline,
          collab_style,
          location,
          industry,
          niche,
          urgency_level,
          status,
          visibility
        ) VALUES (
          ${creatorId},
          ${collab.title},
          ${collab.vision},
          ${collab.roles},
          ${collab.skills},
          ${collab.type},
          ${collab.compensation},
          ${collab.timeline},
          ${collab.style},
          ${collab.location || null},
          ${collab.industry},
          ${collab.niche},
          ${collab.urgency},
          'active',
          'public'
        )
        RETURNING id
      `;

      created.push(result[0].id);
    }

    return Response.json({
      success: true,
      message: `Seeded ${created.length} collaborations`,
      created: created.length,
      total: count + created.length,
      seeded: true,
    });
  } catch (error) {
    console.error("[Seed Collaborations] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Allow manual triggering via POST (for admin use)
export async function POST(request) {
  return GET(request);
}
