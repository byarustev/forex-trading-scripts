# Weekly HTF Rule-Based Checklist

Use this as a strict yes/no process each weekend before the new weekly candle opens.

## 1) Weekly Candle Classification (Last Closed Weekly Candle)

- [ ] Is the candle a **Disrespect candle**?
  Rule: body is dominant; combined upper+lower wick is smaller than body.
- [ ] Is the candle a **Respect candle**?
  Rule: one wick is clearly dominant (rejection wick top or bottom), signaling rejection/turn.
- [ ] If neither is clear, mark as **Neutral/No-trade bias** until clearer structure appears.

## 2) Weekly Market Context Filter (Overrides Candle Shape)

- [ ] Did the weekly close into/near a **major HTF POI** (monthly/weekly PD array)?
- [ ] Is current structure bullish or bearish (swing progression/BOS context)?
- [ ] If candle message conflicts with structure+POI, **follow structure**, not candle shape.

## Bias Rules (Directional Intent)

## 3) If Weekly Candle = Disrespect (Continuation Model)

- [ ] Bullish disrespect -> initial draw is **upside liquidity** (PXH first, then swing high).
- [ ] Bearish disrespect -> initial draw is **downside liquidity** (PXL first, then swing low).
- [ ] On LTF, expect same-direction FVG sequences (continuation delivery).

## 4) If Weekly Candle = Respect (Reversal/Reaction Model)

- [ ] Bearish respect (upper rejection) -> first target is that candle's **low**.
- [ ] Bullish respect (lower rejection) -> first target is that candle's **high**.
- [ ] On LTF, expect reversal signature (opposite-side FVG takeover / iFVG behavior).

## Targeting Rules

## 5) Target Ladder (Do not skip order unless invalidated)

- [ ] Target 1: `PXH` / `PXL` of relevant weekly candle.
- [ ] Target 2: nearest external swing high/low liquidity.
- [ ] Target 3: if weekly liquidity is already taken, expand to **monthly PD arrays**.

## 6) Premium/Discount Alignment

- [ ] In bullish conditions, prefer targets/continuation from **discount buy zones** and aim toward premium opposing arrays.
- [ ] In bearish conditions, prefer targets/continuation from **premium sell zones** and aim toward discount opposing arrays.

## Entry Preparation (From Weekly to Lower TF)

## 7) Weekly POI Selection

- [ ] Mark weekly PD arrays: FVG, mitigation block, breaker, OB, swing levels, PCH/PCL.
- [ ] Prioritize zones with **confluence/overlap** (e.g., FVG + mitigation/BOS).
- [ ] If first POI fails cleanly, reassess before trusting next POI blindly.

## 8) Timeframe Descent Rule

- [ ] Drop down max ~3 TF steps from weekly (e.g., W -> D -> H4 -> H1/15m).
- [ ] Do not keep dropping once a valid continuation/reversal POI is confirmed one TF lower.

## Execution Confirmation Rules (At POI)

## 9) Long Confirmation (at bullish POI)

- [ ] Price reaches weekly-defined discount POI.
- [ ] LTF prints bullish disrespect or downside-respecting rejection.
- [ ] LTF forms actionable bullish FVG/entry structure.
- [ ] If no confirmation -> no trade.

## 10) Short Confirmation (at bearish POI)

- [ ] Price reaches weekly-defined premium POI.
- [ ] LTF prints bearish disrespect or upside-respecting rejection.
- [ ] LTF forms actionable bearish FVG/entry structure.
- [ ] If no confirmation -> no trade.

## Invalidation & Risk Rules

## 11) Invalidation

- [ ] If price aggressively closes through POI and holds beyond it, invalidate that setup.
- [ ] If weekly close materially changes structure, rebuild bias from step 1.

## 12) Risk Discipline

- [ ] Max risk per trade fixed (e.g., 0.5%-1%).
- [ ] No new trade if weekly bias is neutral/mixed.
- [ ] One clean setup is enough; avoid overtrading inside same weekly thesis.
