import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

function kstDatePart(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toGoogleEvent(event) {
  const startValue = event.start?.dateTime || event.start?.date;
  const endValue = event.end?.dateTime || event.end?.date;

  return {
    id: event.id,
    title: event.summary || "제목 없는 일정",
    start: startValue,
    end: endValue,
    isAllDay: Boolean(event.start?.date),
    location: event.location || "",
    htmlLink: event.htmlLink || ""
  };
}

async function fetchEvents(accessToken, { timeMin, timeMax, maxResults = 10 }) {
  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    timeMin,
    timeMax,
    maxResults: String(maxResults)
  });

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Google Calendar 요청에 실패했습니다. (${response.status}) ${body.slice(0, 160)}`);
  }

  const data = await response.json();
  return (data.items || []).map(toGoogleEvent);
}

export async function GET(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken;

  if (!accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todayPart = kstDatePart();
    const todayStart = new Date(`${todayPart}T00:00:00+09:00`);
    const tomorrowStart = addDays(todayStart, 1);
    const upcomingEnd = addDays(tomorrowStart, 14);

    const [today, upcoming] = await Promise.all([
      fetchEvents(accessToken, {
        timeMin: todayStart.toISOString(),
        timeMax: tomorrowStart.toISOString(),
        maxResults: 20
      }),
      fetchEvents(accessToken, {
        timeMin: tomorrowStart.toISOString(),
        timeMax: upcomingEnd.toISOString(),
        maxResults: 8
      })
    ]);

    return Response.json({
      timezone: "Asia/Seoul",
      todayDate: todayPart,
      today,
      upcoming
    });
  } catch (error) {
    console.error("[Google Calendar fetch failed]", error);
    return Response.json({ error: error.message || "Google Calendar 일정을 불러오지 못했습니다." }, { status: 500 });
  }
}
