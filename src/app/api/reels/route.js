import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * POST: Create a new AI-generated reel
 */
export async function POST(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch (authError) {
      console.error("[Reels API] Auth error:", authError.message);
      return Response.json(
        { error: "Authentication service unavailable" },
        { status: 503 },
      );
    }

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const profile = await sql`
      SELECT * FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileId = profile[0].id;

    const { title, description, mood, cameraStyle, visualStyle, duration } =
      await request.json();

    if (!title || !mood || !cameraStyle || !visualStyle || !duration) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("[Reels API] Generating reel for:", {
      title,
      mood,
      cameraStyle,
      visualStyle,
      duration,
    });

    // Convert selections to AI prompt
    const aiPrompt = `Create a cinematic ${duration}-second video reel with a ${mood} mood. Use ${cameraStyle} camera movements and ${visualStyle} visual aesthetic. The scene should feel ${mood} and immersive. Content: ${title}. ${description || ""}`;

    console.log("[Reels API] AI Prompt:", aiPrompt);

    // Generate AI image (placeholder for video - they can swap this with video API later)
    const imageResponse = await fetch("/integrations/dall-e-3/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${aiPrompt}. Cinematic frame, professional videography, 16:9 aspect ratio, high quality`,
        size: "1792x1024",
        quality: "hd",
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("[Reels API] Image generation failed:", errorText);
      throw new Error("Failed to generate reel content");
    }

    const imageResult = await imageResponse.json();
    const videoUrl = imageResult.data?.[0]?.url;

    if (!videoUrl) {
      throw new Error("No image URL returned from AI");
    }

    console.log("[Reels API] Generated content URL:", videoUrl);

    // Save reel to database
    const reel = await sql`
      INSERT INTO reels (
        profile_id, title, description, video_url, thumbnail_url,
        mood, camera_style, visual_style, duration, ai_prompt_used,
        metadata
      ) VALUES (
        ${profileId}, ${title}, ${description || null}, ${videoUrl}, ${videoUrl},
        ${mood}, ${cameraStyle}, ${visualStyle}, ${duration}, ${aiPrompt},
        ${JSON.stringify({ generatedAt: new Date().toISOString() })}
      )
      RETURNING *
    `;

    // Track usage
    const monthYear = new Date().toISOString().slice(0, 7);
    await sql`
      INSERT INTO ai_usage_analytics (profile_id, feature_type, month_year, usage_count)
      VALUES (${profileId}, 'reel', ${monthYear}, 1)
      ON CONFLICT (profile_id, feature_type, month_year)
      DO UPDATE SET usage_count = ai_usage_analytics.usage_count + 1
    `;

    console.log("[Reels API] Reel created:", reel[0].id);

    return Response.json({
      success: true,
      reel: reel[0],
    });
  } catch (error) {
    console.error("[Reels API] Error:", error);
    return Response.json(
      { error: "Failed to create reel", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch user's reels or all public reels
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const username = searchParams.get("username");

    console.log("📥 REELS FETCH REQUEST:");
    console.log("   - profileId:", profileId || "none");
    console.log("   - username:", username || "none");

    let reels;

    if (profileId) {
      // Get specific user's reels
      console.log("   - Fetching reels for profileId:", profileId);

      reels = await sql`
        SELECT r.*, p.name, p.username, p.profile_image_url
        FROM reels r
        JOIN profiles p ON r.profile_id = p.id
        WHERE r.profile_id = ${profileId}
        ORDER BY r.created_at DESC
      `;

      console.log("✅ REELS FETCH COMPLETE:");
      console.log("   - Total reels found:", reels.length);
      console.log(
        "   - Processing reels:",
        reels.filter((r) => r.generation_status === "processing").length,
      );
      console.log(
        "   - Completed reels:",
        reels.filter((r) => r.generation_status === "completed").length,
      );

      if (reels.length > 0) {
        console.log(
          "   - Sample reel IDs:",
          reels.slice(0, 3).map((r) => r.id),
        );
      }
    } else if (username) {
      // Get reels by username
      const profile = await sql`
        SELECT id FROM profiles WHERE username = ${username}
      `;

      if (profile.length === 0) {
        return Response.json({ success: true, reels: [] });
      }

      reels = await sql`
        SELECT r.*, p.name, p.username, p.profile_image_url
        FROM reels r
        JOIN profiles p ON r.profile_id = p.id
        WHERE r.profile_id = ${profile[0].id}
        ORDER BY r.created_at DESC
      `;
    } else {
      // Get all public reels (for discovery feed)
      reels = await sql`
        SELECT r.*, p.name, p.username, p.profile_image_url
        FROM reels r
        JOIN profiles p ON r.profile_id = p.id
        ORDER BY r.created_at DESC
        LIMIT 50
      `;
    }

    return Response.json({ success: true, reels });
  } catch (error) {
    console.error("[Reels API] GET Error:", error);
    return Response.json({ error: "Failed to fetch reels" }, { status: 500 });
  }
}
