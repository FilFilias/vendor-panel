// app/utils/theme-cookies.ts
import { createCookie } from "@remix-run/node";

export const salesChannelCookie = createCookie("salesChannelID", {
  // change these as you like
  maxAge: 60 * 60 * 24 * 365, // 1 year
  httpOnly: false,            // client JS can still read/write if you want
});
