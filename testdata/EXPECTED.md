# Test fixtures: expected radiance results

Load each via the app's **Load JSON** button.


## full_converges_to_0.json  (uid 810000001)
- coverage: full (reaches pre-v5.0)
- **expected: counter **0**, certain (full history)**

## three_loss_then_CR.json  (uid 810000002)
- coverage: partial (starts 2024-09-01); feasible starts [0, 1]
- **expected: counter **1**, certain (converges)**

## partial_ambiguous.json  (uid 810000003)
- coverage: partial (starts 2025-03-01); feasible starts [0, 1, 2, 3]
- **expected: ambiguous - feasible finals [1, 2], needs seed or CR-pick**

## partial_converges.json  (uid 810000004)
- coverage: partial (starts 2025-03-01); feasible starts [0, 1, 2, 3]
- **expected: counter **1**, certain (converges)**

## boundary_guarantee.json  (uid 810000005)
- coverage: full (reaches pre-v5.0)
- **expected: counter **0**, certain (full history)**

## two_CR_cycles.json  (uid 810000006)
- coverage: full (reaches pre-v5.0)
- **expected: counter **1**, certain (full history)**

## alternating_low.json  (uid 810000007)
- coverage: full (reaches pre-v5.0)
- **expected: counter **0**, certain (full history)**

## loss_pending.json  (uid 810000008)
- coverage: full (reaches pre-v5.0)
- **expected: counter **1**, certain (full history)**

## no_fives.json  (uid 810000009)
- coverage: n/a
- **expected: no character-banner 5★; app shows 'nothing to compute'**

## cr_eligible_c2.json  (uid 810000010)
- coverage: full (reaches pre-v5.0)
- **expected: counter **1**, certain (full history)**

## export_charmap_path.json  (uid 810000011)
- coverage: full (reaches pre-v5.0)
- **expected: counter **0**, certain (full history)**

## multi_uid.json  (uids 820000001, 820000002)
- two accounts in one export -> app shows a **UID picker**
- **expected: 820000001 -> counter 0; 820000002 -> counter 1**