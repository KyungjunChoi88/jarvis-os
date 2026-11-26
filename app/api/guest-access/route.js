import { NextResponse } from "next/server";
import { createGuestToken, GUEST_COOKIE, GUEST_SESSION_SECONDS, matchesGuestPassword } from "../../../lib/guest-session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  let body;
  try {
    if (Number(request.headers.get("content-length")) > 2000) {
      return NextResponse.json({ error: "요청이 너무 큽니다." }, { status: 413 });
    }
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "비밀번호를 확인해 주세요." }, { status: 400 });
  }

  if (!process.env.GUEST_ACCESS_PASSWORD) {
    return NextResponse.json({ error: "게스트 비밀번호가 아직 설정되지 않았습니다. 관리자에게 문의해 주세요." }, { status: 503 });
  }

  if (!matchesGuestPassword(body?.password)) {
    return NextResponse.json({ error: "비밀번호가 맞지 않습니다." }, { status: 401 });
  }

  let token;
  try {
    token = createGuestToken();
  } catch {
    return NextResponse.json({ error: "로그인 설정이 완료되지 않았습니다." }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(GUEST_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_SESSION_SECONDS
  });
  return response;
}
