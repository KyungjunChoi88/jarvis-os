import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

function requireString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function buildKstDateTime(date, time) {
  return `${date}T${time}:00+09:00`;
}

export async function POST(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken;

  if (!accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const title = requireString(body.title || body.memo);
  const date = requireString(body.date);
  const time = requireString(body.time);
  const memo = requireString(body.memo, title);

  if (!title || !date || !time) {
    return Response.json({ error: "title, date, time are required" }, { status: 400 });
  }

  const start = new Date(buildKstDateTime(date, time));
  if (Number.isNaN(start.getTime())) {
    return Response.json({ error: "Invalid date or time" }, { status: 400 });
  }

  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      summary: title,
      description: memo,
      start: {
        dateTime: start.toISOString(),
        timeZone: "Asia/Seoul"
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Asia/Seoul"
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return Response.json({
      error: data?.error?.message || "Google Calendar 일정 생성에 실패했습니다."
    }, { status: response.status });
  }

  return Response.json({
    id: data.id,
    htmlLink: data.htmlLink,
    title: data.summary || title,
    start: data.start?.dateTime,
    end: data.end?.dateTime
  });
}
