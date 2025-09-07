import { createCookie } from "@remix-run/node";

export const i18nCookie = createCookie('localeCookie', {
    secure: import.meta.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secrets: ["s3cret1"],
})