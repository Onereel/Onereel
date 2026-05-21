/**
 * Luma AI Configuration
 *
 * Get your LUMA_API_KEY from: https://lumalabs.ai/dashboard
 */

export const LUMA_CONFIG = {
  apiKey: process.env.LUMA_API_KEY,
  endpoint: "https://api.lumalabs.ai/dream-machine/v1/generations",
  isConfigured: !!process.env.LUMA_API_KEY,
};
