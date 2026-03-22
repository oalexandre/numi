import { DownloadButton } from "@/components/download-button";

const features = [
  { icon: "//", title: "Notepad Style", desc: "Type naturally, results appear instantly" },
  { icon: "x=", title: "Variables & %", desc: "Smart percentages and assignments" },
  { icon: "km", title: "Unit Conversions", desc: "200+ units across 10 categories" },
  { icon: "+d", title: "Date Arithmetic", desc: "today + 2 weeks, now - 1 year" },
  { icon: "0x", title: "Base Conversions", desc: "Hex, binary, octal on the fly" },
  { icon: "tz", title: "Timezones", desc: "400+ IANA zones" },
  { icon: "fn", title: "Plugins", desc: "Extend with custom functions" },
  { icon: "◐", title: "Themes", desc: "Dark and light, follows system" },
];

export default function Home() {
  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="anim d1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Ilumi" className="hero-logo" />
          </div>

          <h1 className="anim d2 hero-title font-mono">
            <span className="accent">il</span><span className="dim">umi</span>
          </h1>

          <p className="anim d3 hero-sub">A smart calculator for everyday math.</p>

          <p className="anim d4 hero-desc">
            Variables, unit conversions, percentages, dates, base conversions — all in a clean notepad interface.
          </p>

          <div className="anim d4 hero-actions">
            <DownloadButton />
          </div>

          {/* Live examples */}
          <div className="anim d5 examples-strip font-mono">
            <div className="example-row">
              <span className="example-input"><span className="comment">// Final price</span></span>
              <span className="example-result"></span>
            </div>
            <div className="example-row">
              <span className="example-input"><span className="var">metal</span> = <span className="num">10</span></span>
              <span className="example-result">10</span>
            </div>
            <div className="example-row">
              <span className="example-input"><span className="var">wood</span> = <span className="num">100</span></span>
              <span className="example-result">100</span>
            </div>
            <div className="example-row">
              <span className="example-input"><span className="var">work</span> = <span className="num">200</span></span>
              <span className="example-result">200</span>
            </div>
            <div className="example-row">
              <span className="example-input"><span className="var">price</span> = metal + wood + work</span>
              <span className="example-result">310</span>
            </div>
            <div className="example-row">
              <span className="example-input"><span className="var">tax</span> = <span className="num">10</span>%</span>
              <span className="example-result">0.1</span>
            </div>
            <div className="example-row">
              <span className="example-input"><span className="var">final_price</span> = price + tax</span>
              <span className="example-result" style={{ fontSize: "17px", fontWeight: 600 }}>341</span>
            </div>
          </div>

          {/* Demo GIF */}
          <div className="anim d6" style={{ marginTop: 64 }}>
            <div className="demo-frame">
              <div className="demo-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo.gif" alt="Ilumi in action" loading="eager" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="features">
        <div className="gold-line" style={{ marginBottom: 64 }} />
        <p className="section-heading font-mono">Features</p>
        <div className="features-list">
          {features.map((f) => (
            <div key={f.title} className="feat-item">
              <span className="feat-icon font-mono">{f.icon}</span>
              <div className="feat-text">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="gold-line" style={{ marginBottom: 64 }} />
        <div className="cta-grid">
          <a href="https://github.com/oalexandre/ilumi" target="_blank" rel="noopener noreferrer" className="cta">
            <span className="cta-icon font-mono">↗</span>
            <h3>Contribute</h3>
            <p>Open source on GitHub</p>
          </a>
          <a href="https://github.com/oalexandre/ilumi/blob/master/docs/plugins.md" target="_blank" rel="noopener noreferrer" className="cta">
            <span className="cta-icon font-mono">{"{ }"}</span>
            <h3>Build a Plugin</h3>
            <p>Extend Ilumi</p>
          </a>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="site-footer">
        <div className="gold-line" />
        <p className="footer-text">
          Made with <span style={{ color: "var(--accent)" }}>♥</span> by{" "}
          <a href="https://oalexandre.com.br" target="_blank" rel="noopener noreferrer">Alexandre</a>
          {" · "}
          <a href="https://github.com/oalexandre/ilumi" target="_blank" rel="noopener noreferrer">GitHub</a>
          {" · "}Open Source
        </p>
      </footer>
    </main>
  );
}
