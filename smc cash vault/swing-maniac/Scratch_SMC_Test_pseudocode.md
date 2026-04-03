# Swing Maniac - Full Pseudocode

## 1) Initialize indicator

```
START INDICATOR "Swing Maniac"
    overlay = true
    set max object counts (boxes, lines, labels, bars back)
END
```

---

## 2) Inputs and configuration

```
READ user inputs grouped by:
    - Structure Settings
    - Display
    - Colors

DERIVE mode flags from input selections:
    useChochObPoiEntry
    usePoi15mIfvg
    usePoi15mChochOb
```

---

## 3) Helper functions

```
FUNCTION f_zoneMid(a, b):
    RETURN midpoint if both values exist, else na

FUNCTION f_chartRangeHasQualifyingFvg(pivotBarIdx, obBias, minAtrMult):
    FOR bars from current bar back to pivot (bounded for safety/performance):
        compute ATR-based minimum gap
        IF obBias is bullish:
            detect bullish FVG gap size >= threshold
        ELSE:
            detect bearish FVG gap size >= threshold
        IF qualifying gap found:
            RETURN true
    RETURN false
```

---

## 4) 4H external structure basics (Lux-style leg model)

```
FUNCTION f_4hBasics(swingLen):
    track leg state using:
        newLegHigh / newLegLow
    update latest swing high/low + times on pivot changes

    bullBOS = close breaks above last swing high
    bearBOS = close breaks below last swing low

    extChochBull = wick sweeps below swing low but closes back above (no BOS)
    extChochBear = wick sweeps above swing high but closes back below (no BOS)

    RETURN swings, times, BOS signals, ext-CHOCH signals
```

Then on chart:

```
REQUEST 4H f_4hBasics() via request.security
REQUEST 4H close
```

---

## 5) External bias engine (4H major structure)

```
INIT bias = neutral
INIT strongHighLevel / strongLowLevel
INIT extChochWarning

ON each new 4H bar:
    IF bullBOS4H:
        bias = bullish
        strongLowLevel = latest 4H swing low
    ELSE IF bearBOS4H:
        bias = bearish
        strongHighLevel = latest 4H swing high

    extChochWarning = ext CHOCH opposite current bias
```

Track external mixed CHOCH phase:

```
ON each new 4H bar:
    remember if bull ext CHOCH seen
    remember if bear ext CHOCH seen
    reset both when any external BOS prints

COMPUTE:
    extMixedBothChoch
    blockStrongFlowSellsMixed
    blockStrongFlowBuysMixed
```

---

## 6) Chart-timeframe (CTF) swing/trailing structure

```
TRACK Lux-style leg changes with ctfSwingLen
ON new pivot:
    update tfSwingHigh / tfSwingLow + bar indexes
    reset crossed flags
    reset trailing anchors

ALWAYS update trailing extremes:
    tfTrailingTop = max running high
    tfTrailingBottom = min running low

COMPUTE premium/discount text from midpoint of trailing range

DETECT CTF swing breaks:
    tfBullBreak (cross above swing high)
    tfBearBreak (cross below swing low)
UPDATE tfSwingTrendBias accordingly
```

---

## 7) Strong-zone counter-trend gate (CT gate)

```
DEFINE strong and weak levels from trailing range + tfSwingTrendBias
DETECT touch of strong/weak padded bands

IF feature disabled:
    clear gate state

IF gate active:
    EXIT gate when:
        - weak band touched
        - chart swing bias flips
        - optional opposing external CHOCH on new 4H bar

IF gate inactive and eligible:
    ARM gate when strong band touched in current swing direction
    ctGateDir = long-leg or short-leg

DERIVE:
    ctGateLong
    ctGateShort
```

---

## 8) CTF parsed candles + swing OB storage

```
PARSE high-vol candles using ATR(200) filter
PUSH parsed high/low/time into arrays (bounded size)

DEFINE arrays for CTF swing OBs:
    top, bottom, time, bias, pivotBar, fvgQualified
```

Store OB function:

```
FUNCTION f_storeCtfSwingOb(pivotBarIdx, obBias):
    scan bars from break back to pivot (bounded)
    IF bullish OB:
        choose candle with minimum parsed low
    IF bearish OB:
        choose candle with maximum parsed high

    IF valid zone found:
        compute FVG qualification (or bypass if disabled)
        unshift into CTF OB arrays
        trim arrays to max size
```

Trigger storage:

```
IF tfBullBreak -> store bullish swing OB
IF tfBearBreak -> store bearish swing OB
```

---

## 9) Supply/Demand flow POI detection + mitigation

```
DETECT Lux-style volume-pivot demand/supply zones
ON new demand/supply zone:
    avoid duplicate
    compute pivot bar
    compute FVG qualification
    store in flow arrays
    trim arrays
```

Mitigation:

```
FOR CTF swing OBs (reverse iteration):
    IF mitigated by opposite cross-through:
        convert failed OB into breaker block (opposite bias)
        remove original CTF OB

FOR flow demand/supply zones:
    mitigate via wick/close method setting
    remove mitigated zones
```

Breaker readiness:

```
FOR each breaker not ready:
    require expansion away from breaker by ATR multiple
    set breaker ready when threshold met
```

---

## 10) Last-bar visuals: structure, OB/POI, bias labels

```
ON barstate.islast:
    delete previous dynamic boxes/labels
    redraw:
        - swing range box
        - strong/weak bands
        - CTF swing OB boxes
        - flow POI boxes
        - breaker POI boxes
        - bias label (+ ext CHOCH warning)
        - premium/discount status label
```

---

## 11) MTF helper functions for OB/FVG logic

```
DEFINE candle/body helpers:
    bullish/bearish candle checks
    body top/bottom
    midpoint
    formatter
    range overlap test

FUNCTION f_ifvgViolation():
    detect bullish and bearish FVG with ATR size filter
    persist latest bull/bear FVG bounds
    detect violation:
        - bearish FVG violated upward
        - bullish FVG violated downward
    RETURN FVG creation + violation + bounds

FUNCTION f_ltfChochRetestEngine(len, obLookback):
    detect LTF pivots/swing highs/lows
    detect CHOCH events
    on CHOCH, cache last opposite candle as OB
    wait for retest into that OB
    fire entry when retest occurs
    RETURN choch states, OB bounds, retest triggers
```

---

## 12) 4H Origin/Extreme OB model

```
FUNCTION f_4hOBs(swingLen, obLookback):
    detect swings + BOS
    on bull BOS:
        origin demand = last bearish candle pre-break
        extreme demand = deepest bearish candle in lookback
    on bear BOS:
        origin supply = last bullish candle pre-break
        extreme supply = highest bullish candle in lookback
    RETURN all zone bounds + BOS timestamps

REQUEST 4H outputs via request.security
```

---

## 13) 1H continuation OB + FVG model

```
FUNCTION f_1hCont(swingLen, obLookback):
    detect 1H swings + BOS
    on bull BOS:
        find bearish candle where next close breaks above body and bullish FVG exists
        output continuation demand + FVG
    on bear BOS:
        symmetric logic for continuation supply + bearish FVG
    RETURN continuation demand/supply states + bounds + birth times

REQUEST 1H outputs via request.security
```

---

## 14) Zone lifecycle state (origin/continuation/extreme)

```
DECLARE active + mitigated flags and bounds for:
    - origin demand/supply
    - continuation demand/supply
    - extreme demand/supply

ON new source events (4H/1H):
    activate corresponding zone
    reset mitigation
    store bounds and born time
    deduplicate with last born timestamp

MITIGATION rule:
    zone mitigated if price trades through entire body
    only after born bar

COMPUTE in-zone booleans:
    inOriginDemand/Supply
    inContDemand/Supply
    inExtremeDemand/Supply

COMPUTE POI FVG exemption flags:
    always exempt inside extreme
    optional exempt inside origin/continuation
```

Deferred FVG qualification updates:

```
IF FVG requirement enabled:
    re-check non-qualified CTF OBs each bar
    re-check non-qualified flow zones each bar
    flip qualification to true once criteria met
```

---

## 15) Last-bar OB/FVG visualization

```
ON barstate.islast:
    delete old HTF/LTF OB and FVG boxes
    redraw active:
        origin demand/supply
        continuation demand/supply
        extreme demand/supply
        continuation FVG boxes (aligned with bias)
```

---

## 16) 15m micro CHOCH + chart leg completeness

```
DETECT 15m micro CHOCH using recent high/low break + local momentum pattern

TRACK chart leg completeness:
    ctfBullChochSeen / ctfBearChochSeen
    ctfBullBosSeen / ctfBearBosSeen
    opposing BOS clears opposite leg markers

DERIVE:
    ctfLongLegFull
    ctfShortLegFull

APPLY optional chart-leg bypass to mixed external CHOCH blockers:
    blockStrongFlowSellsMixedEff
    blockStrongFlowBuysMixedEff
```

---

## 17) LTF engines and IFVG feeds

```
REQUEST 5m and 15m f_ltfChochRetestEngine
REQUEST 15m f_ifvgViolation (for POI entry model)
GET chart and 1H IFVG signals (for fallback confirmation timeframe option)

SELECT active IFVG stream based on input:
    ifvgConfirmTf = Chart or 1H

SELECT active strong-entry LTF stream based on entryLtfChoice:
    5m or 15m
```

---

## 18) Detect touched strong/flow/breaker POIs

```
SCAN CTF swing OB arrays:
    detect touched strong-side bullish/bearish OB
    enforce POI validity using FVG qualification or HTF exemption

SCAN flow zone arrays:
    detect touched demand/supply flow zone
    enforce same POI validity checks

SCAN breaker arrays:
    detect touched ready + unused breakers
```

Arm states:

```
ARM strong buy/sell when touched
ARM flow buy/sell when touched and bias or CT gate direction allows
ARM breaker buy/sell when touched
STORE zone bounds + arm time + breaker born time
EXPIRE armed states after strongObArmBars
```

---

## 19) IFVG fallback state machine (premium/discount model)

```
DEFINE fallback context:
    only when no strong arm on either side
    formation must occur in swing extreme fraction

TRACK demand-side cycle (buy fallback):
    trigger waitDemandIfvg on bullish flow touch in discount extreme
    capture bearish FVG candidate in window
    confirm on bear IFVG violation
    lock entry level at configured fraction of IFVG height
    move to waitFallbackBullRetest

TRACK supply-side cycle (sell fallback):
    symmetric opposite logic

RESET cycles on external structural break (BOS/CHOCH), except guarded touch conditions

MAJOR IFVG handling:
    if IFVG size >= ATR threshold:
        pause opposing entry family
    release pause when source IFVG invalidates
```

Retest/touch:

```
fallbackBuyLevelTouched when price taps locked buy entry level
fallbackSellLevelTouched when price taps locked sell entry level
fallbackBuyRaw / fallbackSellRaw fire on touch (with CT gate and pause filters)
```

---

## 20) 15m IFVG-based POI entry model states

Used when `poiEntryModel` includes `15m IFVG`:

```
FOR strong buy/sell and flow buy/sell independently:
    state 0: idle
    state 1: overlapping opposing 15m FVG found inside armed POI
    state 2: inversion confirmed by violation; compute fixed 30% entry level

TRIGGER entry when price touches computed 30% level after confirmation
```

If model is CHOCH+OB-only, reset these IFVG states.

---

## 21) Entry trigger composition

```
BUILD trigger booleans:
    bullEntryTrigger / bearEntryTrigger for strong
    flowBullEntryTrigger / flowBearEntryTrigger for flow
    breaker triggers use fixed 5m retest

BUILD raw signal candidates:
    strongObBuyRaw / strongObSellRaw
    flowContBuyRaw / flowContSellRaw
    breakerBuyRaw / breakerSellRaw
    fallbackBuyRaw / fallbackSellRaw

APPLY global gates:
    - mixed external CHOCH gate
    - optional chart leg bypass
    - CT gate direction lock
    - major IFVG pause lock
    - flow entries must be in swing extremes
```

---

## 22) RR filter, precedence, and final signals

```
IF any raw signal exists:
    compute candidate entry/sl/tp2 based on active family and model
    compute RR candidate

rrPass = RR >= minSignalRR

FINAL signals:
    strong/flow/breaker require rrPass
    fallback is allowed regardless of RR
    if fallback triggers on bar, it overrides other families that bar
```

Track signal POI bounds for visualization.

Mark used breaker as consumed when triggered.

Disarm corresponding arm states after confirmed signal.

---

## 23) Debug labels and POI proximity diagnostics

```
ON last bar, if enabled:
    draw arm state label with:
        strong/flow arm status
        fallback state
        external CHOCH phase + mixed gates
        chart leg completeness
        CT gate status

    draw POI status label with:
        demand/supply touch-near-far
        bull/bear OB touch-near-far
        nearest distances
```

---

## 24) Additional legacy CHOCH-in-zone booleans

```
COMPUTE continuation/origin/extreme buy/sell booleans
    from bias + in-zone + 15m CHOCH + CT gate filters
```

These are mostly for compatibility/alerts alongside main signal engine.

---

## 25) Signal packaging, SL/TP projection, and drawings

```
anySignal = any strong/flow/breaker/fallback final signal
build signalType and direction strings

ON confirmed signal:
    compute entry, SL, TP1, TP2, RR
    create buy/sell label
    optionally draw:
        - entry line
        - SL/TP dashed guide lines
        - connector line
    create triggered POI box if enabled
    keep bounded history sizes
```

Fallback waiting lines:

```
ON last bar:
    draw active fallback entry guide line for buy or sell wait state
```

Violated IFVG boxes:

```
ON confirmed bars:
    when IFVG violation occurs, draw violation box (deduplicated by bounds)
    keep bounded history
```

---

## 26) Alerts

```
DEFINE static alertcondition() entries for:
    continuation/origin/extreme buy/sell
    strong/flow/breaker/fallback entries
    any signal

ON confirmed anySignal:
    build dynamic alert payload:
        signal type
        symbol
        direction
        entry
        proposed RR
        zone
        bias
        CT gate state
    send alert() once per bar close
```

---

## 27) Post-render cleanup for fallback states

```
AFTER rendering and alerts:
    if fallback buy fired:
        reset all buy fallback wait/confirm/candidate/state vars
    if fallback sell fired:
        reset all sell fallback wait/confirm/candidate/state vars
```

---

## 28) End of script

```
END
```

