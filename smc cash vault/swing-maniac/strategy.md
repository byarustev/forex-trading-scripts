# SWING → RETRACEMENT → EXPANSION TRADING STRATEGY (LLM SPEC)

## 1. Objective

Build a rule-based trading system that identifies high-probability continuation trades by combining:

* Higher Timeframe (HTF) directional bias
* Retracement into premium/discount zones
* Lower Timeframe (LTF) Change of Character (CHOCH)
* Entry at the origin of displacement

---

## 2. Timeframe Configuration

* HTF Bias: 4H (primary), 1H (secondary refinement)
* LTF Entry: 5M (primary), optional 15M

---

## 3. Core Concepts Definitions

### 3.1 Swing Structure (HTF)

Define swing highs/lows using a fractal or pivot-based method.

Bullish Structure:

* Higher High (HH) and Higher Low (HL)
* Break of Structure (BOS): close above previous swing high

Bearish Structure:

* Lower Low (LL) and Lower High (LH)
* BOS: close below previous swing low

Output:

* `htfBias = 1 (bullish) | -1 (bearish)`

---

### 3.2 Dealing Range

After a confirmed BOS:

* Define range from last swing low → swing high (bullish)
* Define range from last swing high → swing low (bearish)

Compute:

* Equilibrium (50%)
* Discount zone (0%–50%) → buy interest
* Premium zone (50%–100%) → sell interest

---

### 3.3 Retracement Condition

Bullish:

* Price must retrace into discount zone

Bearish:

* Price must retrace into premium zone

Optional confluence:

* Demand/Supply zones
* Fair Value Gap (FVG)
* Order Block (OB)

---

### 3.4 Internal Structure (LTF)

Define internal swing points using the same pivot logic.

### CHOCH (Change of Character)

Bullish CHOCH:

* Break above last lower high

Bearish CHOCH:

* Break below last higher low

---

### 3.5 Displacement Requirement

A valid CHOCH must:

* Be impulsive (large candle body relative to recent candles)
* Create imbalance (FVG or inefficient price movement)

Boolean:

* `displacement = true | false`

---

### 3.6 Entry Zone (Critical)

Identify the origin of the CHOCH move:

Bullish:

* Last bearish candle before displacement → demand zone

Bearish:

* Last bullish candle before displacement → supply zone

Zone definition:

* Range between candle open and low (bullish)
* Range between candle open and high (bearish)

---

## 4. Entry Rules

### Bullish Trade

Conditions:

1. `htfBias == 1`
2. Price is within discount zone
3. LTF bullish CHOCH confirmed
4. Displacement present

Entry:

* Place limit order at demand zone (origin of CHOCH)

---

### Bearish Trade

Conditions:

1. `htfBias == -1`
2. Price is within premium zone
3. LTF bearish CHOCH confirmed
4. Displacement present

Entry:

* Place limit order at supply zone

---

## 5. Stop Loss Logic

Options (choose one consistently):

### A. Structure-Based

* Bullish: below demand zone low
* Bearish: above supply zone high

### B. ATR Buffer

* SL = zone boundary ± (ATR * buffer)

---

## 6. Take Profit Logic

Targets:

* TP1: internal liquidity (recent highs/lows)
* TP2: external liquidity (HTF swing high/low)
* TP3: full expansion (optional runner)

Minimum trade requirement:

* Risk-to-Reward (RR) ≥ 3

Optional filter:

* Expected move must exceed minimum threshold (pair-adjusted)

---

## 7. Trade Filters

### 7.1 Liquidity Sweep (optional but recommended)

* Prefer setups where price sweeps equal highs/lows before CHOCH

---

### 7.2 Session Filter

Trade only during:

* London session
* New York session

Avoid:

* Low volatility (Asian session)

---

### 7.3 Market Quality Filter

Avoid trades when:

* Structure is choppy
* No clear swings
* Excessive wicks

---

### 7.4 Signal Deduplication

* Do not generate multiple signals from the same zone
* Track previously used zones

---

## 8. State Model (for implementation)

### Market State

```
{
  pair: string,
  htfBias: 1 | -1,
  dealingRange: { high: number, low: number },
  premiumZone: [number, number],
  discountZone: [number, number]
}
```

### Internal State

```
{
  choch: boolean,
  chochDirection: 1 | -1,
  displacement: boolean
}
```

### Zone Model

```
{
  type: 'demand' | 'supply',
  range: [low, high],
  valid: boolean,
  mitigated: boolean
}
```

---

## 9. Execution Logic (Pseudocode)

```
IF HTF_BOS_detected:
    set htfBias
    compute dealing range

IF htfBias == bullish AND price in discount zone:
    WAIT for LTF CHOCH

    IF CHOCH == bullish AND displacement == true:
        zone = identify demand zone

        PLACE buy limit at zone
        SET stop loss below zone
        SET take profit at next liquidity high

IF htfBias == bearish AND price in premium zone:
    WAIT for LTF CHOCH

    IF CHOCH == bearish AND displacement == true:
        zone = identify supply zone

        PLACE sell limit at zone
        SET stop loss above zone
        SET take profit at next liquidity low
```

---

## 10. Key Principle

Do NOT trade:

* Breakouts

ONLY trade:

* Pullbacks after structure shift

The strategy exploits:

* Institutional accumulation/distribution before expansion

---

## 11. Expected Behavior

* Low trade frequency
* High RR trades
* Requires patience and strict filtering

---

## 12. Extensions (Optional)

* Multi-timeframe alignment (4H → 1H → 5M)
* Confidence scoring system
* Backtesting module
* Auto-execution via broker API

---

## END OF SPEC
