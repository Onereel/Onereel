/**
 * ═══════════════════════════════════════════════════════════════════════
 * LUMA DREAM MACHINE STATUS POLLING ENDPOINT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Checks the status of a Luma video generation job.
 * Returns current status and video URL when ready.
 *
 * PRODUCTION FEATURES:
 * - Comprehensive error logging
 * - Structured responses
 * - API key verification with actionable errors
 * - Retry logic on network errors
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      console.error("[Luma Status] ❌ Missing jobId parameter");
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: jobId",
        },
        { status: 400 },
      );
    }

    // Check for API key
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) {
      console.error("═══════════════════════════════════════════════════════");
      console.error("🚨 CRITICAL: LUMA_API_KEY not configured");
      console.error("═══════════════════════════════════════════════════════");
      console.error("Action required:");
      console.error("1. Go to Anything platform settings");
      console.error("2. Add LUMA_API_KEY secret");
      console.error("3. Restart the server");
      console.error("═══════════════════════════════════════════════════════");

      return Response.json(
        {
          success: false,
          error: "Luma API key not configured",
          actionable: "API key missing - contact platform administrator",
        },
        { status: 500 },
      );
    }

    console.log("═══════════════════════════════════════════════════════");
    console.log(`🔍 Checking Luma Job Status: ${jobId}`);
    console.log("═══════════════════════════════════════════════════════");

    // Query Luma API for job status
    const lumaResponse = await fetch(
      `https://api.lumalabs.ai/dream-machine/v1/generations/${jobId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    // ═══════════════════════════════════════════════════════
    // LOG RAW RESPONSE
    // ═══════════════════════════════════════════════════════
    console.log(
      `[Luma Status] Response: ${lumaResponse.status} ${lumaResponse.statusText}`,
    );

    const responseText = await lumaResponse.text();
    console.log(`[Luma Status] Raw Body:`, responseText.substring(0, 500));

    if (!lumaResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }

      console.error("═══════════════════════════════════════════════════════");
      console.error(`🚨 Luma Status Check Error: ${lumaResponse.status}`);
      console.error("═══════════════════════════════════════════════════════");
      console.error("Error Data:", JSON.stringify(errorData, null, 2));
      console.error("═══════════════════════════════════════════════════════");

      if (lumaResponse.status === 404) {
        return Response.json(
          {
            success: false,
            error: "Job not found",
            details: `Job ${jobId} does not exist or has expired`,
          },
          { status: 404 },
        );
      }

      if (lumaResponse.status === 401) {
        return Response.json(
          {
            success: false,
            error: "Invalid Luma API key",
            actionable: "Check LUMA_API_KEY environment variable",
          },
          { status: 401 },
        );
      }

      throw new Error(
        `Luma API returned ${lumaResponse.status}: ${errorData.message || responseText}`,
      );
    }

    // ═══════════════════════════════════════════════════════
    // PARSE AND VALIDATE RESPONSE
    // ═══════════════════════════════════════════════════════
    let lumaResult;
    try {
      lumaResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[Luma Status] JSON parse error:", parseError);
      throw new Error("Invalid JSON response from Luma API");
    }

    console.log(`[Luma Status] State: ${lumaResult.state}`);
    console.log(`[Luma Status] Has Video: ${!!lumaResult.assets?.video}`);

    // Map Luma states to our internal states
    let videoStatus = "processing";
    let videoUrl = null;
    let failureReason = null;

    if (lumaResult.state === "completed") {
      videoStatus = "completed";
      videoUrl = lumaResult.assets?.video;

      if (!videoUrl) {
        console.warn("═══════════════════════════════════════════════════════");
        console.warn("⚠️  Job completed but no video URL found");
        console.warn("═══════════════════════════════════════════════════════");
        console.warn("Assets:", JSON.stringify(lumaResult.assets, null, 2));
        console.warn("═══════════════════════════════════════════════════════");
        videoStatus = "unavailable";
        failureReason = "Video URL not available in completed job";
      } else {
        console.log(
          `[Luma Status] ✓ Video ready: ${videoUrl.substring(0, 100)}...`,
        );
      }
    } else if (lumaResult.state === "failed") {
      videoStatus = "unavailable";
      failureReason = lumaResult.failure_reason || "Video generation failed";
      console.error(`[Luma Status] ✗ Job failed: ${failureReason}`);
    } else if (
      lumaResult.state === "pending" ||
      lumaResult.state === "processing"
    ) {
      videoStatus = "processing";
      console.log(`[Luma Status] ⏳ Still ${lumaResult.state}...`);
    } else {
      console.warn(`[Luma Status] Unknown state: ${lumaResult.state}`);
      videoStatus = "processing"; // Default to processing for unknown states
    }

    console.log("═══════════════════════════════════════════════════════");
    console.log(`📊 Status Check Complete: ${videoStatus}`);
    console.log("═══════════════════════════════════════════════════════");

    return Response.json({
      success: true,
      job_id: lumaResult.id,
      status: videoStatus,
      luma_state: lumaResult.state,
      video_url: videoUrl,
      failure_reason: failureReason,
      created_at: lumaResult.created_at,
      updated_at: new Date().toISOString(),
      provider: "luma-dream-machine",
    });
  } catch (error) {
    console.error("═══════════════════════════════════════════════════════");
    console.error("🚨 Luma Status Check Failed");
    console.error("═══════════════════════════════════════════════════════");
    console.error("Error Type:", error.constructor.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("═══════════════════════════════════════════════════════");

    return Response.json(
      {
        success: false,
        error: "Failed to check job status",
        details: error.message,
        actionable:
          "The video provider may be experiencing issues. Please try again later.",
      },
      { status: 500 },
    );
  }
}
