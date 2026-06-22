# Collapsed Display And Styles

Use this reference when defining the island's collapsed state, quota/status display, nickname fallback, or built-in visual style options.

The collapsed state is the user's first contact with the island. It must be useful even when the user does not have quota data, status integrations, or developer tools connected.

## Data Fallback Rule

Never render a broken quota display.

If Codex, Claude Code, or any other status source is missing, invalid, unauthorized, or empty, do not show:

- `NaN`, `undefined`, `null`, or empty labels
- fake `0%` usage
- empty progress arcs
- fake reset times
- hard-coded Codex or Claude Code labels for users who do not use those tools

Fallback order:

1. Show valid quota or status data if it exists.
2. If a source exists but its data is unavailable, show that source's configured nickname.
3. If no quota/status sources are configured, show the user's nickname, display name, or team name.
4. If there is no nickname, show the island name.

Partial data is allowed. For example, if Codex has data and Claude Code does not, show the Codex value and use the configured nickname or neutral label for the missing side. If both are absent, do not show a two-provider quota layout; show the fallback label inside the chosen collapsed visual style.

Recommended config fields:

```json
{
  "collapsedDisplay": {
    "style": "taiji-quota",
    "fallbackLabel": "{{nickname}}",
    "quotaSources": ["codex", "claude-code"],
    "missingDataBehavior": "show-fallback-label"
  }
}
```

## Built-In Style Options

Offer these three styles during onboarding before asking for custom design.

### 1. 太极额度 / `taiji-quota`

Use when the user wants a quota/status feeling.

- Shape: paired circle, ring, or balanced two-side mark.
- Best for: Codex/Claude Code quota, dual-source status, AI work dashboards.
- Normal state: show two quota/status values when valid data exists.
- Fallback state: show the fallback label in the center or primary label position.
- Avoid: empty arcs, fake percentages, or provider labels without data.

### 2. 冰箱门 / `fridge-door`

Use when the user wants a friendly object that feels like opening a work space.

- Shape: rounded square or squircle.
- Material: light, frosted, soft plastic, or subtle metallic surface.
- Detail: a small handle or door edge that implies "open".
- Best for: general work islands, creator islands, link hubs, simple task launchers.
- Fallback state: show the nickname, island name, or short label on the door surface.
- Expanded motion: the door can open, slide, or reveal the module list.

### 3. 液态胶囊 / `liquid-capsule`

Use when the user wants a more expressive and ambient style.

- Shape: vertical capsule or pill.
- Material: dark upper surface plus translucent liquid, gradient, or glow in the lower half.
- Detail: a simple center mark, icon, or four-symbol motif.
- Best for: AI islands, status islands, moodier creator tools, compact launchers.
- Fallback state: show the fallback label or a simple symbol above the liquid layer.
- Expanded motion: the liquid can rise, glow, or stretch into the module surface.

## Custom Style Intake

If none of the built-in styles fit, ask the user for one of these:

1. A short visual description.
2. A reference image.
3. A rough sketch or screenshot.

Then extract:

- outer shape
- material and texture
- color palette
- text or icon placement
- collapsed-to-expanded motion
- fallback label behavior

Do not embed temporary clipboard images, private screenshots, or local reference paths into a public repository unless the user explicitly asks. Describe the style in neutral words and keep implementation assets generic or user-provided.

## Acceptance Checks

A collapsed display passes if:

- it looks intentional with no quota/status integrations configured
- it shows a nickname, island name, or configured fallback label when data is missing
- it does not expose private account names, local paths, tokens, or pricing data
- it still gives the user a clear way to expand the island
- the chosen visual style is recorded in local config, not scattered through hard-coded UI branches
