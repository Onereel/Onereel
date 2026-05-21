import { auth } from "@/auth"; // ✅ FIXED: Direct auth import (no safe-auth wrapper)
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🔒 CRITICAL AUTH FIX - AUTHENTICATION FLOW AUDIT COMPLETE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * FIXES APPLIED:
 * ✅ Direct @/auth import (removed safe-auth wrapper that returned null)
 * ✅ Enhanced logging for AUTH_URL, cookies, and session validation
 * ✅ Frontend sends credentials: "include" in fetch calls
 *
 * SECURITY:
 * - Authentication required (no anonymous users)
 * - Free tier: 3 videos max (configurable)
 * - Pro tier: Unlimited
 * - Admin override support
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

const LUMA_API_ENDPOINT =
  "https://api.lumalabs.ai/dream-machine/v1/generations";
const MAX_RETRIES = 2;
const RETRY_DELAYS = [1000, 3000];
const DEBUG_MODE = true; // ⚠️ SET TO FALSE FOR PRODUCTION

/**
 * Call Luma API with production model
 */
async function callLumaAPI(prompt, duration, aspectRatio, attempt = 0) {
  const apiKey = process.env.LUMA_API_KEY;

  if (!apiKey) {
    throw new Error("LUMA_API_KEY not configured in environment variables");
  }

  const requestBody = {
    model: "ray-2", // ✅ Valid Luma production model
    prompt: prompt,
    aspect_ratio: aspectRatio,
    loop: false,
  };

  console.log("🎬 Calling Luma API:", {
    model: requestBody.model,
    attempt: attempt + 1,
  });

  let response;
  let responseText;

  try {
    response = await fetch(LUMA_API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }

      console.error("[Luma] API Error:", response.status, errorData);

      if (response.status === 401) {
        const error = new Error("Luma API authentication failed (401)");
        error.status = 401;
        throw error;
      }

      if (response.status === 429) {
        const error = new Error("Luma API rate limit exceeded (429)");
        error.status = 429;
        throw error;
      }

      if (response.status === 400) {
        const error = new Error("Luma API rejected request as invalid (400)");
        error.status = 400;
        error.rawResponse = responseText;
        throw error;
      }

      // Retry on 5xx errors
      if (response.status >= 500 && attempt < MAX_RETRIES) {
        const retryDelay = RETRY_DELAYS[attempt];
        console.warn(`[Luma] Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return callLumaAPI(prompt, duration, aspectRatio, attempt + 1);
      }

      const error = new Error(`Luma API error ${response.status}`);
      error.status = response.status;
      error.rawResponse = responseText;
      throw error;
    }

    const lumaResult = JSON.parse(responseText);

    if (!lumaResult.id) {
      throw new Error("Luma API response missing job ID");
    }

    console.log("✅ Luma job created:", lumaResult.id);

    return {
      success: true,
      job_id: lumaResult.id,
      status: lumaResult.state,
      created_at: lumaResult.created_at,
      provider: "luma-dream-machine",
      estimated_duration: "2-5 minutes",
    };
  } catch (error) {
    console.error("[Luma] Error:", error.message);
    throw error;
  }
}

/**
 * POST: Generate reel (AUTHENTICATION REQUIRED + LIMITS ENFORCED)
 */
export async function POST(request) {
  const requestStartTime = Date.now();

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  🎬 REEL GENERATION REQUEST (AUTH FLOW AUDITED)      ║");
  console.log("╚═══════════════════════════════════════════════════════╝");

  let session = null;
  let userProfile = null;
  let formData = null;
  let userLimit = 3;

  try {
    // ═══════════════════════════════════════════════════════
    // STEP 1: PARSE REQUEST
    // ═══════════════════════════════════════════════════════
    formData = await request.json();
    const { title, description, mood, cameraStyle, visualStyle, duration } =
      formData;

    if (!title || !mood || !cameraStyle || !visualStyle || !duration) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields",
          details:
            "title, mood, cameraStyle, visualStyle, and duration are required",
        },
        { status: 400 },
      );
    }

    // ═══════════════════════════════════════════════════════
    // 🔒 STEP 2: AUTHENTICATION REQUIRED - NO ANONYMOUS USERS
    // ═══════════════════════════════════════════════════════
    console.log("🔐 Checking Authentication...");
    console.log("📋 Request Headers:");
    console.log(
      "   - Cookie:",
      request.headers.get("cookie")?.substring(0, 50) + "...",
    );
    console.log("   - Origin:", request.headers.get("origin"));
    console.log("   - Referer:", request.headers.get("referer"));
    console.log("   - Host:", request.headers.get("host"));
    console.log("📋 Environment:");
    console.log("   - AUTH_URL:", process.env.AUTH_URL);
    console.log("   - AUTH_SECRET set:", !!process.env.AUTH_SECRET);
    console.log("   - NODE_ENV:", process.env.NODE_ENV);
    console.log("   - APP_URL:", process.env.APP_URL);

    try {
      const authStartTime = Date.now();
      session = await auth();
      const authDuration = Date.now() - authStartTime;
      console.log(`   - Auth call completed in ${authDuration}ms`);
    } catch (authError) {
      console.error("❌ Auth function threw error:", authError.message);
      console.error("   Error type:", authError.name);
      console.error("   Stack:", authError.stack?.split("\n").slice(0, 3));
    }

    console.log("🔍 Session check result:");
    console.log("   - Session exists:", !!session);
    console.log("   - Session.user exists:", !!session?.user);
    if (session?.user) {
      console.log("   - User ID:", session.user.id);
      console.log("   - User email:", session.user.email);
    }

    if (!session?.user) {
      console.error("❌ BLOCKED: Anonymous user attempted video generation");
      console.error("🔍 DEBUG INFO:");
      console.error("   - Session object:", session);
      console.error(
        "   - Cookie header present:",
        !!request.headers.get("cookie"),
      );
      console.error("   - AUTH_SECRET set:", !!process.env.AUTH_SECRET);
      console.error("   - AUTH_URL:", process.env.AUTH_URL);
      console.error("   - Database URL set:", !!process.env.DATABASE_URL);

      // Check if there are active sessions in database
      try {
        const activeSessions = await sql`
          SELECT COUNT(*) as count 
          FROM auth_sessions 
          WHERE expires > CURRENT_TIMESTAMP
        `;
        console.error(
          "   - Active sessions in DB:",
          activeSessions[0]?.count || 0,
        );
      } catch (dbErr) {
        console.error("   - Could not check DB sessions:", dbErr.message);
      }

      return Response.json(
        {
          success: false,
          error: "Authentication required",
          message: "You must be signed in to generate videos.",
          requiresAuth: true,
          actionRequired: "Please sign in or create an account to continue",
          debug: {
            sessionExists: !!session,
            userExists: !!session?.user,
            cookiePresent: !!request.headers.get("cookie"),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 },
      );
    }

    console.log(`✅ User authenticated: ${session.user.email}`);

    // ═══════════════════════════════════════════════════════
    // 🔒 STEP 3: CHECK GENERATION LIMITS
    // ═══════════════════════════════════════════════════════
    console.log("📊 Checking Generation Limits...");

    // Get user profile with reel count
    const profileResult = await sql`
      SELECT p.*, 
             COALESCE((SELECT COUNT(*) FROM reels WHERE profile_id = p.id), 0) as total_reels_created
      FROM profiles p
      WHERE p.user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      // Auto-create profile
      console.log("Creating new profile...");
      const username = session.user.email
        ? session.user.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 30) || `user${Date.now()}`
        : `user_${session.user.id.slice(0, 8)}`;

      const newProfile = await sql`
        INSERT INTO profiles (
          user_id, username, name, bio, role,
          onboarding_completed, subscription_tier
        ) VALUES (
          ${session.user.id}, ${username},
          ${session.user.name || "Creator"}, 'AI content creator', 'both',
          false, 'free'
        )
        RETURNING *, 0 as total_reels_created
      `;

      userProfile = newProfile[0];
    } else {
      userProfile = profileResult[0];
    }

    console.log(`User: ${userProfile.name} (${userProfile.subscription_tier})`);
    console.log(`Total Reels: ${userProfile.total_reels_created}`);

    // Get generation limit from platform settings
    const limitSetting = await sql`
      SELECT setting_value 
      FROM platform_settings 
      WHERE setting_key = 'free_tier_generation_limit'
    `;

    const generationLimit =
      limitSetting.length > 0 ? parseInt(limitSetting[0].setting_value) : 3;

    // Check for user-specific override
    const overrideSetting = await sql`
      SELECT setting_value 
      FROM platform_settings 
      WHERE setting_key = ${"user_limit_override_" + userProfile.id}
    `;

    userLimit =
      overrideSetting.length > 0
        ? parseInt(overrideSetting[0].setting_value)
        : generationLimit;

    console.log(`User Limit: ${userLimit}`);

    // ENFORCE LIMITS FOR FREE TIER
    if (userProfile.subscription_tier === "free") {
      if (userProfile.total_reels_created >= userLimit) {
        console.error("❌ BLOCKED: Generation limit exceeded");
        console.error(
          `   Created: ${userProfile.total_reels_created}/${userLimit}`,
        );

        return Response.json(
          {
            success: false,
            error: "Generation limit exceeded",
            message: `You've reached your limit of ${userLimit} free videos.`,
            limitExceeded: true,
            details: {
              created: userProfile.total_reels_created,
              limit: userLimit,
              subscription: userProfile.subscription_tier,
            },
            actionRequired: "Upgrade to Pro for unlimited video generation",
            upgradeUrl: "/pricing",
          },
          { status: 403 },
        );
      }

      console.log(
        `✅ Limit check passed: ${userProfile.total_reels_created}/${userLimit}`,
      );
    } else {
      console.log(`✅ Pro user - unlimited generations`);
    }

    // ═══════════════════════════════════════════════════════
    // 🔒 STEP 3B: SAFETY CONTROLS CHECK
    // ═══════════════════════════════════════════════════════
    console.log("🚨 Checking Safety Controls...");

    // Check global kill switch
    const globalEnabled = await sql`
      SELECT setting_value FROM platform_settings 
      WHERE setting_key = 'global_generation_enabled'
    `;

    if (
      globalEnabled.length > 0 &&
      globalEnabled[0].setting_value === "false"
    ) {
      console.error("❌ BLOCKED: Global generation disabled by admin");
      return Response.json(
        {
          success: false,
          error: "Video generation temporarily disabled",
          message:
            "Our system is currently undergoing maintenance. Please try again soon.",
          maintenanceMode: true,
        },
        { status: 503 },
      );
    }

    // Check daily generation cap
    const dailyCap = await sql`
      SELECT setting_value FROM platform_settings 
      WHERE setting_key = 'daily_generation_cap'
    `;

    if (dailyCap.length > 0) {
      const cap = parseInt(dailyCap[0].setting_value);
      const today = new Date().toISOString().split("T")[0];

      const todayCount = await sql`
        SELECT COUNT(*) as count 
        FROM reels 
        WHERE DATE(created_at) = ${today}
      `;

      if (parseInt(todayCount[0].count) >= cap) {
        console.error("❌ BLOCKED: Daily generation cap reached");
        return Response.json(
          {
            success: false,
            error: "Daily generation limit reached",
            message:
              "We've reached our daily capacity. Please try again tomorrow.",
            dailyCapReached: true,
          },
          { status: 429 },
        );
      }
    }

    console.log("✅ Safety checks passed");

    // ═══════════════════════════════════════════════════════
    // STEP 4: GENERATE VIDEO
    // ═══════════════════════════════════════════════════════
    const aiPrompt = `Ultra-cinematic 9:16 vertical video: ${description || title}. 
Mood: ${mood}. Camera: ${cameraStyle}. Visual style: ${visualStyle}. 
Duration: ${duration} seconds. Professional filmmaking, immersive atmosphere.
Film grain, color grading, dramatic lighting. Pure visual storytelling.`;

    console.log("🎬 Starting video generation...");

    let videoJobId = null;
    let videoStatus = "processing";
    let videoUrl = "";

    try {
      const lumaResult = await callLumaAPI(aiPrompt, duration, "9:16");

      if (lumaResult.success && lumaResult.job_id) {
        videoJobId = lumaResult.job_id;
        videoStatus = "processing";
      }
    } catch (videoError) {
      console.error("❌ Luma API failed:", videoError.message);

      return Response.json(
        {
          success: false,
          error: "Video generation failed",
          details: videoError.message,
          status: videoError.status || 500,
        },
        { status: videoError.status || 500 },
      );
    }

    // ═══════════════════════════════════════════════════════
    // STEP 5: SAVE TO DATABASE
    // ═══════════════════════════════════════════════════════
    const reel = await sql`
      INSERT INTO reels (
        profile_id, title, description, video_url, thumbnail_url,
        mood, camera_style, visual_style, duration, ai_prompt_used,
        generation_status, generation_progress, has_watermark, metadata
      ) VALUES (
        ${userProfile.id}, ${title}, ${description || null},
        ${videoUrl}, ${""},
        ${mood}, ${cameraStyle}, ${visualStyle}, ${duration}, ${aiPrompt},
        'processing', 50, false,
        ${JSON.stringify({
          videoJobId,
          videoProvider: "luma-dream-machine",
          videoStatus: "processing",
          generationTime: Date.now() - requestStartTime,
        })}
      )
      RETURNING *
    `;

    console.log("✅ DATABASE INSERT COMPLETE:");
    console.log("   - reel.id:", reel[0].id);
    console.log("   - reel.profile_id:", reel[0].profile_id);
    console.log("   - reel.generation_status:", reel[0].generation_status);
    console.log("   - reel.metadata.videoJobId:", reel[0].metadata?.videoJobId);
    console.log("   - reel.created_at:", reel[0].created_at);
    console.log(`╚═══════════════════════════════════════════════════════╝\n`);

    return Response.json({
      success: true,
      reel: {
        ...reel[0],
        video_status: videoStatus,
        video_job_id: videoJobId,
      },
      usage: {
        created: userProfile.total_reels_created + 1,
        limit:
          userProfile.subscription_tier === "free" ? userLimit : "unlimited",
        remaining:
          userProfile.subscription_tier === "free"
            ? Math.max(0, userLimit - (userProfile.total_reels_created + 1))
            : "unlimited",
      },
      message: "Reel created! Video is rendering in the background.",
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);

    return Response.json(
      {
        success: false,
        error: "Video generation failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET: Health check
 */
export async function GET(request) {
  const apiKey = process.env.LUMA_API_KEY;

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      LUMA_API_KEY_present: !!apiKey,
      model: "ray-2",
      AUTH_URL: process.env.AUTH_URL,
      AUTH_SECRET_set: !!process.env.AUTH_SECRET,
    },
    limits: {
      authentication: "required",
      free_tier: "3 videos (configurable)",
      pro_tier: "unlimited",
    },
  });
}
