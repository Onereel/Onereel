/**
 * LUMA DREAM MACHINE VIDEO GENERATION INTEGRATION
 *
 * Submits async video generation jobs to Luma and returns job_id immediately.
 * Never waits for video completion.
 */

export async function POST(request) {
  try {
    // DEBUG: Check if API key is loaded
    console.log("LUMA KEY PRESENT:", !!process.env.LUMA_API_KEY);
    console.log(
      "LUMA KEY PREFIX:",
      process.env.LUMA_API_KEY?.substring(0, 10) + "...",
    );

    const body = await request.json();
    const { prompt, duration = 5, aspectRatio = "9:16" } = body;

    if (!prompt) {
      return Response.json(
        {
          success: false,
          error: "Missing required field: prompt",
        },
        { status: 400 },
      );
    }

    // Check for API key
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) {
      console.error("[Luma] LUMA_API_KEY not configured");
      return Response.json(
        {
          success: false,
          error: "Luma API key not configured",
          details: "Set LUMA_API_KEY environment variable",
        },
        { status: 500 },
      );
    }

    console.log("[Luma] Submitting video generation job:", {
      promptLength: prompt.length,
      duration,
      aspectRatio,
    });

    // Submit to Luma Dream Machine API
    const lumaResponse = await fetch(
      "https://api.lumalabs.ai/dream-machine/v1/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "ray-2", // Valid Luma production model
          prompt: prompt,
          aspect_ratio: aspectRatio,
          loop: false,
        }),
      },
    );

    if (!lumaResponse.ok) {
      const errorText = await lumaResponse.text();
      console.error("[Luma] API error:", {
        status: lumaResponse.status,
        statusText: lumaResponse.statusText,
        error: errorText,
      });

      // Handle specific error cases
      if (lumaResponse.status === 401) {
        return Response.json(
          {
            success: false,
            error: "Invalid Luma API key",
            details: "Check LUMA_API_KEY environment variable",
          },
          { status: 401 },
        );
      }

      if (lumaResponse.status === 429) {
        return Response.json(
          {
            success: false,
            error: "Luma API rate limit exceeded",
            details: "Please try again later",
            quotaExceeded: true,
          },
          { status: 429 },
        );
      }

      throw new Error(`Luma API returned ${lumaResponse.status}: ${errorText}`);
    }

    const lumaResult = await lumaResponse.json();

    console.log("[Luma] Job submitted successfully:", {
      id: lumaResult.id,
      state: lumaResult.state,
    });

    // Return job details immediately (no waiting)
    return Response.json({
      success: true,
      job_id: lumaResult.id,
      status: lumaResult.state, // "pending" or "processing"
      created_at: lumaResult.created_at,
      estimated_duration: "2-5 minutes",
      provider: "luma-dream-machine",
    });
  } catch (error) {
    console.error("[Luma] Video generation error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to submit video generation job",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
