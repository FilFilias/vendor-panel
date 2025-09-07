import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.NODE_ENV === "development",
  publishableKey: import.meta.env.VITE_PUBLISHABLE_KEY,
  auth: {
    type: "session",
  },
})