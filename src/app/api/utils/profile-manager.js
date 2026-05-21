import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CENTRALIZED PROFILE MANAGEMENT SYSTEM
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This module provides a single source of truth for profile creation,
 * retrieval, and validation across the entire application.
 *
 * Used by:
 * - OAuth callback (/api/auth/callback)
 * - Credentials signup (/account/signup)
 * - Profile check endpoint (/api/profiles/check)
 * - Profile gate hook (useProfileGate)
 * - Any route that requires profile validation
 *
 * Benefits:
 * - Consistent profile structure
 * - No duplicate creation logic
 * - Centralized logging
 * - Guaranteed profile existence after auth
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Generate a safe, unique username from email or user ID
 */
function generateUsername(email, userId, name) {
  // Try email local-part first
  if (email) {
    const localPart = email.split("@")[0];
    const sanitized = localPart
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20);
    if (sanitized.length >= 3) {
      return sanitized;
    }
  }

  // Try name
  if (name) {
    const sanitized = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .substring(0, 20);
    if (sanitized.length >= 3) {
      return sanitized;
    }
  }

  // Fallback to user ID
  return `user_${userId.slice(0, 8)}`;
}

/**
 * Get profile by user_id
 * Returns null if not found (does NOT create)
 */
export async function getProfile(userId) {
  console.log(`[ProfileManager] Looking up profile for user: ${userId}`);

  try {
    const profiles = await sql`
      SELECT * FROM profiles WHERE user_id = ${userId}
    `;

    if (profiles.length === 0) {
      console.log(`[ProfileManager] ❌ No profile found for user: ${userId}`);
      return null;
    }

    console.log(`[ProfileManager] ✅ Profile found:`, {
      username: profiles[0].username,
      onboarding_completed: profiles[0].onboarding_completed,
    });

    return profiles[0];
  } catch (error) {
    console.error(`[ProfileManager] Error fetching profile:`, error);
    return null;
  }
}

/**
 * Check if profile is complete (has all required fields)
 */
export function isProfileComplete(profile) {
  if (!profile) return false;

  const hasRequired =
    profile.username && profile.name && profile.onboarding_completed === true;

  return hasRequired;
}

/**
 * Create a new user profile with safe defaults
 * This is the SINGLE SOURCE OF TRUTH for profile creation
 *
 * @param {string} userId - Auth user ID (from auth_users table)
 * @param {string} email - User email
 * @param {string} name - User display name (optional)
 * @param {object} options - Additional profile options
 * @returns {object} Created profile or existing profile
 */
export async function createUserProfile(
  userId,
  email,
  name = null,
  options = {},
) {
  console.log(`[ProfileManager] ═══════════════════════════════════════`);
  console.log(`[ProfileManager] Creating profile for user: ${userId}`);
  console.log(`[ProfileManager] Email: ${email}`);
  console.log(`[ProfileManager] Name: ${name || "Not provided"}`);

  try {
    // Check if profile already exists
    const existingProfile = await getProfile(userId);
    if (existingProfile) {
      console.log(
        `[ProfileManager] ⚠️ Profile already exists, updating last_login`,
      );

      // Update last login timestamp
      await sql`
        UPDATE profiles 
        SET 
          last_login = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
      `;

      console.log(`[ProfileManager] ═══════════════════════════════════════`);
      return existingProfile;
    }

    // Generate username
    const username = options.username || generateUsername(email, userId, name);
    const displayName = name || options.name || "Creator";
    const bio = options.bio || null;
    const profileImageUrl = options.profile_image_url || options.image || null;
    const followerCount = options.follower_count || 0;
    const role = options.role || "both";

    console.log(
      `[ProfileManager] Creating new profile with username: ${username}`,
    );

    // Create minimal profile (onboarding_completed = false)
    const newProfile = await sql`
      INSERT INTO profiles (
        user_id,
        username,
        name,
        bio,
        profile_image_url,
        follower_count,
        role,
        onboarding_completed,
        created_at,
        updated_at,
        last_login
      ) VALUES (
        ${userId},
        ${username},
        ${displayName},
        ${bio},
        ${profileImageUrl},
        ${followerCount},
        ${role},
        ${false},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    console.log(`[ProfileManager] ✅ Profile created successfully:`, {
      id: newProfile[0].id,
      username: newProfile[0].username,
      onboarding_completed: newProfile[0].onboarding_completed,
    });
    console.log(`[ProfileManager] ═══════════════════════════════════════`);

    return newProfile[0];
  } catch (error) {
    console.error(`[ProfileManager] ❌ Error creating profile:`, error);
    console.log(`[ProfileManager] ═══════════════════════════════════════`);
    throw error;
  }
}

/**
 * Get or create profile (ensures profile always exists after auth)
 * This is the RECOMMENDED way to handle profiles in auth flows
 *
 * @param {string} userId - Auth user ID
 * @param {string} email - User email
 * @param {string} name - User display name
 * @param {object} options - Additional options
 * @returns {object} Profile (existing or newly created)
 */
export async function ensureProfile(userId, email, name = null, options = {}) {
  console.log(`[ProfileManager] Ensuring profile exists for user: ${userId}`);

  // Try to get existing profile
  const existingProfile = await getProfile(userId);

  if (existingProfile) {
    // Update last login
    await sql`
      UPDATE profiles 
      SET 
        last_login = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;

    console.log(`[ProfileManager] ✅ Profile already exists`);
    return existingProfile;
  }

  // Create new profile
  console.log(`[ProfileManager] Profile doesn't exist, creating...`);
  return await createUserProfile(userId, email, name, options);
}

/**
 * Update profile to mark onboarding as complete
 */
export async function completeProfileOnboarding(userId, updateData = {}) {
  console.log(`[ProfileManager] Completing onboarding for user: ${userId}`);

  try {
    const updated = await sql`
      UPDATE profiles
      SET
        username = ${updateData.username || sql`username`},
        name = ${updateData.name || sql`name`},
        bio = ${updateData.bio !== undefined ? updateData.bio : sql`bio`},
        role = ${updateData.role || sql`role`},
        skills = ${updateData.skills || sql`skills`},
        portfolio_links = ${updateData.portfolio_links || sql`portfolio_links`},
        hourly_rate = ${updateData.hourly_rate !== undefined ? updateData.hourly_rate : sql`hourly_rate`},
        fixed_pricing = ${updateData.fixed_pricing !== undefined ? updateData.fixed_pricing : sql`fixed_pricing`},
        onboarding_completed = ${true},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING *
    `;

    if (updated.length === 0) {
      throw new Error("Profile not found for update");
    }

    console.log(
      `[ProfileManager] ✅ Onboarding completed for:`,
      updated[0].username,
    );
    return updated[0];
  } catch (error) {
    console.error(`[ProfileManager] Error completing onboarding:`, error);
    throw error;
  }
}

export default {
  getProfile,
  isProfileComplete,
  createUserProfile,
  ensureProfile,
  completeProfileOnboarding,
};
