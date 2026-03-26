import { useState } from "react";

const sections = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "structure", label: "Market Structure", icon: "⬡" },
    { id: "criteria1", label: "Criteria 1", icon: "①" },
    { id: "criteria2", label: "Criteria 2", icon: "②" },
    { id: "criteria3", label: "Criteria 3", icon: "③" },
    { id: "criteria4", label: "Criteria 4", icon: "④" },
    { id: "checklist", label: "Checklist", icon: "✦" },
];

const TFRule = () => (
    <div style={{ background: "#6366f108", border: "1px solid #6366f125", borderRadius: 8, padding: "1rem", marginBottom: "0.25rem" }}>
        <p style={{ color: "#818cf8", fontSize: 11, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.1em", margin: "0 0 0.6rem" }}>⧖ CONFIRMATION TIMEFRAME RULE</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
                { tf: "1H", when: "Price reacting slowly and methodically from POI. Full candle close available. Clean 1H structure." },
                { tf: "15M", when: "Price reacting aggressively and fast. 1H candle hasn't closed yet but 15M criteria is clear. Better RR needed." },
            ].map(row => (
                <div key={row.tf} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ background: "#6366f120", border: "1px solid #6366f140", borderRadius: 4, padding: "0.1rem 0.5rem", color: "#818cf8", fontFamily: "monospace", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{row.tf}</span>
                    <p style={{ color: "#94a3b8", fontSize: 12, margin: 0, lineHeight: 1.6 }}>{row.when}</p>
                </div>
            ))}
        </div>
        <p style={{ color: "#6366f1", fontSize: 11, margin: "0.6rem 0 0", fontStyle: "italic" }}>
            ⚠ 15M signal must always agree with 1H structure direction. Never take a 15M signal that contradicts what the 1H is forming.
        </p>
    </div>
);

const StepRow = ({ n, t, c, bear }) => (
    <div style={{ display: "flex", gap: "0.6rem" }}>
        <span style={{ color: n.startsWith("→") ? (bear ? "#ef4444" : "#10b981") : "#f59e0b", fontFamily: "monospace", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2, minWidth: 24 }}>{n}</span>
        <p style={{ color: c || (n.startsWith("→") ? (bear ? "#ef4444" : "#10b981") : "#94a3b8"), fontSize: 12, margin: 0, lineHeight: 1.6 }}>{t}</p>
    </div>
);

const Booster = ({ text }) => (
    <div style={{ marginTop: "1rem", background: "#f59e0b08", border: "1px solid #f59e0b20", borderRadius: 6, padding: "0.75rem" }}>
        <p style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, margin: "0 0 0.3rem" }}>✦ PROBABILITY BOOSTER</p>
        <p style={{ color: "#94a3b8", fontSize: 11, margin: 0 }}>{text}</p>
    </div>
);

const Invalidation = ({ items }) => (
    <div style={{ marginTop: "0.75rem", background: "#ef444410", border: "1px solid #ef444420", borderRadius: 6, padding: "0.75rem" }}>
        <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, margin: "0 0 0.5rem" }}>INVALIDATION</p>
        {items.map((p, i) => (
            <p key={i} style={{ color: "#64748b", fontSize: 11, margin: "0 0 0.25rem", display: "flex", gap: "0.4rem" }}>
                <span style={{ color: "#ef4444" }}>✕</span>{p}
            </p>
        ))}
    </div>
);

const TFCompareTable = ({ rows }) => (
    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #1e2535", marginBottom: "0.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", background: "#0a0c10", borderBottom: "1px solid #1e2535" }}>
            {["", "1H", "15M"].map((h, i) => (
                <div key={i} style={{ padding: "0.5rem 0.75rem", color: i === 0 ? "#475569" : "#818cf8", fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em" }}>{h}</div>
            ))}
        </div>
        {rows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", borderBottom: i < rows.length - 1 ? "1px solid #1a2030" : "none", background: i % 2 === 0 ? "#0f121880" : "transparent" }}>
                <div style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontSize: 11 }}>{row[0]}</div>
                <div style={{ padding: "0.5rem 0.75rem", color: "#94a3b8", fontSize: 11 }}>{row[1]}</div>
                <div style={{ padding: "0.5rem 0.75rem", color: "#94a3b8", fontSize: 11 }}>{row[2]}</div>
            </div>
        ))}
    </div>
);

const BiasPair = ({ bullishSteps, bearishSteps, boosterText, invalidationItems, showTFRule = true, showTFTable = null }) => (
    <>
        {showTFRule && <TFRule />}
        {showTFTable && <TFCompareTable rows={showTFTable} />}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ border: "1px solid #10b98130", borderRadius: 10, padding: "1.25rem", background: "#064e3b08" }}>
                <p style={{ color: "#10b981", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>▲ BULLISH</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {bullishSteps.map((row, i) => <StepRow key={i} {...row} bear={false} />)}
                </div>
                {boosterText && <Booster text={boosterText} />}
                {invalidationItems && <Invalidation items={invalidationItems} />}
            </div>
            <div style={{ border: "1px solid #ef444430", borderRadius: 10, padding: "1.25rem", background: "#450a0a08" }}>
                <p style={{ color: "#ef4444", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>▼ BEARISH</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {bearishSteps.map((row, i) => <StepRow key={i} {...row} bear={true} />)}
                </div>
                {boosterText && <Booster text={boosterText} />}
                {invalidationItems && <Invalidation items={invalidationItems} />}
            </div>
        </div>
    </>
);

export default function TradingPlan() {
    const [active, setActive] = useState("overview");
    const [checklistState, setChecklistState] = useState({});
    const toggleCheck = (id) => setChecklistState(p => ({ ...p, [id]: !p[id] }));

    const checklist = [
        { id: "c1", group: "4H — BIAS & POI", label: "4H external structure defined — directional bias established (bullish or bearish)" },
        { id: "c2", group: "4H — BIAS & POI", label: "Unmitigated 4H POI identified in the direction of bias (OB, FVG, or key level)" },
        { id: "c3", group: "4H — BIAS & POI", label: "Price has tapped or is approaching the 4H POI — setup is now active" },
        { id: "c4", group: "1H — ZONE FILTER & CONFIRMATION", label: "Dropped to 1H — price is in the discount zone (bullish) or premium zone (bearish)" },
        { id: "c5", group: "1H — ZONE FILTER & CONFIRMATION", label: "1H swing structure supports the 4H bias — no conflicting structure" },
        { id: "c6", group: "1H — ZONE FILTER & CONFIRMATION", label: "Entry criteria identified (C1, C2, C3, or C4)" },
        { id: "c7", group: "1H — ZONE FILTER & CONFIRMATION", label: "Confirmation TF selected — 1H (slow reaction) or 15M (fast/aggressive reaction)" },
        { id: "c8", group: "1H — ZONE FILTER & CONFIRMATION", label: "If using 15M — signal agrees with 1H structure direction" },
        { id: "c9", group: "1H — ZONE FILTER & CONFIRMATION", label: "Confirmation received on chosen TF — MSS / Sweep / iFVG / OB+FVG within POI" },
        { id: "c10", group: "1H — ZONE FILTER & CONFIRMATION", label: "Entry zone marked — OB, FVG, Golden Zone, iFVG midpoint, or 1H OB+FVG within 4H POI" },
        { id: "c11", group: "1H — ZONE FILTER & CONFIRMATION", label: "Probability booster present (optional but noted)" },
        { id: "c12", group: "RISK MANAGEMENT", label: "Stop loss placed beyond 1H strong swing / sweep wick / HTF POI" },
        { id: "c13", group: "RISK MANAGEMENT", label: "Take profit set at next HTF liquidity or draw on liquidity" },
        { id: "c14", group: "RISK MANAGEMENT", label: "Criteria type and confirmation TF logged for performance tracking" },
    ];

    const groups = [...new Set(checklist.map(c => c.group))];
    const completed = Object.values(checklistState).filter(Boolean).length;

    return (
        <div style={{ fontFamily: "'Georgia', serif", background: "#0a0c10", minHeight: "100vh", color: "#e2e8f0" }}>
            <div style={{ background: "linear-gradient(180deg, #0f1218 0%, #0a0c10 100%)", borderBottom: "1px solid #1e2535", padding: "2rem 2rem 1.5rem" }}>
                <div style={{ maxWidth: 960, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                        <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#f59e0b", fontFamily: "monospace" }}>SMART MONEY CONCEPTS</span>
                    </div>
                    <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>Trading Plan</h1>
                    <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>External Structure · Entry Criteria · Execution Framework</p>
                </div>
            </div>

            <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    {sections.map(s => (
                        <button key={s.id} onClick={() => setActive(s.id)} style={{ padding: "0.5rem 1rem", borderRadius: 6, border: active === s.id ? "1px solid #f59e0b" : "1px solid #1e2535", background: active === s.id ? "#f59e0b15" : "transparent", color: active === s.id ? "#f59e0b" : "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "monospace", letterSpacing: "0.05em", transition: "all 0.15s" }}>
                            {s.icon} {s.label}
                        </button>
                    ))}
                </div>

                {/* OVERVIEW */}
                {active === "overview" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: "1rem" }}>Plan Philosophy</h2>
                            <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14, margin: 0 }}>
                                This trading plan is built on <span style={{ color: "#f59e0b" }}>Smart Money Concepts</span>. The 4H establishes directional bias and identifies unmitigated POIs. The 1H applies the discount/premium zone filter and confirms entry criteria. The 15M provides an earlier, tighter entry when price reacts aggressively. Every trade must have all three timeframes aligned before execution.
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                            {[
                                { label: "Bias & POI", value: "4H", sub: "Direction + unmitigated levels" },
                                { label: "Zone Filter", value: "1H", sub: "Discount / premium + confirmation" },
                                { label: "Early Entry", value: "15M", sub: "Aggressive reaction trigger" },
                                { label: "Entry Criteria", value: "4", sub: "Independent, testable setups" },
                            ].map(card => (
                                <div key={card.label} style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.25rem" }}>
                                    <p style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.1em", margin: "0 0 0.5rem", fontFamily: "monospace" }}>{card.label.toUpperCase()}</p>
                                    <p style={{ color: "#f59e0b", fontSize: 24, fontWeight: 700, margin: "0 0 0.25rem", fontFamily: "monospace" }}>{card.value}</p>
                                    <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>{card.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Timeframe Hierarchy */}
                        <div style={{ background: "#6366f108", border: "1px solid #6366f125", borderRadius: 10, padding: "1.25rem" }}>
                            <p style={{ color: "#818cf8", fontSize: 12, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>TIMEFRAME HIERARCHY</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {[
                                    { tf: "4H", role: "Bias & Unmitigated POIs", detail: "Identify external structure (Strong Low/High + Weak High/Low). Mark unmitigated OBs and FVGs in the direction of bias. These are your areas of interest." },
                                    { tf: "1H", role: "Zone Filter + Entry Confirmation", detail: "Apply the discount/premium zone filter here. Price must be on the correct side of the 1H equilibrium. Confirm entry criteria (MSS, sweep, iFVG, or OB+FVG within 4H POI)." },
                                    { tf: "15M", role: "Early Entry Trigger", detail: "Used when price reacts aggressively from a POI — provides earlier entry, tighter SL, better RR. Must always align with 1H structure direction." },
                                ].map(row => (
                                    <div key={row.tf} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.75rem", borderRadius: 8, background: "#0a0c10", border: "1px solid #1a2030" }}>
                                        <span style={{ background: "#6366f120", border: "1px solid #6366f140", borderRadius: 4, padding: "0.2rem 0.6rem", color: "#818cf8", fontFamily: "monospace", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{row.tf}</span>
                                        <div>
                                            <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, margin: "0 0 0.2rem" }}>{row.role}</p>
                                            <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{row.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Down Flow */}
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: "1rem" }}>Top Down Analysis Flow</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {[
                                    { step: "01", tf: "4H", label: "Establish Directional Bias", detail: "Define external structure — Strong Low/High and Weak High/Low" },
                                    { step: "02", tf: "4H", label: "Mark Unmitigated POIs", detail: "Identify OBs, FVGs, and key levels that have not yet been tested" },
                                    { step: "03", tf: "1H", label: "Apply Zone Filter", detail: "Bullish → price must be in 1H discount zone  |  Bearish → price must be in 1H premium zone" },
                                    { step: "04", tf: "1H", label: "Confirm 1H Structure Alignment", detail: "Ensure 1H swing structure is not conflicting with the 4H bias" },
                                    { step: "05", tf: "1H", label: "Wait for POI Tap", detail: "Price reaches the 4H POI or a valid unmitigated 1H level within the correct zone — setup is active" },
                                    { step: "06", tf: "1H/15M", label: "Select Confirmation TF", detail: "Slow reaction → 1H  |  Fast/aggressive reaction → 15M (must align with 1H)" },
                                    { step: "07", tf: "1H/15M", label: "Apply Entry Criteria", detail: "Execute Criteria 1, 2, 3, or 4 on the chosen confirmation timeframe" },
                                ].map(row => (
                                    <div key={row.step} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.75rem", borderRadius: 8, background: "#0a0c10", border: "1px solid #1a2030" }}>
                                        <span style={{ color: "#f59e0b", fontFamily: "monospace", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{row.step}</span>
                                        <span style={{ background: "#6366f120", border: "1px solid #6366f140", borderRadius: 4, padding: "0.1rem 0.4rem", color: "#818cf8", fontFamily: "monospace", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{row.tf}</span>
                                        <div>
                                            <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, margin: "0 0 0.2rem" }}>{row.label}</p>
                                            <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{row.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Criteria Summary */}
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: "1rem" }}>Entry Criteria Summary</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {[
                                    { n: "C1", label: "HTF POI + MSS + OB/FVG + Golden Zone", detail: "MSS on 1H or 15M after POI tap, entry at OB/FVG or Golden Zone fib" },
                                    { n: "C2", label: "Turtle Soup + MSS + OB/FVG", detail: "Liquidity sweep of obvious level at POI, MSS confirms, entry at OB/FVG" },
                                    { n: "C3", label: "HTF POI + FVG Invalidation (iFVG)", detail: "Bearish/Bullish FVG close to POI invalidated on 1H or 15M, entry at iFVG midpoint" },
                                    { n: "C4", label: "4H POI → 1H OB + FVG Within POI", detail: "Zoom into 4H POI on 1H, find OB + FVG inside it, limit order with SL beyond 1H strong swing" },
                                ].map(row => (
                                    <div key={row.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.75rem", borderRadius: 8, background: "#0a0c10", border: "1px solid #1a2030" }}>
                                        <span style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: 4, padding: "0.1rem 0.5rem", color: "#f59e0b", fontFamily: "monospace", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{row.n}</span>
                                        <div>
                                            <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, margin: "0 0 0.2rem" }}>{row.label}</p>
                                            <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{row.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MARKET STRUCTURE */}
                {active === "structure" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>External Structure Framework</h2>
                            <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1.25rem" }}>Defined on 4H. Establishes bias and marks the boundaries of where smart money is likely to operate.</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                {[
                                    { color: "#10b981", label: "▲ BULLISH STRUCTURE", diagram: [{ t: "Weak High ········ 100%", c: "#fbbf24" }, { t: "     /", c: "#64748b" }, { t: "    / ← BOS", c: "#64748b" }, { t: "   /", c: "#64748b" }, { t: "Strong Low ······· 0%", c: "#10b981" }] },
                                    { color: "#ef4444", label: "▼ BEARISH STRUCTURE", diagram: [{ t: "Strong High ······· 0%", c: "#ef4444" }, { t: "   \\", c: "#64748b" }, { t: "    \\ ← BOS", c: "#64748b" }, { t: "     \\", c: "#64748b" }, { t: "Weak Low ·········· 100%", c: "#fbbf24" }] },
                                ].map(s => (
                                    <div key={s.label} style={{ border: `1px solid ${s.color}30`, borderRadius: 8, padding: "1.25rem", background: `${s.color}08` }}>
                                        <p style={{ color: s.color, fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>{s.label}</p>
                                        <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2, background: "#0a0c10", borderRadius: 6, padding: "0.75rem", marginBottom: "0.75rem" }}>
                                            {s.diagram.map((d, i) => <div key={i} style={{ color: d.c }}>{d.t}</div>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Zone filter on 1H */}
                        <div style={{ background: "#f59e0b08", border: "1px solid #f59e0b25", borderRadius: 10, padding: "1.5rem" }}>
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b", marginBottom: "0.5rem", fontFamily: "monospace", letterSpacing: "0.05em" }}>⚡ ZONE FILTER APPLIED ON 1H — NOT 4H</h2>
                            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, margin: "0 0 1rem" }}>
                                The 4H only establishes <span style={{ color: "#f8fafc" }}>bias</span> and marks <span style={{ color: "#f8fafc" }}>unmitigated POIs</span>. The discount/premium zone filter is applied when you drop to the <span style={{ color: "#f59e0b" }}>1H timeframe</span>. This prevents you from waiting too long for deep 4H pullbacks while still keeping you on the right side of the market.
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div style={{ background: "#10b98110", border: "1px solid #10b98125", borderRadius: 8, padding: "1rem" }}>
                                    <p style={{ color: "#10b981", fontSize: 11, fontWeight: 700, fontFamily: "monospace", marginBottom: "0.5rem" }}>▲ BULLISH BIAS</p>
                                    <p style={{ color: "#94a3b8", fontSize: 12, margin: 0, lineHeight: 1.7 }}>On 1H, price must be in the <span style={{ color: "#10b981" }}>discount zone</span> (below the 1H equilibrium). Look for unmitigated 4H POIs or valid 1H swing levels within this zone.</p>
                                </div>
                                <div style={{ background: "#ef444410", border: "1px solid #ef444425", borderRadius: 8, padding: "1rem" }}>
                                    <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, fontFamily: "monospace", marginBottom: "0.5rem" }}>▼ BEARISH BIAS</p>
                                    <p style={{ color: "#94a3b8", fontSize: 12, margin: 0, lineHeight: 1.7 }}>On 1H, price must be in the <span style={{ color: "#ef4444" }}>premium zone</span> (above the 1H equilibrium). Look for unmitigated 4H POIs or valid 1H swing levels within this zone.</p>
                                </div>
                            </div>
                        </div>

                        {/* 1H Swing levels */}
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>1H Swing Levels — Also Valid Entry Areas</h2>
                            <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>Price does not always need to reach the 4H Strong Low or Strong High. Unmitigated 1H swing levels within the correct zone are valid reaction areas.</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {[
                                    { icon: "✓", color: "#10b981", text: "The 1H swing level must be within the 1H discount (bullish) or premium (bearish) zone" },
                                    { icon: "✓", color: "#10b981", text: "The level must be unmitigated — price has not returned to it since it was created" },
                                    { icon: "✓", color: "#10b981", text: "The 4H bias must remain intact — no structural shift against your direction" },
                                    { icon: "✓", color: "#10b981", text: "Price must show a reaction at the level — MSS, sweep, iFVG, or OB+FVG confirmation" },
                                    { icon: "✕", color: "#ef4444", text: "Do not trade a 1H swing level if the 4H bias has been compromised" },
                                    { icon: "✕", color: "#ef4444", text: "Do not trade a previously mitigated 1H level — it has already served its purpose" },
                                ].map((row, i) => (
                                    <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: 6, background: "#0a0c10", border: "1px solid #1a2030" }}>
                                        <span style={{ color: row.color, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{row.icon}</span>
                                        <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>{row.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Strong vs Weak */}
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", marginBottom: "1rem" }}>Strong vs Weak Levels</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                {[
                                    { label: "WEAK HIGH / LOW", color: "#fbbf24", points: ["Most recently created level", "Least liquidity accumulated", "Path of least resistance", "Breaking it = likely retracement only"] },
                                    { label: "STRONG HIGH / LOW", color: "#10b981", points: ["Origin of the last impulse", "Institutional orders placed here", "Heavy liquidity accumulated", "Breaking it = genuine structure shift"] },
                                ].map(card => (
                                    <div key={card.label} style={{ background: "#0a0c10", border: `1px solid ${card.color}25`, borderRadius: 8, padding: "1rem" }}>
                                        <p style={{ color: card.color, fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.75rem" }}>{card.label}</p>
                                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                            {card.points.map((p, i) => <li key={i} style={{ color: "#94a3b8", fontSize: 12, display: "flex", gap: "0.5rem" }}><span style={{ color: card.color }}>·</span>{p}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CRITERIA 1 */}
                {active === "criteria1" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                <span style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: 700 }}>1</span>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", margin: 0 }}>HTF POI + MSS + OB/FVG + Golden Zone</h2>
                            </div>
                            <p style={{ color: "#64748b", fontSize: 13 }}>4H POI provides location. 1H or 15M MSS confirms direction. OB/FVG or Golden Zone gives the precise entry.</p>
                        </div>
                        <BiasPair
                            showTFTable={[
                                ["MSS", "Bullish/Bearish MSS on 1H", "Bullish/Bearish MSS on 15M"],
                                ["Order Block", "1H OB — last opposing candle", "15M OB — last opposing candle"],
                                ["FVG", "1H Fair Value Gap", "15M Fair Value Gap"],
                                ["Golden Zone", "Fib drawn on 1H impulse leg", "Fib drawn on 15M impulse leg"],
                                ["Entry", "Limit at 1H OB / FVG / Golden Zone", "Limit at 15M OB / FVG / Golden Zone"],
                                ["SL", "Below/above 1H MSS swing", "Below/above 15M MSS swing — tighter"],
                            ]}
                            bullishSteps={[
                                { n: "01", t: "4H bias bullish — unmitigated 4H POI identified" },
                                { n: "02", t: "Drop to 1H — confirm price is in the 1H discount zone" },
                                { n: "03", t: "Price taps 4H POI or valid 1H level within discount zone — setup active" },
                                { n: "04", t: "Select confirmation TF — 1H if slow reaction, 15M if aggressive" },
                                { n: "05", t: "Wait for Bullish MSS on chosen TF — swing high broken to the upside" },
                                { n: "06", t: "Mark Bullish OB on chosen TF — last bearish candle before impulse, ideally with overlapping FVG" },
                                { n: "07", t: "Entry options:" },
                                { n: "→A", t: "Buy limit at the OB level" },
                                { n: "→B", t: "Buy limit at Golden Zone (61.8–78.6% Fib) of MSS impulse leg" },
                                { n: "→C", t: "Best: Golden Zone overlaps with OB or FVG — triple confluence" },
                                { n: "SL", t: "Below HTF POI or below MSS swing low on chosen TF", c: "#ef4444" },
                                { n: "TP", t: "Next HTF liquidity or draw on liquidity above", c: "#10b981" },
                            ]}
                            bearishSteps={[
                                { n: "01", t: "4H bias bearish — unmitigated 4H POI identified" },
                                { n: "02", t: "Drop to 1H — confirm price is in the 1H premium zone" },
                                { n: "03", t: "Price taps 4H POI or valid 1H level within premium zone — setup active" },
                                { n: "04", t: "Select confirmation TF — 1H if slow reaction, 15M if aggressive" },
                                { n: "05", t: "Wait for Bearish MSS on chosen TF — swing low broken to the downside" },
                                { n: "06", t: "Mark Bearish OB on chosen TF — last bullish candle before impulse, ideally with overlapping FVG" },
                                { n: "07", t: "Entry options:" },
                                { n: "→A", t: "Sell limit at the OB level" },
                                { n: "→B", t: "Sell limit at Golden Zone (61.8–78.6% Fib) of MSS impulse leg" },
                                { n: "→C", t: "Best: Golden Zone overlaps with OB or FVG — triple confluence" },
                                { n: "SL", t: "Above HTF POI or above MSS swing high on chosen TF", c: "#ef4444" },
                                { n: "TP", t: "Next HTF liquidity or draw on liquidity below", c: "#10b981" },
                            ]}
                            boosterText="Golden Zone overlaps with both OB and FVG on chosen TF — triple confluence entry zone"
                        />
                    </div>
                )}

                {/* CRITERIA 2 */}
                {active === "criteria2" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                <span style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: 700 }}>2</span>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", margin: 0 }}>Turtle Soup + MSS + OB/FVG</h2>
                            </div>
                            <p style={{ color: "#64748b", fontSize: 13 }}>A liquidity sweep of an obvious level at the POI followed by a structural shift. One of the highest probability setups when all elements align.</p>
                        </div>

                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: "1rem", fontFamily: "monospace", letterSpacing: "0.05em" }}>VALID vs INVALID TURTLE SOUP</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div style={{ background: "#10b98110", border: "1px solid #10b98125", borderRadius: 8, padding: "1rem" }}>
                                    <p style={{ color: "#10b981", fontSize: 11, fontWeight: 700, fontFamily: "monospace", marginBottom: "0.75rem" }}>✓ VALID</p>
                                    {["Obvious, well-established swing high/low (equal highs/lows ideal)", "Sharp, quick sweep — not a slow grind", "Rejection candle closes back inside the swept level", "MSS follows on 1H or 15M confirming reversal", "Occurring directly at a 4H POI in the correct zone"].map((p, i) => (
                                        <p key={i} style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 0.4rem", display: "flex", gap: "0.5rem" }}><span style={{ color: "#10b981" }}>✓</span>{p}</p>
                                    ))}
                                </div>
                                <div style={{ background: "#ef444410", border: "1px solid #ef444425", borderRadius: 8, padding: "1rem" }}>
                                    <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, fontFamily: "monospace", marginBottom: "0.75rem" }}>✕ INVALID</p>
                                    {["Slow grind above/below the level — that is a breakout", "Candle closes beyond the level with no rejection", "No MSS on either 1H or 15M after the sweep", "Occurring in wrong zone — not in 1H discount/premium", "Swing point too recent with minimal liquidity built up"].map((p, i) => (
                                        <p key={i} style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 0.4rem", display: "flex", gap: "0.5rem" }}><span style={{ color: "#ef4444" }}>✕</span>{p}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <BiasPair
                            showTFTable={[
                                ["Sweep visibility", "Sweep visible on 1H", "Sweep visible on 15M"],
                                ["MSS", "1H MSS after sweep", "15M MSS after sweep"],
                                ["OB + FVG", "1H OB + FVG from MSS move", "15M OB + FVG from MSS move"],
                                ["SL", "Below/above 1H sweep wick", "Below/above 15M sweep wick — tighter"],
                            ]}
                            bullishSteps={[
                                { n: "01", t: "4H bias bullish — unmitigated 4H POI identified" },
                                { n: "02", t: "Drop to 1H — confirm price is in the 1H discount zone" },
                                { n: "03", t: "Wait for sweep of obvious swing low or equal lows within/near POI" },
                                { n: "04", t: "Confirm valid sweep — sharp, rejection candle closes back above swept low" },
                                { n: "05", t: "Select confirmation TF — 1H if reacting slowly, 15M if reacting fast" },
                                { n: "06", t: "Wait for Bullish MSS on chosen TF confirming reversal" },
                                { n: "07", t: "Mark Bullish OB + FVG from MSS move on chosen TF" },
                                { n: "08", t: "Set buy limit in OB/FVG zone" },
                                { n: "SL", t: "Below sweep candle wick on chosen TF", c: "#ef4444" },
                                { n: "TP", t: "Next HTF liquidity or draw on liquidity above", c: "#10b981" },
                            ]}
                            bearishSteps={[
                                { n: "01", t: "4H bias bearish — unmitigated 4H POI identified" },
                                { n: "02", t: "Drop to 1H — confirm price is in the 1H premium zone" },
                                { n: "03", t: "Wait for sweep of obvious swing high or equal highs within/near POI" },
                                { n: "04", t: "Confirm valid sweep — sharp, rejection candle closes back below swept high" },
                                { n: "05", t: "Select confirmation TF — 1H if reacting slowly, 15M if reacting fast" },
                                { n: "06", t: "Wait for Bearish MSS on chosen TF confirming reversal" },
                                { n: "07", t: "Mark Bearish OB + FVG from MSS move on chosen TF" },
                                { n: "08", t: "Set sell limit in OB/FVG zone" },
                                { n: "SL", t: "Above sweep candle wick on chosen TF", c: "#ef4444" },
                                { n: "TP", t: "Next HTF liquidity or draw on liquidity below", c: "#10b981" },
                            ]}
                            boosterText="Equal highs/lows swept — more liquidity engineered. 15M MSS confirms faster when price reacts aggressively."
                        />
                    </div>
                )}

                {/* CRITERIA 3 */}
                {active === "criteria3" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                <span style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: 700 }}>3</span>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", margin: 0 }}>HTF POI + FVG Invalidation (iFVG)</h2>
                            </div>
                            <p style={{ color: "#64748b", fontSize: 13 }}>FVGs created on the move into the POI become flipped institutional zones once invalidated. Often appears almost instantly once price reacts from a POI.</p>
                        </div>

                        <div style={{ background: "#f59e0b08", border: "1px solid #f59e0b20", borderRadius: 10, padding: "1.25rem" }}>
                            <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, margin: "0 0 0.5rem", fontFamily: "monospace" }}>⚠ PROXIMITY FILTER — CRITICAL RULE</p>
                            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                                Only FVGs <span style={{ color: "#f8fafc", fontWeight: 600 }}>close to the POI zone</span> are valid on both 1H and 15M. FVGs created far from the POI carry no institutional context and are disqualified regardless of how clean they appear. The speed of the iFVG forming after a POI tap is a positive signal — aggressive institutional reversal.
                            </p>
                        </div>

                        <BiasPair
                            showTFTable={[
                                ["FVGs traced", "Recent 1H FVGs near POI", "Recent 15M FVGs near POI"],
                                ["Invalidation signal", "1H candle closes above/below FVG", "15M candle closes above/below — faster"],
                                ["Entry", "Midpoint of 1H iFVG", "Midpoint of 15M iFVG"],
                                ["SL", "Below/above 1H iFVG", "Below/above 15M iFVG — tighter"],
                                ["Proximity filter", "FVG must be close to 4H POI", "FVG must be close to 4H POI"],
                            ]}
                            bullishSteps={[
                                { n: "01", t: "4H bias bullish — unmitigated 4H POI identified" },
                                { n: "02", t: "Drop to 1H — confirm price is in the 1H discount zone" },
                                { n: "03", t: "Price taps 4H POI or valid 1H level — setup active" },
                                { n: "04", t: "Select confirmation TF — 1H or 15M based on speed of reaction" },
                                { n: "05", t: "Trace back on chosen TF — mark recent Bearish FVGs from the down move into POI" },
                                { n: "06", t: "Apply proximity filter — only FVGs close to the POI qualify", c: "#f59e0b" },
                                { n: "07", t: "Wait for candle to close above the Bearish FVG — creating a Bullish iFVG" },
                                { n: "08", t: "Place buy limit at the midpoint of the iFVG" },
                                { n: "SL", t: "Below HTF POI or below iFVG low", c: "#ef4444" },
                                { n: "TP", t: "Next HTF liquidity or draw on liquidity above", c: "#10b981" },
                            ]}
                            bearishSteps={[
                                { n: "01", t: "4H bias bearish — unmitigated 4H POI identified" },
                                { n: "02", t: "Drop to 1H — confirm price is in the 1H premium zone" },
                                { n: "03", t: "Price taps 4H POI or valid 1H level — setup active" },
                                { n: "04", t: "Select confirmation TF — 1H or 15M based on speed of reaction" },
                                { n: "05", t: "Trace back on chosen TF — mark recent Bullish FVGs from the up move into POI" },
                                { n: "06", t: "Apply proximity filter — only FVGs close to the POI qualify", c: "#f59e0b" },
                                { n: "07", t: "Wait for candle to close below the Bullish FVG — creating a Bearish iFVG" },
                                { n: "08", t: "Place sell limit at the midpoint of the iFVG" },
                                { n: "SL", t: "Above HTF POI or above iFVG high", c: "#ef4444" },
                                { n: "TP", t: "Next HTF liquidity or draw on liquidity below", c: "#10b981" },
                            ]}
                            boosterText="New FVG overlaps with the iFVG on chosen TF — stacked imbalance zone, double institutional confluence"
                            invalidationItems={[
                                "iFVG forms too far from 4H POI — disqualified",
                                "Candle closes above/below FVG with no momentum — weak signal",
                                "Price closes through FVG then immediately reverses back inside",
                                "15M iFVG signal contradicts 1H structure direction",
                                "Price is not in the correct 1H zone (discount/premium)",
                            ]}
                        />
                    </div>
                )}

                {/* CRITERIA 4 */}
                {active === "criteria4" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                <span style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: 700 }}>4</span>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", margin: 0 }}>4H POI → 1H OB + FVG Within POI</h2>
                            </div>
                            <p style={{ color: "#64748b", fontSize: 13 }}>Instead of waiting for a structural event after the POI tap, you zoom into the 4H POI on the 1H to find a pre-existing OB and FVG sitting inside it. The 1H strong swing anchors your stop. This is a precision entry directly into institutional order flow.</p>
                        </div>

                        <div style={{ background: "#6366f108", border: "1px solid #6366f125", borderRadius: 10, padding: "1.25rem" }}>
                            <p style={{ color: "#818cf8", fontSize: 12, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>⧖ WHAT MAKES THIS DIFFERENT FROM C1</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
                                <div style={{ background: "#0a0c10", borderRadius: 8, padding: "0.75rem", border: "1px solid #1e2535" }}>
                                    <p style={{ color: "#f59e0b", fontSize: 11, fontFamily: "monospace", fontWeight: 700, margin: "0 0 0.4rem" }}>CRITERIA 1</p>
                                    <p style={{ color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.6 }}>Waits for price to tap POI, then waits for an MSS to form, then enters at the OB/FVG created by that MSS impulse. Reactive — confirmation comes after the move.</p>
                                </div>
                                <div style={{ background: "#0a0c10", borderRadius: 8, padding: "0.75rem", border: "1px solid #1e2535" }}>
                                    <p style={{ color: "#f59e0b", fontSize: 11, fontFamily: "monospace", fontWeight: 700, margin: "0 0 0.4rem" }}>CRITERIA 4</p>
                                    <p style={{ color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.6 }}>Zooms into the 4H POI on 1H and finds an OB + FVG already sitting inside it before price arrives. Proactive — limit order is placed in advance with the 1H strong swing as the SL anchor.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            {/* BULLISH */}
                            <div style={{ border: "1px solid #10b98130", borderRadius: 10, padding: "1.25rem", background: "#064e3b08" }}>
                                <p style={{ color: "#10b981", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>▲ BULLISH</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                    {[
                                        { n: "01", t: "4H bias bullish — identify unmitigated 4H demand POI (OB or FVG)" },
                                        { n: "02", t: "Drop to 1H — confirm price is approaching the 4H POI from the 1H discount zone" },
                                        { n: "03", t: "Zoom into the 4H POI boundaries on the 1H chart" },
                                        { n: "04", t: "Locate a 1H Bullish OB within the 4H POI — the last bearish candle before a bullish impulse inside the zone" },
                                        { n: "05", t: "Confirm the OB has an overlapping or adjacent Bullish FVG — this is the high probability entry cluster" },
                                        { n: "06", t: "Place buy limit order within the 1H OB + FVG cluster inside the 4H POI" },
                                        { n: "SL", t: "Below the 1H strong swing low that anchors the OB — this is the structural invalidation point", c: "#ef4444" },
                                        { n: "TP", t: "Next HTF liquidity or draw on liquidity above", c: "#10b981" },
                                    ].map((row, i) => <StepRow key={i} {...row} bear={false} />)}
                                </div>
                                <Booster text="The 1H OB + FVG cluster sits at the deepest point inside the 4H POI — maximum institutional confluence, tightest possible SL" />
                                <Invalidation items={[
                                    "No clear 1H OB identifiable within the 4H POI boundaries",
                                    "OB exists but has no FVG overlap — confluence is insufficient",
                                    "The 1H strong swing SL would be wider than acceptable RR allows",
                                    "Price has already partially mitigated the 1H OB before entry",
                                    "4H bias has shifted — the POI is no longer valid",
                                ]} />
                            </div>

                            {/* BEARISH */}
                            <div style={{ border: "1px solid #ef444430", borderRadius: 10, padding: "1.25rem", background: "#450a0a08" }}>
                                <p style={{ color: "#ef4444", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>▼ BEARISH</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                    {[
                                        { n: "01", t: "4H bias bearish — identify unmitigated 4H supply POI (OB or FVG)" },
                                        { n: "02", t: "Drop to 1H — confirm price is approaching the 4H POI from the 1H premium zone" },
                                        { n: "03", t: "Zoom into the 4H POI boundaries on the 1H chart" },
                                        { n: "04", t: "Locate a 1H Bearish OB within the 4H POI — the last bullish candle before a bearish impulse inside the zone" },
                                        { n: "05", t: "Confirm the OB has an overlapping or adjacent Bearish FVG — this is the high probability entry cluster" },
                                        { n: "06", t: "Place sell limit order within the 1H OB + FVG cluster inside the 4H POI" },
                                        { n: "SL", t: "Above the 1H strong swing high that anchors the OB — this is the structural invalidation point", c: "#ef4444" },
                                        { n: "TP", t: "Next HTF liquidity or draw on liquidity below", c: "#10b981" },
                                    ].map((row, i) => <StepRow key={i} {...row} bear={true} />)}
                                </div>
                                <Booster text="The 1H OB + FVG cluster sits at the highest point inside the 4H POI — maximum institutional confluence, tightest possible SL" />
                                <Invalidation items={[
                                    "No clear 1H OB identifiable within the 4H POI boundaries",
                                    "OB exists but has no FVG overlap — confluence is insufficient",
                                    "The 1H strong swing SL would be wider than acceptable RR allows",
                                    "Price has already partially mitigated the 1H OB before entry",
                                    "4H bias has shifted — the POI is no longer valid",
                                ]} />
                            </div>
                        </div>
                    </div>
                )}

                {/* CHECKLIST */}
                {active === "checklist" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", margin: 0 }}>Pre-Trade Checklist</h2>
                                <span style={{ fontFamily: "monospace", fontSize: 13, color: completed === checklist.length ? "#10b981" : "#f59e0b" }}>{completed}/{checklist.length} ✓</span>
                            </div>
                            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Every box must be ticked before placing an order. Log criteria type and confirmation TF used.</p>
                        </div>

                        {groups.map(group => (
                            <div key={group} style={{ background: "#0f1218", border: "1px solid #1e2535", borderRadius: 10, padding: "1.25rem" }}>
                                <p style={{ color: "#f59e0b", fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "1rem" }}>{group}</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {checklist.filter(c => c.group === group).map(item => (
                                        <div key={item.id} onClick={() => toggleCheck(item.id)} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.75rem", borderRadius: 8, background: checklistState[item.id] ? "#10b98108" : "#0a0c10", border: `1px solid ${checklistState[item.id] ? "#10b98130" : "#1a2030"}`, cursor: "pointer", transition: "all 0.15s" }}>
                                            <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checklistState[item.id] ? "#10b981" : "#334155"}`, background: checklistState[item.id] ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                                                {checklistState[item.id] && <span style={{ color: "#0a0c10", fontSize: 11, fontWeight: 900 }}>✓</span>}
                                            </div>
                                            <p style={{ color: checklistState[item.id] ? "#64748b" : "#94a3b8", fontSize: 13, margin: 0, textDecoration: checklistState[item.id] ? "line-through" : "none", transition: "all 0.15s" }}>{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {completed === checklist.length && (
                            <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 10, padding: "1.25rem", textAlign: "center" }}>
                                <p style={{ color: "#10b981", fontSize: 14, fontWeight: 700, margin: "0 0 0.25rem" }}>✓ All criteria met — trade is valid</p>
                                <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>Log your entry, criteria type, and confirmation TF before executing</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
