import { useState, useEffect } from "react";

// Design tokens — exact match to solomonsmith.dev CSS vars
const C = {
  bg:       "#0A0E0A",
  bg2:      "#0F140F",
  green:    "#00D936",
  soft:     "#5FE07F",
  muted:    "#3FB85C",
  faint:    "#2E9E48",
  amber:    "#E8A05B",
  hairline: "rgba(0,217,54,0.22)",
  font:     '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

const CONTACT = {
  name:          "Solomon Smith",
  title:         "AI & Systems Engineer",
  tagline:       "Building intelligent systems for real people",
  email:         "solomonsmithdev@gmail.com",
  phone:         "+15305131936",
  phoneDisplay:  "(530) 513-1936",
  linkedin:      "https://linkedin.com/in/solomonsmithdev",
  linkedinHandle:"solomonsmithdev",
  github:        "https://github.com/SolomonSmith-dev",
  githubHandle:  "SolomonSmith-dev",
};

const HEADSHOT = `${import.meta.env.BASE_URL}headshot.jpg`;

const VCARD = `BEGIN:VCARD
VERSION:3.0
FN:${CONTACT.name}
TITLE:${CONTACT.title}
TEL;TYPE=CELL:${CONTACT.phone}
EMAIL:${CONTACT.email}
URL:${CONTACT.github}
END:VCARD`;

const Icons = {
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13L2 4"/>
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  GitHub: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  Download: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  QR: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/>
      <rect x="14" y="14" width="4" height="4"/><rect x="20" y="14" width="2" height="2"/><rect x="14" y="20" width="2" height="2"/><rect x="20" y="20" width="2" height="2"/>
    </svg>
  ),
};

function QRCode({ data, size = 160 }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=0A0E0A&color=00D936&format=svg`;
  return <img src={url} alt="QR Code" width={size} height={size} style={{ borderRadius: 2, display: "block" }} />;
}

function ContactRow({ icon: Icon, label, value, href, delay }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 8px",
        borderBottom: `1px solid ${C.hairline}`,
        color: hovered ? C.green : C.soft,
        textDecoration: "none",
        background: hovered ? "rgba(0,217,54,0.04)" : "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease, color 0.15s ease, background 0.15s ease",
        fontFamily: C.font,
      }}
    >
      <span style={{ color: hovered ? C.amber : C.faint, fontSize: 12, flexShrink: 0, lineHeight: 1 }}>›</span>
      <span style={{ color: hovered ? C.green : C.muted, flexShrink: 0, display: "flex", alignItems: "center" }}>
        <Icon />
      </span>
      <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: hovered ? C.muted : C.faint, width: 54, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: C.hairline, minWidth: 8 }} />
      <span style={{ fontSize: 11, letterSpacing: "0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>
        {value}
      </span>
    </a>
  );
}

export default function DigitalBusinessCard() {
  const [showQR, setShowQR]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSaveContact = () => {
    const blob = new Blob([VCARD], { type: "text/vcard" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "solomon-smith.vcf";
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 20px",
      fontFamily: C.font,
      position: "relative",
      overflow: "hidden",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

      {/* Scanlines */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,217,54,0.012) 2px, rgba(0,217,54,0.012) 4px)",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, pointerEvents: "none",
        background: "radial-gradient(circle, rgba(0,217,54,0.05) 0%, transparent 70%)",
      }} />

      <div style={{
        width: "100%", maxWidth: 400, position: "relative", zIndex: 1,
        opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease",
      }}>
        {/* Terminal prompt */}
        <div style={{
          fontSize: 10, color: C.faint, letterSpacing: "0.08em",
          marginBottom: 16, fontFamily: C.font,
          opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.1s",
        }}>
          <span style={{ color: C.muted }}>$ </span>
          ./profile --card solomon.smith
          <span style={{
            display: "inline-block", width: 7, height: 12,
            background: C.green, marginLeft: 3, verticalAlign: "middle",
            animation: "cur 1.1s steps(1) infinite",
          }} />
        </div>

        {/* Card */}
        <div style={{ border: `1px solid ${C.hairline}`, background: C.bg2 }}>
          {/* Header: avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "24px 24px 20px" }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              border: `1px solid ${C.muted}`, overflow: "hidden",
              boxShadow: "0 0 20px rgba(0,217,54,0.12)",
            }}>
              {HEADSHOT ? (
                <img src={HEADSHOT} alt={CONTACT.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: C.bg, color: C.green, fontSize: 22, fontWeight: 700, letterSpacing: "-0.04em",
                }}>SS</div>
              )}
            </div>

            {/* Name block */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.green, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 6 }}>
                {CONTACT.name}
              </div>
              <div style={{ fontSize: 9, color: C.amber, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 7 }}>
                {CONTACT.title}
              </div>
              <div style={{ fontSize: 11, color: C.faint, fontStyle: "italic", lineHeight: 1.45 }}>
                {CONTACT.tagline}
                <span style={{
                  display: "inline-block", width: 6, height: 10,
                  background: C.faint, marginLeft: 2, verticalAlign: "middle",
                  animation: "cur 1.1s steps(1) infinite 0.5s",
                }} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: C.hairline }} />

          {/* Contact rows */}
          <div style={{ padding: "0 4px" }}>
            <ContactRow icon={Icons.Mail}     label="email"    value={CONTACT.email}               href={`mailto:${CONTACT.email}`} delay={300} />
            <ContactRow icon={Icons.Phone}    label="phone"    value={CONTACT.phoneDisplay}         href={`tel:${CONTACT.phone}`}    delay={420} />
            <ContactRow icon={Icons.LinkedIn} label="linkedin" value={`/${CONTACT.linkedinHandle}`} href={CONTACT.linkedin}          delay={540} />
            <ContactRow icon={Icons.GitHub}   label="github"   value={CONTACT.githubHandle}         href={CONTACT.github}            delay={660} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: C.hairline }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, padding: "16px 16px 16px" }}>
            <button
              onClick={handleSaveContact}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "11px 16px",
                border: `1px solid ${saved ? C.green : C.muted}`,
                background: saved ? "rgba(0,217,54,0.08)" : "transparent",
                color: saved ? C.green : C.soft,
                fontSize: 9, fontWeight: 600, fontFamily: C.font,
                letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!saved) {
                  e.currentTarget.style.borderColor = C.green;
                  e.currentTarget.style.color = C.green;
                  e.currentTarget.style.background = "rgba(0,217,54,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!saved) {
                  e.currentTarget.style.borderColor = C.muted;
                  e.currentTarget.style.color = C.soft;
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icons.Download />
              {saved ? "saved" : "> save contact"}
            </button>

            <button
              onClick={() => setShowQR(!showQR)}
              style={{
                alignSelf: "stretch", aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${showQR ? C.green : C.hairline}`,
                background: showQR ? "rgba(0,217,54,0.08)" : "transparent",
                color: showQR ? C.green : C.faint,
                cursor: "pointer", transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
              onMouseLeave={(e) => {
                if (!showQR) {
                  e.currentTarget.style.borderColor = C.hairline;
                  e.currentTarget.style.color = C.faint;
                }
              }}
            >
              <Icons.QR />
            </button>
          </div>

          {/* QR panel */}
          <div style={{
            maxHeight: showQR ? 220 : 0, opacity: showQR ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.22,0.61,0.36,1), opacity 0.3s ease",
          }}>
            <div style={{
              borderTop: `1px solid ${C.hairline}`,
              padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}>
              <QRCode data={pageUrl} size={160} />
              <span style={{ fontSize: 9, color: C.faint, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                scan to connect
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 2px 0",
          opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.9s",
        }}>
          <span style={{ fontSize: 9, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            ── nfc enabled
          </span>
          <a
            href="https://solomonsmith.dev"
            style={{ fontSize: 9, color: C.faint, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.soft; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.faint; }}
          >
            view portfolio →
          </a>
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        @keyframes cur { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
        ::selection { background: rgba(0,217,54,0.25); color: #0A0E0A; }
      `}</style>
    </div>
  );
}
