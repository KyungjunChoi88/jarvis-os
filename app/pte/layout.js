export default function PteLayout({ children }) {
  const link = { color: "#aab5ca", textDecoration: "none", whiteSpace: "nowrap" };
  return (
    <>
      <nav aria-label="PTE 메뉴" style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18,
        maxWidth: 1200, margin: "0 auto 8px", padding: "16px 24px 12px",
        borderBottom: "1px solid #28303a", fontFamily: "Inter, Pretendard, system-ui, sans-serif",
        fontSize: 13, fontWeight: 600
      }}>
        <a href="/" style={link}>← JARVIS</a>
        <a href="/pte/wfd" style={link}>WFD 연습</a>
        <a href="/pte/ra.html" style={link}>RA 연습</a>
        <a href="/pte/sgd" style={link}>SGD 암기</a>
        <a href="/pte/di.html" style={link}>DI 연습</a>
        <a href="/pte/vocabulary" style={link}>📚 내 단어장</a>
        <a href="/pte/essay" style={link}>Essay</a>
      </nav>
      {children}
    </>
  );
}
