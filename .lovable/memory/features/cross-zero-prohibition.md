---
name: Cross-zero reverse order prohibition
description: Trading rule — reverse orders may reduce/close but cannot cross zero into a new opposite position
type: feature
---
For the same canonical YES-axis market, reverse orders are allowed only up to the current position size. They are classified before margin checks:

1. Same direction open/add requires incremental initial margin.
2. Opposite direction reduce/flat-close requires zero incremental initial margin and releases proportional margin immediately.
3. Opposite direction beyond current size is blocked; users must close to zero before opening the opposite side.

Binary markets use the Yes-only model first: No Long -> Yes Short and No Short -> Yes Long. Mobile page preview and desktop dialog preview must both enforce this rule.
