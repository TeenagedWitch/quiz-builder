Quiz Builder

A lightweight quiz editor and viewer built with Next.js and Bootstrap. Create quizzes from reusable blocks (heading, question, button, footer), edit properties, save to local storage, and publish to share a read‑only view.

Getting Started

- Prerequisites: Node.js 18+ and npm
- Install deps: `npm install`
- Run dev server: `npm run dev`
- Open app: http://localhost:3000

Available Scripts

- `npm run dev`: Start Next.js dev server (Turbopack)
- `npm run build`: Create production build
- `npm start`: Run production server
- `npm run lint`: Lint the project

Key Concepts

- Blocks: Quizzes are composed of blocks: `heading`, `question`, `button`, `footer`.
- Draft vs Published: Drafts show in the editor; only published quizzes render on the public view page.
- Persistence: Data is stored in `localStorage` under the key `quizbuilder.quizzes` and seeded from `src/constants/quizMock.json` on first run.

Using the App

1. Browse quizzes

- Home: `src/pages/index.tsx` lists quizzes from local storage with Edit and View actions.

2. Create a quiz

- Use the navbar button “Create Quiz” or visit `/quiz/edit` to open a new, unsaved quiz.

3. Edit a quiz

- Editor: `src/components/quiz/QuizEdit.tsx` with three panels:
  - Header: give a name to the quiz.
  - Palette (left): drag blocks into the canvas or click to add.
  - Canvas (center): reorder via drag handle or Up/Down; select, insert above, or delete blocks.
  - Properties (right): edit fields for the selected block.

4. Save and publish

- Save: persists to local storage and updates timestamps.
- Publish/Unpublish: toggles visibility of the quiz on the public page.

5. View a quiz

- Click “View” on the list or visit `/quiz/{id}`. Only published quizzes render; drafts show “Not published yet.”

Block Types

- Heading: single text field.
- Question:
  - Multiple choice: add options and choose single or multiple selection.
  - Free text: switch by clicking “Free text” (clears options) to accept open‑ended input.
- Button: label text; renders a submit‑style button in the viewer.
- Footer: single text field.

Data & Storage

- Storage key: `quizbuilder.quizzes` in `localStorage`.
- Seed data: `src/constants/quizMock.json` loads if storage is empty (first visit).
- Reset data: clear the storage key in your browser devtools to restore seed data on next load.

Project Structure

- Pages: `src/pages` (routes, including `/quiz/edit` and `/quiz/[id]`).
- Editor: `src/components/quiz/editor` (Palette, Canvas, PropertiesPanel).
- Viewer: `src/components/quiz/Quiz.tsx`.
- Types: `src/types/index.ts`.
- Utilities: `src/utility` (local storage, toasts, ID generation).
- Constants: `src/constants` (block palette, seed data, toast variants).

Notes & Limitations

- The viewer renders questions and collects input, but answer scoring/validation is not implemented.
- Free‑text examples in the mock use regex “correct” hints, which are not evaluated in the current viewer.
- All data is local to your browser. There is no backend.

Tech Stack

- Next.js 15, React 19 - selected for simple and optimized routing.
- Bootstrap 5 – selected as a mature, responsive UI framework that speeds up development with prebuilt components, consistent styling, and mobile-first design.
- `@hello-pangea/dnd` - used for smooth, accessible drag-and-drop interactions, offering a flexible and lightweight API for reordering lists or building custom workflows.

[▶️ Watch demo](src/assets/images/demo.mov)

Live demo: https://quiz-builder-pied.vercel.app/
