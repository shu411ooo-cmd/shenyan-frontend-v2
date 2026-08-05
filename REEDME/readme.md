 Angel's Diary · Frontend

> A quiet little garden where two people leave traces of their days.

Angel's Diary is a personal relationship diary built around conversation, memories,
and the small traces left by two people over time.

The frontend is not designed as a conventional productivity app.
It should feel closer to a digital garden diary — quiet, intimate,
slightly imperfect, and lived-in.

---

## 1. Current Status

The current frontend has entered the **structural refinement stage**.

The main page structure is already established:

- Home
- Chat
- Moments
- Memory
- Me

The current priority is **not adding more features**.

The priority is:

1. Preserve the existing information hierarchy.
2. Make the layout clean and readable.
3. Reduce unnecessary card-like containers.
4. Establish a coherent visual language.
5. Add decorative assets only after the structure feels good without them.

> The interface should still look good when all decorative PNG assets are removed.

---

# 2. Core Design Philosophy

## Chat is the emotional center.

Chat is the most intimate space of the application.

Other pages should feel like places that grow naturally around the conversation,
rather than competing with it.

---

## The interface should feel "lived in".

The goal is not to create a perfectly polished dashboard.

It should feel like:

- a garden diary
- old stationery
- handwritten notes
- pressed flowers
- small traces left behind
- things that were kept rather than formally recorded

The UI should have **order at the macro level** and **natural imperfection at the micro level**.

### Important principle

> Structured overall, organic in detail.

Do NOT make the whole interface messy.

Instead:

- keep major sections aligned
- keep typography hierarchical
- keep spacing intentional
- allow small decorative elements to be slightly irregular

---

# 3. Visual Direction

## Overall feeling

European garden diary / botanical stationery / quiet summer evening.

The visual language combines:

- botanical illustration
- vintage paper
- soft stationery
- restrained romantic details
- subtle handwritten elements

It should feel warm and personal without becoming overly decorative.

---

## Color

The base palette should remain:

- warm ivory / paper
- muted sage green
- dusty pink
- pale blue
- muted lavender
- dark warm gray / ink

Avoid:

- pure white backgrounds
- highly saturated colors
- excessive contrast
- overly sweet pink
- glossy modern gradients

---

## Typography

Typography should create hierarchy through:

- serif display typography
- restrained small caps / letter spacing
- soft handwritten/script accents
- readable Chinese body text

Do not use decorative fonts everywhere.

Decorative typography is an accent, not the main reading interface.

---

# 4. Layout Principles

## No "card soup"

The previous design relied too heavily on large rounded cards.

This should NOT continue.

Avoid:

```text
┌──────────────────┐
│                  │
│      CONTENT     │
│                  │
└──────────────────┘

for every section.

Instead, use:

whitespace

thin rules

typography

subtle paper boundaries

small decorative anchors

indentation

section labels


to define hierarchy.

A section does not always need a visible container.


---

Containers should be quiet.

When a container is necessary:

use extremely subtle borders

avoid heavy shadows

avoid excessive corner radius

avoid strong background contrast


Think:

> one piece of paper resting on another piece of paper



rather than:

> a modern SaaS card.




---

5. Home

Home should feel like the front page of the garden diary.

It should answer:

> "What is happening here today?"



rather than presenting every piece of information available.

Current hierarchy

1. Greeting / date


2. Today's message


3. Weather + Mood


4. Garden Trace


5. Music Room


6. Keepsake / small memory entrance



The layout should remain relatively sparse.

Important

Home does not need more modules just because there is empty space.

Whitespace is intentional.


---

6. Moments

Moments is about:

> collecting time, not documenting time.



The calendar is the visual anchor.

It should answer:

> "Was there something here?"



It should NOT attempt to display everything that happened.


---

Calendar traces

There are two visual languages.

Mood traces

Triggered by a selected mood.

Visual language:

leaves

flowers

buds

butterflies

small botanical marks


Mood traces should feel like something that naturally grew in the garden.

Example:

Peaceful  → leaf
Warm      → small flower
Growing   → bud / sprout
Hopeful   → tiny sun / sprout
Missing You → pale butterfly / small blue mark
Quiet     → leaf


---

Life traces

Triggered by:

paper notes

photos

keepsakes

shared notes

other saved moments


Visual language:

paper corners

pencil circles

pressed flowers

film edges

tiny stationery marks


Life traces should feel like something a person physically left on a page.


---

Trace hierarchy

A day may contain:

1 primary trace

1 secondary trace


If a mood exists:

Mood = primary
Life trace = secondary

If no mood exists:

Life trace = primary

A shared note from him can appear as a very subtle secondary mark.

The calendar should never become an icon grid.

> The calendar hints at a memory. The trace section explains it.




---

7. Moments Page Hierarchy

The page should follow this approximate rhythm:

MOMENTS
    ↓
Calendar
    ↓
Selected date + mood
    ↓
Daily traces / notes
    ↓
Paper Notes
    ↓
Monthly archive / statistics

Avoid returning to a large "Day Heading" card.

Date + mood should remain a light typographic line beneath the calendar.

Example:

> August 5 · Growing



No large card is required.


---

8. Memory

Memory should feel different from Moments.

Moments = things that happened.

Memory = things that were kept.

Memory should therefore feel:

quieter

deeper

more archival

slightly more personal


It should not become another timeline.


---

9. Me

Me is not intended to feel like a conventional settings/profile page.

It represents the person inside the garden.

The user's avatar / identity should therefore have a stronger presence here.

Possible sections:

identity

avatar

personal details

appearance

typography

memory settings

relationship-related preferences

application settings


But avoid turning Me into a long administrative settings list.


---

10. Music Room

Music Room should remain easy to discover.

It should NOT be hidden several layers deep inside Me.

Music is part of the atmosphere of the garden, not merely a personal setting.

It can appear as a small entrance on Home and eventually have its own dedicated space.


---

11. Decorative Assets

Decorative PNG/SVG assets are secondary.

The application must not depend on them to establish hierarchy.

Preferred assets:

botanical corners

vines

pressed flowers

tiny leaves

paper textures

seals

handwritten marks

subtle butterflies

stationery fragments


Assets should generally appear at:

corners

section boundaries

edges

empty whitespace

transitions between sections


Avoid placing decorative illustrations directly behind important text.


---

Asset philosophy

Do not make every page equally decorated.

Some pages should breathe.

A quiet page is still part of the visual language.


---

12. Current Development Rule

When modifying an existing page:

First ask:

> Does this change improve hierarchy?



Then:

> Does it improve readability?



Then:

> Does it improve the emotional atmosphere?



Only after these:

> Does it need decoration?




---

Never solve a structural problem with decoration.

If a section looks empty:

DO NOT immediately add:

another card

another illustration

another icon

another statistic


First check:

spacing

hierarchy

typography

grouping

content density



---

13. Implementation Philosophy

The frontend should favor:

simple components

predictable data flow

reusable visual primitives

CSS variables

small SVG placeholders

replaceable image assets


Avoid building complicated decorative systems too early.

Decorative assets should be replaceable without rewriting layout logic.

For example:

Trace component
    ↓
trace type
    ↓
visual asset

The logic should not depend on the exact PNG file.


---

14. Design Tokens

Use centralized variables for:

paper colors

ink colors

botanical colors

borders

spacing

typography

radii

shadows


Example:

:root {
  --paper: ...;
  --paper-soft: ...;
  --ink: ...;
  --ink-muted: ...;

  --sage: ...;
  --rose: ...;
  --lavender: ...;
  --blue: ...;

  --paper-edge: ...;

  --radius-small: ...;
  --radius-medium: ...;
}

Do not hard-code visual values repeatedly across components.


---

15. What NOT To Do

Do not:

redesign the entire application without discussion

introduce large new cards everywhere

add heavy shadows

make every section decorative

turn Moments into a dense calendar

hide important features several layers deep

replace the existing visual language with a generic modern dashboard

add features just because there is empty space

rewrite working components unnecessarily

change the overall style while performing a structural fix



---

16. Current Principle

The current frontend is intentionally simple.

That is not a weakness.

The current goal is:

> Make the interface beautiful even before the garden grows.



The decoration will come later.

First build the paper.

Then let the garden grow on it.