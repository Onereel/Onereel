import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";
import { createHash } from "crypto";

/**
 * Thumbnail Generator — Claude AI concept + real Cloudinary SVG image
 *
 * Step 1: Claude designs the concept (headline, colors, layout)
 * Step 2: Server builds an SVG from the concept and uploads to Cloudinary
 * Step 3: Real Cloudinary image URL is returned + displayed in <img> tag
 * Step 4: URL saved to ai_thumbnail_generations table
 */

// ── Build SVG + upload to Cloudinary ─────────────────────────────────────────
async function buildAndUploadThumbnail(concept, niche, contentTopic) {
  const cloudName = process.env._CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "[Thumbnail] Cloudinary not configured — skipping image upload",
    );
    return null;
  }

  try {
    const bg = (concept.colorScheme?.background || "#111111").replace("#", "");
    const primary = (concept.colorScheme?.primary || "#8B5CF6").replace(
      "#",
      "",
    );
    const textColor = concept.colorScheme?.text || "#FFFFFF";

    const headline = (concept.headline || contentTopic.toUpperCase()).slice(
      0,
      52,
    );
    const subheadline = (concept.subheadline || niche).slice(0, 70);
    const trigger = (concept.emotionalTrigger || "").slice(0, 45);
    const nicheLabel = niche.toUpperCase().slice(0, 22);

    // Escape XML special chars
    const esc = (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const line1 = esc(headline.slice(0, 26));
    const line2 = headline.length > 26 ? esc(headline.slice(26, 52)) : "";
    const yHeadline = line2 ? 250 : 310;
    const ySubline = line2 ? 430 : 400;
    const nicheLabelWidth = Math.min(nicheLabel.length * 14 + 48, 420);

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#${bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="#${primary}" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#${primary}" stop-opacity="1"/>
      <stop offset="100%" stop-color="#${bg}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="3" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect x="0" y="0" width="10" height="720" fill="#${primary}"/>
  <rect x="0" y="620" width="1280" height="100" fill="url(#bar)" opacity="0.45"/>
  <rect x="36" y="36" width="${nicheLabelWidth}" height="46" rx="23" fill="#${primary}" opacity="0.92"/>
  <text x="60" y="67" font-family="Arial Black, Arial, sans-serif" font-size="22" font-weight="900" fill="${esc(textColor)}" letter-spacing="2">${nicheLabel}</text>
  <text x="640" y="${yHeadline}" font-family="Arial Black, Arial, sans-serif" font-size="90" font-weight="900" fill="${esc(textColor)}" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)">${line1}</text>
  ${line2 ? `<text x="640" y="${yHeadline + 110}" font-family="Arial Black, Arial, sans-serif" font-size="90" font-weight="900" fill="${esc(textColor)}" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)">${line2}</text>` : ""}
  <text x="640" y="${ySubline}" font-family="Arial, sans-serif" font-size="38" font-weight="600" fill="${esc(textColor)}" text-anchor="middle" opacity="0.88">${esc(subheadline)}</text>
  ${trigger ? `<rect x="490" y="600" width="${Math.min(trigger.length * 13 + 60, 350)}" height="42" rx="21" fill="rgba(255,255,255,0.14)"/><text x="640" y="627" font-family="Arial, sans-serif" font-size="21" fill="${esc(textColor)}" text-anchor="middle" opacity="0.92">⚡ ${esc(trigger)}</text>` : ""}
</svg>`;

    const base64Svg = Buffer.from(svgContent).toString("base64");
    const dataUri = `data:image/svg+xml;base64,${base64Svg}`;

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "one-reel/thumbnails";
    const publicId = `thumb_${Date.now()}`;

    const paramsToSign = { folder, public_id: publicId, timestamp };
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign =
      sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join("&") + apiSecret;
    const signature = createHash("sha1").update(stringToSign).digest("hex");

    const form = new URLSearchParams();
    form.append("file", dataUri);
    form.append("folder", folder);
    form.append("public_id", publicId);
    form.append("timestamp", timestamp.toString());
    form.append("api_key", apiKey);
    form.append("signature", signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      },
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(
        `Cloudinary upload failed (${uploadRes.status}): ${errText}`,
      );
    }

    const result = await uploadRes.json();
    console.log("[Thumbnail] ✅ Uploaded to Cloudinary:", result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error("[Thumbnail] ❌ Cloudinary error:", err.message);
    return null;
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request) {
  let session = null;
  let userProfile = null;
  let isGuest = true;
  let formData = null;

  try {
    try {
      formData = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid request format" },
        { status: 400 },
      );
    }

    const { niche, contentTopic, style } = formData;

    if (!niche || !contentTopic) {
      return Response.json(
        { success: false, error: "Niche and content topic are required" },
        { status: 400 },
      );
    }

    try {
      session = await auth();
      isGuest = !session?.user;
    } catch {
      isGuest = true;
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    // ── Step 1: Claude designs the concept ─────────────────────────────────
    console.log("[Thumbnail] Calling Claude for concept...");
    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `You are an expert YouTube thumbnail designer.

Design a viral thumbnail for:
Niche: ${niche}
Topic: ${contentTopic}
Style: ${style || "bold, eye-catching"}

Return ONLY valid JSON, no markdown, no explanation:
{
  "headline": "BOLD HEADLINE TEXT (max 6 words, impactful)",
  "subheadline": "Supporting line (3-5 words)",
  "colorScheme": {
    "primary": "#8B5CF6",
    "secondary": "#1DA1F2",
    "text": "#FFFFFF",
    "background": "#0F0F0F"
  },
  "layout": "Description of the composition",
  "visualElements": ["element 1", "element 2", "element 3"],
  "emotionalTrigger": "The psychological hook (max 5 words)",
  "estimatedCTR": "high",
  "designTips": ["tip 1", "tip 2", "tip 3"]
}

Use dark backgrounds with vibrant primary colors for maximum contrast.`,
            },
          ],
        }),
      },
    );

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      throw new Error(`Anthropic API ${anthropicResponse.status}: ${errText}`);
    }

    const anthropicResult = await anthropicResponse.json();
    const rawContent = anthropicResult.content?.[0]?.text || "";
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude did not return valid JSON");
    const concept = JSON.parse(jsonMatch[0]);
    console.log("[Thumbnail] ✅ Claude concept ready");

    // ── Step 2: Build SVG and upload to Cloudinary ─────────────────────────
    const imageUrl = await buildAndUploadThumbnail(
      concept,
      niche,
      contentTopic,
    );
    const promptDescription = `${niche} thumbnail for "${contentTopic}": ${concept.headline}`;

    // ── Step 3: Return result ───────────────────────────────────────────────
    if (isGuest) {
      return Response.json({
        success: true,
        isGuest: true,
        concept,
        imageUrl,
        prompt: promptDescription,
        generation: {
          id: `guest_${Date.now()}`,
          niche,
          prompt: promptDescription,
          image_url: imageUrl,
          metadata: { concept, contentTopic, style, guestSession: true },
        },
        message: imageUrl
          ? "Thumbnail generated! Sign in to save your designs."
          : "Concept ready — sign in for full image generation.",
      });
    }

    // ── Step 4: Save to database (authenticated) ────────────────────────────
    try {
      const existingProfile = await sql`
        SELECT id FROM profiles WHERE user_id = ${session.user.id}
      `;

      if (existingProfile.length === 0) {
        return Response.json({
          success: true,
          isGuest: true,
          concept,
          imageUrl,
          prompt: promptDescription,
          message:
            "Concept created but profile not found — please complete onboarding.",
        });
      }

      userProfile = existingProfile[0];

      const saved = await sql`
        INSERT INTO ai_thumbnail_generations (
          profile_id, prompt, niche, trend_keywords, image_url,
          generation_model, metadata
        ) VALUES (
          ${userProfile.id},
          ${promptDescription},
          ${niche},
          ${[]},
          ${imageUrl || ""},
          'claude-sonnet-4-5+cloudinary',
          ${JSON.stringify({
            concept,
            contentTopic,
            style,
            cloudinaryUrl: imageUrl,
            createdAt: new Date().toISOString(),
          })}
        )
        RETURNING *
      `;

      const monthYear = new Date().toISOString().slice(0, 7);
      await sql`
        INSERT INTO ai_usage_analytics (profile_id, feature_type, month_year, usage_count)
        VALUES (${userProfile.id}, 'thumbnail', ${monthYear}, 1)
        ON CONFLICT (profile_id, feature_type, month_year)
        DO UPDATE SET usage_count = ai_usage_analytics.usage_count + 1
      `;

      return Response.json({
        success: true,
        isGuest: false,
        concept,
        imageUrl,
        prompt: promptDescription,
        generation: saved[0],
      });
    } catch (dbError) {
      console.error("[Thumbnail] DB error:", dbError);
      return Response.json({
        success: true,
        isGuest: true,
        concept,
        imageUrl,
        prompt: promptDescription,
        message: "Thumbnail created but could not be saved.",
      });
    }
  } catch (error) {
    console.error("[Thumbnail] Unexpected error:", error);

    if (formData?.niche && formData?.contentTopic) {
      const fallback = {
        headline: formData.contentTopic.toUpperCase().slice(0, 30),
        subheadline: "You Need To See This",
        colorScheme: {
          primary: "#8B5CF6",
          secondary: "#1DA1F2",
          text: "#FFFFFF",
          background: "#111111",
        },
        layout: "Bold centered text with gradient",
        visualElements: ["Bold headline", "Color gradient", "High contrast"],
        emotionalTrigger: "Curiosity gap",
        estimatedCTR: "medium",
        designTips: ["High contrast", "Short text", "Strong colors"],
      };
      return Response.json({
        success: true,
        isGuest: true,
        concept: fallback,
        imageUrl: null,
        prompt: `${formData.niche} thumbnail for "${formData.contentTopic}"`,
        message: "Fallback concept — Claude temporarily unavailable.",
      });
    }

    return Response.json(
      {
        success: false,
        error: "Failed to generate thumbnail",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// ── GET: history ──────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch {
      return Response.json({ success: true, generations: [], isGuest: true });
    }

    if (!session?.user) {
      return Response.json({ success: true, generations: [], isGuest: true });
    }

    const profile =
      await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;
    if (profile.length === 0) {
      return Response.json({ success: true, generations: [], isGuest: false });
    }

    const generations = await sql`
      SELECT * FROM ai_thumbnail_generations
      WHERE profile_id = ${profile[0].id}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return Response.json({ success: true, generations, isGuest: false });
  } catch (error) {
    console.error("[Thumbnail History] Error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
