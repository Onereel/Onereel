import sql from "@/app/api/utils/sql";

// ─────────────────────────────────────────────────────────────────────────────
// Direct Luma API status check — NO internal HTTP hop
// The previous approach used fetch(APP_URL || localhost:3000/api/...) which
// breaks in production because APP_URL is unset and localhost:3000 doesn't exist.
// ─────────────────────────────────────────────────────────────────────────────
async function checkLumaJob(jobId) {
  const apiKey = process.env.LUMA_API_KEY;
  if (!apiKey) throw new Error("LUMA_API_KEY not configured");

  const res = await fetch(
    `https://api.lumalabs.ai/dream-machine/v1/generations/${jobId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  const text = await res.text();
  if (!res.ok) throw new Error(`Luma API ${res.status}: ${text}`);

  const data = JSON.parse(text);
  const state = data.state;
  let status = "processing";
  let videoUrl = null;
  let failureReason = null;

  if (state === "completed") {
    videoUrl = data.assets?.video || null;
    status = videoUrl ? "completed" : "unavailable";
    if (!videoUrl) failureReason = "No video URL in completed job";
  } else if (state === "failed") {
    status = "unavailable";
    failureReason = data.failure_reason || "Video generation failed";
  }
  // pending / processing → status stays "processing"

  return {
    status,
    video_url: videoUrl,
    luma_state: state,
    failure_reason: failureReason,
  };
}

// ═══════════════════════════════════════════════════════
// CLOUDINARY UPLOAD HELPER
// Uploads a video from URL to Cloudinary and returns the CDN URL
// ═══════════════════════════════════════════════════════
async function uploadVideoToCloudinary(videoUrl, reelId) {
  const cloudName = process.env._CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log("[Cloudinary] Config check:", {
    cloudName: cloudName ? `${cloudName.substring(0, 5)}...` : "MISSING",
    apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : "MISSING",
    apiSecret: apiSecret ? "SET" : "MISSING",
  });

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("[Cloudinary] Missing credentials — using Luma URL directly");
    return null;
  }

  try {
    console.log(
      "[Cloudinary] Uploading video for reel:",
      reelId,
      "from URL:",
      videoUrl.substring(0, 80) + "...",
    );

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "one-reel/reels";
    const publicId = `reel_${reelId}_${timestamp}`;

    // ✅ CRITICAL FIX: resource_type is in the URL path, NOT in params to sign.
    // Including it in the signature causes a 401 "Invalid Signature" from Cloudinary.
    // Only sign: folder, public_id, timestamp (sorted alphabetically).
    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
    };
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign =
      sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join("&") + apiSecret;

    const { createHash } = await import("crypto");
    const signature = createHash("sha1").update(stringToSign).digest("hex");

    console.log("[Cloudinary] Signature params:", sortedKeys.join(", "));
    console.log(
      "[Cloudinary] Signature (first 8):",
      signature.substring(0, 8) + "...",
    );

    // ✅ Use FormData for robust encoding of URL-based uploads
    const formData = new FormData();
    formData.append("file", videoUrl); // Cloudinary fetches from this URL
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    // NOTE: resource_type is in the URL endpoint (/video/upload), NOT the body

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: "POST",
        body: formData, // Let fetch set the correct multipart Content-Type boundary
      },
    );

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      console.error(
        `[Cloudinary] ❌ Upload failed (${uploadResponse.status}):`,
        errText.substring(0, 500),
      );
      throw new Error(
        `Cloudinary upload failed (${uploadResponse.status}): ${errText.substring(0, 200)}`,
      );
    }

    const result = await uploadResponse.json();
    console.log("[Cloudinary] ✅ Upload successful:", result.secure_url);
    console.log("[Cloudinary]    public_id:", result.public_id);
    console.log("[Cloudinary]    duration:", result.duration, "s");
    return result.secure_url;
  } catch (err) {
    console.error("[Cloudinary] ❌ Upload error:", err.message);
    return null; // graceful fallback — caller will use Luma URL
  }
}

/**
 * BACKGROUND POLLING ENDPOINT FOR LUMA VIDEO JOBS
 *
 * This endpoint can be called:
 * 1. By frontend client polling
 * 2. By a scheduled cron job (future enhancement)
 * 3. By webhook handlers (future enhancement)
 *
 * Updates reel records when Luma videos complete.
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { reelId, jobId } = body;

    if (!reelId || !jobId) {
      return Response.json(
        { success: false, error: "Missing required fields: reelId and jobId" },
        { status: 400 },
      );
    }

    console.log("[Luma Polling] Checking job status:", { reelId, jobId });

    // ── Call Luma directly (no internal HTTP hop) ─────────────────────────
    let statusData;
    try {
      statusData = await checkLumaJob(jobId);
    } catch (lumaErr) {
      console.error("[Luma Polling] Luma API error:", lumaErr.message);
      return Response.json(
        {
          success: false,
          error: "Failed to reach Luma API",
          details: lumaErr.message,
        },
        { status: 500 },
      );
    }

    console.log("[Luma Polling] Status:", {
      reelId,
      jobId,
      status: statusData.status,
      hasVideo: !!statusData.video_url,
    });

    if (
      statusData.status === "completed" ||
      statusData.status === "unavailable"
    ) {
      const updateFields = {
        generation_status:
          statusData.status === "completed" ? "completed" : "processing",
        generation_progress: statusData.status === "completed" ? 100 : 50,
      };

      let finalVideoUrl = statusData.video_url || null;
      let cloudinaryUrl = null;

      if (statusData.status === "completed" && statusData.video_url) {
        console.log(
          "[Luma Polling] Uploading completed video to Cloudinary...",
        );
        cloudinaryUrl = await uploadVideoToCloudinary(
          statusData.video_url,
          reelId,
        );
        if (cloudinaryUrl) {
          finalVideoUrl = cloudinaryUrl;
          console.log("[Luma Polling] ✅ Using Cloudinary URL:", cloudinaryUrl);
        } else {
          console.log(
            "[Luma Polling] ⚠️ Cloudinary upload failed — using Luma URL as fallback",
          );
        }
      }

      if (finalVideoUrl) {
        updateFields.video_url = finalVideoUrl;
      }

      const metadataUpdate = {
        videoStatus: statusData.status,
        videoJobId: jobId,
        videoProvider: "luma-dream-machine",
        lumaState: statusData.luma_state,
        lumaOriginalUrl: statusData.video_url || null,
        cloudinaryUrl: cloudinaryUrl || null,
        lastPolled: new Date().toISOString(),
        completedAt:
          statusData.status === "completed" ? new Date().toISOString() : null,
        failureReason: statusData.failure_reason || null,
      };

      console.log(
        "💾 Updating reel",
        reelId,
        "— status:",
        statusData.status,
        "| url:",
        finalVideoUrl || "none",
      );

      await sql`
        UPDATE reels
        SET 
          generation_status = ${updateFields.generation_status},
          generation_progress = ${updateFields.generation_progress},
          video_url = COALESCE(${finalVideoUrl || null}, video_url),
          metadata = COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify(metadataUpdate)}::jsonb
        WHERE id = ${reelId}
      `;

      console.log("✅ Reel", reelId, "updated | Cloudinary:", !!cloudinaryUrl);

      return Response.json({
        success: true,
        updated: true,
        status: statusData.status,
        video_url: finalVideoUrl,
        cloudinary_url: cloudinaryUrl,
        message:
          statusData.status === "completed"
            ? cloudinaryUrl
              ? "Video generated and saved to Cloudinary successfully"
              : "Video generation completed (stored on Luma)"
            : `Video generation failed: ${statusData.failure_reason || "Unknown error"}`,
      });
    } else {
      await sql`
        UPDATE reels
        SET metadata = COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
          lastPolled: new Date().toISOString(),
          lumaState: statusData.luma_state,
        })}::jsonb
        WHERE id = ${reelId}
      `;

      return Response.json({
        success: true,
        updated: false,
        status: statusData.status,
        message: "Video is still processing",
      });
    }
  } catch (error) {
    console.error("[Luma Polling] Error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to poll Luma status",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET: Batch check multiple reels
 *
 * This can be used by cron jobs to update all pending reels
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    console.log(
      "[Luma Polling] Batch check for processing reels (limit:",
      limit,
      ")",
    );

    const processingReels = await sql`
      SELECT id, video_url, metadata
      FROM reels
      WHERE generation_status = 'processing'
        AND metadata->>'videoProvider' = 'luma-dream-machine'
        AND metadata->>'videoJobId' IS NOT NULL
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    console.log(
      `[Luma Polling] Found ${processingReels.length} reels to check`,
    );

    const results = [];

    for (const reel of processingReels) {
      const jobId = reel.metadata?.videoJobId;
      if (!jobId) {
        console.warn("[Luma Polling] Reel missing jobId:", reel.id);
        continue;
      }

      try {
        // ── Call Luma directly (no internal HTTP hop) ─────────────────────
        const statusData = await checkLumaJob(jobId);

        if (
          statusData.status === "completed" ||
          statusData.status === "unavailable"
        ) {
          let finalVideoUrl = statusData.video_url || null;
          let cloudinaryUrl = null;

          if (statusData.status === "completed" && statusData.video_url) {
            cloudinaryUrl = await uploadVideoToCloudinary(
              statusData.video_url,
              reel.id,
            );
            if (cloudinaryUrl) finalVideoUrl = cloudinaryUrl;
          }

          const metadataUpdate = {
            videoStatus: statusData.status,
            lumaState: statusData.luma_state,
            lumaOriginalUrl: statusData.video_url || null,
            cloudinaryUrl: cloudinaryUrl || null,
            lastPolled: new Date().toISOString(),
            completedAt:
              statusData.status === "completed"
                ? new Date().toISOString()
                : null,
            failureReason: statusData.failure_reason || null,
          };

          await sql`
            UPDATE reels
            SET 
              generation_status = ${statusData.status === "completed" ? "completed" : "processing"},
              generation_progress = ${statusData.status === "completed" ? 100 : 50},
              video_url = COALESCE(${finalVideoUrl || null}, video_url),
              metadata = COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify(metadataUpdate)}::jsonb
            WHERE id = ${reel.id}
          `;

          results.push({
            reelId: reel.id,
            jobId,
            status: statusData.status,
            cloudinaryUrl,
            updated: true,
          });
        } else {
          await sql`
            UPDATE reels
            SET metadata = COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
              lastPolled: new Date().toISOString(),
              lumaState: statusData.luma_state,
            })}::jsonb
            WHERE id = ${reel.id}
          `;
          results.push({
            reelId: reel.id,
            jobId,
            status: statusData.status,
            updated: false,
          });
        }
      } catch (err) {
        console.error(
          "[Luma Polling] Error checking reel:",
          reel.id,
          err.message,
        );
        results.push({ reelId: reel.id, jobId, error: err.message });
      }
    }

    return Response.json({ success: true, checked: results.length, results });
  } catch (error) {
    console.error("[Luma Polling] Batch check error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to batch check Luma jobs",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
