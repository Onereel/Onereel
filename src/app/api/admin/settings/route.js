import sql from "@/app/api/utils/sql";

// GET /api/admin/settings - Get platform settings
export async function GET(request) {
  try {
    const settings = await sql`SELECT * FROM platform_settings`;

    const settingsObj = {};
    settings.forEach((setting) => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    return Response.json({ success: true, settings: settingsObj });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/settings - Update platform settings
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { platform_fee_percentage } = body;

    if (platform_fee_percentage !== undefined) {
      const fee = parseFloat(platform_fee_percentage);
      if (fee < 0 || fee > 100) {
        return Response.json(
          {
            success: false,
            error: "Platform fee must be between 0 and 100",
          },
          { status: 400 },
        );
      }

      await sql`
        UPDATE platform_settings
        SET setting_value = ${fee.toString()},
            updated_at = CURRENT_TIMESTAMP
        WHERE setting_key = 'platform_fee_percentage'
      `;
    }

    const settings = await sql`SELECT * FROM platform_settings`;
    const settingsObj = {};
    settings.forEach((setting) => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    return Response.json({ success: true, settings: settingsObj });
  } catch (error) {
    console.error("Error updating settings:", error);
    return Response.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
