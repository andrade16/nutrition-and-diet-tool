# Nutrition & Diet Tool

A nutrition lookup and diet recommendation app built for two distinct user roles — **consumers** looking up food facts and **dietitians** advising clients.

---

## Setup

### Prerequisites

- Node.js 18+
- An Anthropic API key (for the AI chat feature)
- A USDA FoodData Central API key (free at https://fdc.nal.usda.gov/api-guide.html)

### Installation

```bash
git clone https://github.com/andrade16/nutrition-and-diet-tool.git
cd nutrition-and-diet-tool
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
USDA_API_KEY=your_usda_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Run

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm test         # run test suite
```

---

## Approach and Key Design Decisions

### Tech Stack

| Layer     | Choice                        | Rationale                                                                                   |
| --------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router)       | Server components enable fast, SSR-driven search without client-side data fetching overhead |
| Language  | TypeScript                    | End-to-end type safety across API responses, Redux state, and component props               |
| State     | Redux Toolkit + redux-persist | Structured global state with zero-config persistence to localStorage across sessions        |
| Styling   | CSS Modules                   | Component-scoped styles with zero runtime cost; pairs well with the App Router              |
| Testing   | Jest + React Testing Library  | Industry standard; `next/jest` handles transforms automatically                             |

### Architecture

**Route layout.** The app uses Next.js App Router with a `(main)` route group (`src/app/(main)/`) that wraps `/search`, `/food/[fdcId]`, `/favorites`, and `/chat` in a shared layout that mounts the `Navbar`. The root layout (`src/app/layout.tsx`) sits above it and is responsible only for global styles, fonts, and the Redux `StoreProvider`. This two-level layout structure keeps the navbar scoped to app pages without it appearing on the root landing page.

**Server / client component split.** The rendering boundary is drawn per route based on what each page needs:

| Route           | Strategy         | Reason                                                                                   |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `/search`       | Server component | USDA search call runs on the server; HTML arrives pre-rendered with no client-side fetch |
| `/food/[fdcId]` | Server component | Food detail fetched by `fdcId` on the server; no loading state on the client             |
| `/favorites`    | Client component | Reads Redux state (localStorage-backed); no server data needed                           |
| `/chat`         | Client component | Manages streaming state, user input, and Redux dispatch in real time                     |

Within server-rendered pages, interactive islands (`SearchBar`, `FavoriteButton`, `IngredientPill`) are extracted into `"use client"` components so the page can remain a server component while still handling click events and Redux dispatch.

**API key isolation.** Neither the USDA API key nor the Anthropic API key is ever sent to the browser. The USDA key is appended server-side inside `src/lib/usda-api.ts`, which is only ever called from server components. The Anthropic key is read inside the `/api/chat` Next.js Route Handler (`src/app/api/chat/route.ts`), which proxies chat requests from the client — the browser only ever calls `/api/chat`, never Anthropic directly. This ensures both secrets stay server-side even though the chat UI is a client component.

**Data fetching and caching.** USDA responses use Next.js's `fetch` cache via the `next: { revalidate }` option rather than an external cache layer. Search results are cached for 5 minutes (`revalidate: 300`) since they change infrequently within a session. Individual food records are cached for 1 hour (`revalidate: 3600`) since USDA food data rarely changes. This provides a lightweight, zero-config caching layer without Redis or a CDN.

**Redux store design.** The store is composed of four slices, each in its own subdirectory with a colocated test file:

| Slice       | Persisted   | Contents                                                       |
| ----------- | ----------- | -------------------------------------------------------------- |
| `user`      | `role` only | Active role: `"consumer"` or `"dietitian"`                     |
| `favorites` | Fully       | Favorited foods (with notes) and favorited ingredients         |
| `chat`      | Fully       | Full conversation message history                              |
| `search`    | Fully       | Last search query (used to restore results on back-navigation) |

`redux-persist` wraps each slice individually with its own `persistConfig`, giving per-slice control over what is stored. The `user` slice uses a `whitelist: ["role"]` to persist only the role value, not any future transient user state that might be added.

**Streaming chat response.** The `/api/chat` route streams the Anthropic response using the SDK's `.stream()` method. `streamChatResponse` in `src/lib/chat-api.ts` reads chunks and calls an `onChunk` callback with the accumulated text on each tick. The in-progress exchange lives in local component state (`streamingUser`, `streamingAssistant`) and is only committed to Redux — and therefore persisted — after the stream closes cleanly. A failed or interrupted request discards the local state without writing anything to the store, so the persisted history is never polluted by partial responses.

### Product Decisions

**Two user roles.** A role toggle in the navbar switches between Consumer and Dietitian views. Rather than building two separate apps, the role is a single Redux value that gates features throughout:

- **Consumer view:** Clean macro cards (Calories, Protein, Carbs, Fat) plus a secondary stats row (Fiber, Sugar, Sodium, Sat. Fat) — digestible at a glance.

- **Dietitian view:** Full nutrient table showing every data point returned by the USDA API, plus a macro donut chart for visual macro composition breakdown.

**Search page.** The `/search` experience is intentionally frictionless — users land on a page with a prominent search bar and can immediately start typing. Results render below as a natural-scrolling list, which keeps the browser's native scroll behavior intact and makes pagination feel less jarring. The `SearchBar` is a client component that pushes the query and page number into the URL as query params, so results are bookmarkable and the back button works as expected. A result count sits above the list while pagination exists below the list. When no results are found, a contextual empty state guides the user back to searching rather than showing a blank page. On submit, `SearchBar` also writes the query to a short-lived `lastSearchQuery` cookie; the server component reads this cookie when the page is loaded without a `?query=` param (e.g. navigating back via the navbar), so results are pre-fetched server-side and appear immediately without requiring the user to re-submit.

**Food detail page.** Clicking any search result or favorited food opens a detail page to `/food/<fdcId>` that is also server-rendered — the food data is fetched by `fdcId` on the server, so there is no client-side loading state. The page is structured into three distinct sections: serving size (household description and gram weight when available), ingredients (parsed from the USDA comma-separated string, deduplicated, and rendered as interactive pills), and nutrition facts (rendered differently based on role). A favorite button in the header lets users save or unsave the food without leaving the page.

- **Food favoriting.** Food items on the search and food detail pages are rendered via a reusable component called `FoodListItem`, where each food item has a star icon. Tapping the star saves that individual food to a separate `favoritedFoods` list in Redux.

- **Ingredients favoriting.** Ingredients on the food detail page are extracted by splitting the USDA ingredient string on commas, deduplicating, and title-casing each entry. Each ingredient renders as a pill with a small star icon. Tapping the star saves that individual ingredient to a separate `favoritedIngredients` list in Redux — independent from the food-level favorites. This lets users track specific compounds (e.g., "High Fructose Corn Syrup", "Sodium Benzoate") across many foods without needing to favorite the entire product.

**Favorites page.** The `/favorites` page is split into two tabs — Foods and Ingredients — since they serve different purposes and mixing them would create noise. The Foods tab groups saved items by their USDA food category, making it easy to scan a large list at a glance. Each tab has a "Clear all" button that only appears when the tab has items, keeping the UI uncluttered when empty. Both tabs show contextual empty states with a call-to-action when nothing has been saved yet. For dietitians, each food entry in the Foods tab also renders an inline note input directly beneath the food card — allowing per-food annotations without navigating away.

- **Dietitian notes.** Each favorited food on the dietitian view has an inline note input. The Save button only appears when the text differs from the stored value, preventing unnecessary dispatches. Notes persist via redux-persist alongside the favorited food. This was added to further enhance the dietitian experience by allowing them to add notes for foods (maybe a note referring to a client?).

- **NoteInput state design.** The dietitian notes component reads `savedNote` directly from Redux via `useSelector` on every render rather than receiving it as a prop. This eliminated a subtle bug where the local `useState` would initialize with a stale prop value after tab switches, making the Save button always visible. Reading from the store directly ensures the component always reflects truth.

**Chat page.** The `/chat` page provides a full-screen conversational interface powered by Claude. When no conversation exists, the page shows an empty state with four pre-written suggestion chips covering common nutrition questions — giving users an immediate starting point without needing to know what to ask. Once a conversation starts, messages are displayed in a scrolling list that automatically anchors to the bottom as new content arrives. User messages and assistant responses are visually differentiated, and assistant responses are rendered as Markdown so lists, bold text, and structured meal plans display cleanly. A fixed input bar at the bottom of the screen contains a textarea that auto-resizes as the user types, a send button, and a "new chat" button (↺) that only appears once a conversation has started. Chat history is persisted via redux-persist so conversations survive page refreshes.

- **AI chat with context injection.** The Claude-powered chat assistant on the `/chat` page is seeded with the user's role and their current list of favorited foods. This means the model can give personalized responses without the user needing to manually describe their diet.

- **Streaming responses.** The chat API uses a streaming endpoint (`ReadableStream`) so the assistant's response renders word-by-word rather than appearing all at once after a delay. The in-progress exchange is held in local state and only committed to Redux (and therefore persisted) once the stream completes cleanly — a failed request doesn't pollute the chat history.

### Testing Strategy

Tests are colocated with the files they cover (e.g., `favoritesSlice.test.ts` lives next to `favoritesSlice.ts`). Three test suites cover:

- **`favoritesSlice`** — pure reducer unit tests for every action (add, remove, clear, updateNote, ingredient management). No DOM, no mocks, just function calls.
- **`NoteInput`** — integration tests verifying the Save button visibility logic and that clicking Save dispatches the correct Redux action with a trimmed value.
- **`EmptyState`** — render tests covering each conditional prop (title, subtitle, icon, action link — present and absent).

A `renderWithStore` test utility wraps components in a Redux `Provider` using a plain `configureStore` (no `redux-persist`) so tests run fast and without localStorage side effects.

Server components and the USDA API layer were deliberately excluded from the test suite — the cost of mocking Next.js internals and external fetch calls outweighs the value for an assignment of this scope.

---

## What I'd Improve with More Time

**Skeleton loading states.** The search page currently shows nothing while the server renders. Adding skeleton placeholders would improve perceived performance.

**Richer search.** Searching through the full USDA database, not just the "Branded" food category, would make results much more actionable.

**Accessibility.** ARIA labels, keyboard navigation for the favorites page, and focus management after search submission are all missing.

**Better mobile experience.** The web app is responsive for mobile viewports, but there are some components that can be built out to present the user with a better mobile experience.

**Test coverage.** The slice test suite is thorough but component coverage is shallow. Adding more tests to increase coverage and also address the chat streaming logic would meaningfully increase confidence.

**Backend persistence.** `redux-persist` to localStorage works for a single-device demo but doesn't survive clearing browser data or switching devices. A lightweight backend (even a simple Postgres table) would make favorites and notes genuinely persistent.

**Error boundaries.** The USDA API occasionally returns 500s or malformed data. Wrapping key pages in React error boundaries would prevent the full page from breaking on a bad response.

## How AI Was Used

Claude Code was used as a collaborator for parts of the build of this project — not just for code generation, but also for debugging and iterative refinement on personally written code.

**Feature implementation.** The base project creation and base styling for this project was done by prompting Claude. I didn't want to spend too much time working on establishing certain styling concepts like theme colors, layouts, and animations. Additionally, an outline was provided and then followed on how to integrate Claude for the `/chat` page. Lastly, Claude was used to refactor personally written code when things looked like they could have been optimized.

**Debugging.** Several real bugs were diagnosed through conversations with Claude. For example, an issue where `dispatch` was not firing in `NoteInput` looked like a Redux wiring issue but turned out to be a stale Next.js hot-reload cache — Claude helped rule out the obvious causes before arriving at "try restarting the dev server."

**Code organization.** When I reorganized the Redux slices from flat files into subdirectories (`slices/favorites/`, `slices/chat/`, etc.), Claude scanned the entire codebase for broken import paths and updated them all — including a non-obvious one inside `chatSlice.ts` itself where the `RootState` import needed an extra `../` level.

**Testing setup.** The Jest + React Testing Library configuration was set up collaboratively: choosing `jest.config.js` over `.ts` to avoid a `ts-node` dependency in Jest 30, writing a `renderWithStore` utility that avoids `redux-persist` side effects in tests, and structuring three test suites (pure reducer unit tests, component integration tests, and render tests) at different levels of the stack.

**Project cleanup.** Before finalizing, Claude did a full sweep of the codebase to remove dead CSS, leftover `console.log` calls, unused imports.

**Documentation.** Claude also helped with generating documentation for this project, prompting it to establish the major writing sections in markdown format.
