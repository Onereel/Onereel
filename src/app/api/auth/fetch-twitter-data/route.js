import sql from "@/app/api/utils/sql";

/**
 * Fetch Twitter User Data
 *
 * Uses the stored access_token to fetch complete user data from Twitter API
 * including verification status, follower count, and profile info
 */
export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    console.log("[Fetch Twitter Data] Fetching data for user:", userId);

    // Get the X account with access token
    let twitterAccount;
    try {
      twitterAccount = await sql`
        SELECT * FROM auth_accounts 
        WHERE "userId" = ${userId} 
        AND provider = 'x'
        ORDER BY id DESC
        LIMIT 1
      `;
    } catch (error) {
      console.error("[Fetch Twitter Data] Database error:", error.message);
      return Response.json(
        { error: "Database error", details: error.message },
        { status: 500 },
      );
    }

    if (twitterAccount.length === 0) {
      console.error("[Fetch Twitter Data] No X account found");
      return Response.json({ error: "No X account found" }, { status: 404 });
    }

    const account = twitterAccount[0];
    const accessToken = account.access_token;

    if (!accessToken) {
      console.error("[Fetch Twitter Data] No access token found");
      return Response.json(
        { error: "No access token available" },
        { status: 400 },
      );
    }

    console.log("[Fetch Twitter Data] Making Twitter API request");

    // Fetch user data from Twitter API v2
    let response;
    try {
      response = await fetch(
        `https://api.twitter.com/2/users/${account.providerAccountId}?user.fields=id,name,username,profile_image_url,verified,verified_type,public_metrics,description`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("[Fetch Twitter Data] Network error:", error.message);
      return Response.json(
        { error: "Network error", details: error.message },
        { status: 500 },
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Fetch Twitter Data] Twitter API error:", errorText);

      // If token expired, return a specific error
      if (response.status === 401) {
        return Response.json(
          { error: "Access token expired", needsReauth: true },
          { status: 401 },
        );
      }

      return Response.json(
        { error: "Failed to fetch Twitter data", details: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("[Fetch Twitter Data] Twitter data received:", {
      id: data?.data?.id,
      username: data?.data?.username,
      verified: data?.data?.verified,
      verified_type: data?.data?.verified_type,
    });

    if (!data.data) {
      return Response.json(
        { error: "Invalid Twitter API response" },
        { status: 500 },
      );
    }

    // Return the Twitter user data with safe field access
    return Response.json({
      success: true,
      data: {
        x_user_id: data.data.id || account.providerAccountId,
        x_username: data.data.username || data.data.name || "unknown",
        x_verified:
          data.data.verified || data.data.verified_type === "blue" || false,
        x_blue_verified: data.data.verified_type === "blue" || false,
        name: data.data.name || data.data.username || "Unknown User",
        bio: data.data.description || null,
        profile_image_url: data.data.profile_image_url || null,
        follower_count: data.data.public_metrics?.followers_count || 0,
        following_count: data.data.public_metrics?.following_count || 0,
      },
    });
  } catch (error) {
    console.error("[Fetch Twitter Data] Unexpected error:", error.message);
    console.error("[Fetch Twitter Data] Stack:", error.stack);
    return Response.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
