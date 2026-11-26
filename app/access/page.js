"use client";

import { useEffect, useState } from "react";

export default function AccessPage() {
  const [password, setPassword] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("callbackUrl");
    if (value && value.startsWith("/") && !value.startsWith("//")) setCallbackUrl(value);
  }, []);

  async function enterAsGuest(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/guest-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "접속하지 못했습니다. 비밀번호를 확인해 주세요.");
      window.location.replace(callbackUrl);
    } catch (err) {
      setError(err.message || "접속하지 못했습니다.");
      setBusy(false);
    }
  }

  const card = {
    width: "min(100%, 420px)", padding: 28, borderRadius: 16,
    border: "1px solid #303844", background: "#171c24",
    boxShadow: "0 18px 55px #0005"
  };
  const input = {
    width: "100%", minHeight: 48, boxSizing: "border-box", borderRadius: 9,
    padding: "0 13px", border: "1px solid #3d4858", background: "#0e131a",
    color: "#f4f6fa", fontSize: 16, outlineColor: "#63d5c2"
  };
  const button = {
    width: "100%", minHeight: 48, border: 0, borderRadius: 9,
    background: "#20c7b3", color: "#071411", fontSize: 15, fontWeight: 750,
    cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1
  };

  return (
    <main style={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      padding: 20, boxSizing: "border-box", background: "#0b0e13",
      color: "#f4f6fa", fontFamily: "Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif"
    }}>
      <section style={card}>
        <a href="/" style={{ color: "#aab5ca", textDecoration: "none", fontSize: 13 }}>← JARVIS</a>
        <h1 style={{ fontSize: 27, margin: "22px 0 8px" }}>JARVIS PTE</h1>
        <p style={{ color: "#aab5ca", lineHeight: 1.65, margin: "0 0 20px" }}>
          Google 계정으로 로그인하거나 게스트 비밀번호를 입력해 주세요.
        </p>

        <a href={"/api/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl)} style={{
          display: "grid", placeItems: "center", minHeight: 46, borderRadius: 9,
          border: "1px solid #465365", color: "#f4f6fa", textDecoration: "none",
          fontWeight: 650, marginBottom: 19
        }}>Google 계정으로 로그인</a>

        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#778294", fontSize: 12, marginBottom: 18 }}>
          <span style={{ height: 1, background: "#303844", flex: 1 }} />
          또는 게스트로 입장
          <span style={{ height: 1, background: "#303844", flex: 1 }} />
        </div>

        <form onSubmit={enterAsGuest}>
          <label htmlFor="guest-password" style={{ display: "block", fontSize: 13, fontWeight: 650, marginBottom: 8 }}>게스트 비밀번호</label>
          <input id="guest-password" type="password" autoComplete="current-password" required
            value={password} onChange={event => setPassword(event.target.value)}
            placeholder="비밀번호 입력" style={input} />
          {error && <p role="alert" style={{ color: "#ff9191", fontSize: 13, lineHeight: 1.5 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ ...button, marginTop: 14 }}>
            {busy ? "확인 중…" : "게스트로 입장"}
          </button>
        </form>

        <p style={{ color: "#7f8998", fontSize: 12, lineHeight: 1.55, margin: "17px 0 0" }}>
          게스트 학습 진도는 이 브라우저에 저장됩니다. Google 로그인은 계정별 기기 간 동기화를 지원합니다.
        </p>
      </section>
    </main>
  );
}
