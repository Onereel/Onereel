import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Check if sample data already exists
    const existingGigs = await sql`
      SELECT COUNT(*) as count FROM gigs 
      WHERE freelancer_id IN (
        SELECT id FROM profiles WHERE x_username LIKE 'demo_%'
      )
    `;

    if (existingGigs[0].count > 0) {
      return Response.json({
        message: "Sample data already exists",
        count: existingGigs[0].count,
      });
    }

    // Create sample profiles
    const sampleProfiles = [
      {
        user_id: "demo_user_1",
        x_username: "demo_videomaster",
        x_user_id: "demo_1",
        name: "Alex Turner",
        bio: "Professional video editor with 5+ years of experience. Specialized in YouTube content, podcasts, and social media videos.",
        skills: [
          "Video Editing",
          "Color Grading",
          "Motion Graphics",
          "Adobe Premiere",
          "DaVinci Resolve",
        ],
        role: "freelancer",
        category: "Video Editing",
        hourly_rate: 75.0,
        rating: 4.9,
        total_reviews: 127,
      },
      {
        user_id: "demo_user_2",
        x_username: "demo_musicpro",
        x_user_id: "demo_2",
        name: "Jordan Lee",
        bio: "Music producer and composer. Creating custom tracks for content creators, podcasts, and commercial projects.",
        skills: [
          "Music Production",
          "Sound Design",
          "Mixing",
          "Mastering",
          "Logic Pro",
        ],
        role: "freelancer",
        category: "Music Production",
        hourly_rate: 85.0,
        rating: 5.0,
        total_reviews: 93,
      },
      {
        user_id: "demo_user_3",
        x_username: "demo_designwizard",
        x_user_id: "demo_3",
        name: "Sam Rivera",
        bio: "Creative designer specializing in thumbnails, banners, and brand identity for content creators.",
        skills: [
          "Graphic Design",
          "Thumbnail Design",
          "Branding",
          "Photoshop",
          "Figma",
        ],
        role: "freelancer",
        category: "Graphic Design",
        hourly_rate: 60.0,
        rating: 4.8,
        total_reviews: 156,
      },
      {
        user_id: "demo_user_4",
        x_username: "demo_animator",
        x_user_id: "demo_4",
        name: "Casey Morgan",
        bio: "Motion graphics artist and animator. Bringing your content to life with engaging animations and visual effects.",
        skills: [
          "Animation",
          "Motion Graphics",
          "After Effects",
          "Cinema 4D",
          "2D/3D Animation",
        ],
        role: "freelancer",
        category: "Animation",
        hourly_rate: 95.0,
        rating: 4.9,
        total_reviews: 84,
      },
      {
        user_id: "demo_user_5",
        x_username: "demo_scriptwriter",
        x_user_id: "demo_5",
        name: "Morgan Blake",
        bio: "Professional scriptwriter for YouTube videos, documentaries, and educational content. 10+ years of experience.",
        skills: [
          "Scriptwriting",
          "Copywriting",
          "Research",
          "Storytelling",
          "SEO Writing",
        ],
        role: "freelancer",
        category: "Writing",
        hourly_rate: 50.0,
        rating: 4.7,
        total_reviews: 201,
      },
    ];

    const profileIds = [];

    for (const profile of sampleProfiles) {
      const result = await sql`
        INSERT INTO profiles (
          user_id, x_username, x_user_id, name, bio, skills, role, 
          category, hourly_rate, rating, total_reviews, x_verified, onboarding_completed
        ) VALUES (
          ${profile.user_id}, ${profile.x_username}, ${profile.x_user_id}, 
          ${profile.name}, ${profile.bio}, ${profile.skills}, ${profile.role},
          ${profile.category}, ${profile.hourly_rate}, ${profile.rating}, 
          ${profile.total_reviews}, true, true
        ) RETURNING id
      `;
      profileIds.push(result[0].id);
    }

    // Create sample gigs
    const sampleGigs = [
      {
        profileIndex: 0,
        title: "Professional YouTube Video Editing (10-15 min)",
        description:
          "I'll edit your YouTube video with professional cuts, transitions, color grading, and sound design. Includes:\n\n✅ Full video editing with smooth transitions\n✅ Color grading and correction\n✅ Audio mixing and enhancement\n✅ Motion graphics and lower thirds\n✅ 2 rounds of revisions\n\nPerfect for vlogs, tutorials, and documentary-style content. Fast turnaround guaranteed!",
        price: 150.0,
        delivery_days: 3,
        is_boosted: true,
      },
      {
        profileIndex: 1,
        title: "Custom Background Music Track for Your Videos",
        description:
          "Original, royalty-free music composed specifically for your content. Includes:\n\n🎵 Custom track tailored to your style\n🎵 Full commercial rights\n🎵 Multiple formats (MP3, WAV)\n🎵 Stems included for remixing\n🎵 Unlimited revisions until you're happy\n\nGenres: Cinematic, Lo-Fi, Electronic, Ambient, Corporate",
        price: 250.0,
        delivery_days: 5,
        is_boosted: false,
      },
      {
        profileIndex: 2,
        title: "Eye-Catching YouTube Thumbnail Design",
        description:
          "Stand out with professional thumbnail designs that increase click-through rates. Package includes:\n\n🎨 3 unique thumbnail concepts\n🎨 Unlimited revisions\n🎨 High-resolution files (1920x1080)\n🎨 Source files included\n🎨 Fast 24-hour delivery\n\nPerfect for gaming, tech, lifestyle, and educational channels!",
        price: 45.0,
        delivery_days: 1,
        is_boosted: true,
      },
      {
        profileIndex: 3,
        title: "Animated Logo Intro for Your Videos",
        description:
          "Professional animated logo intro to make your content look polished. Includes:\n\n⚡ Custom animation tailored to your brand\n⚡ Sound design and music\n⚡4K resolution export\n⚡ Multiple format options\n⚡ 3 rounds of revisions\n\nDelivery in 5-7 days. Perfect for YouTube, TikTok, and Instagram!",
        price: 180.0,
        delivery_days: 7,
        is_boosted: false,
      },
      {
        profileIndex: 4,
        title: "Engaging Script for Your Next Video (up to 10 min)",
        description:
          "Professionally written script that keeps viewers watching. Includes:\n\n📝 Hook that grabs attention in first 5 seconds\n📝 Clear structure with smooth transitions\n📝 SEO-optimized keywords naturally woven in\n📝 Call-to-action that drives engagement\n📝 2 revisions included\n\nGreat for educational content, product reviews, and storytelling videos!",
        price: 120.0,
        delivery_days: 3,
        is_boosted: false,
      },
    ];

    for (const gig of sampleGigs) {
      await sql`
        INSERT INTO gigs (
          freelancer_id, title, description, price, delivery_days, is_boosted, status
        ) VALUES (
          ${profileIds[gig.profileIndex]}, ${gig.title}, ${gig.description}, 
          ${gig.price}, ${gig.delivery_days}, ${gig.is_boosted}, 'active'
        )
      `;
    }

    return Response.json({
      message: "Sample data created successfully",
      profiles: profileIds.length,
      gigs: sampleGigs.length,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return Response.json(
      { error: "Failed to seed data", details: error.message },
      { status: 500 },
    );
  }
}
