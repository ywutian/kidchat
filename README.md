# KidChat

**KidChat** is a kid-friendly, safe, and educational AI chat app with robust parental controls and a beautiful, modern UI.

## Features

- **Chat Interface for Kids**
  - Large, colorful topic bubbles (e.g., Science Fun, Story Time, Math Games, Art Ideas)
  - Age-appropriate AI personality, simple vocabulary, emoji-rich and animated responses
  - Responsive sidebar and chat area, collapsible layout, ChatGPT-like experience
  - Markdown support in chat bubbles for rich text
  - Visually balanced, cute, child-friendly style

- **Content & Interaction**
  - AI adapts complexity based on child’s age (set once by parent)
  - Prompts support variables like `{age}` and `{memory}` (auto-filled)
  - Educational, game-like conversations, creative prompts, positive reinforcement
  - All content filtered for safety, inappropriate content blocked

- **Parental Dashboard**
  - Real-time monitoring, conversation history, usage analytics
  - Time controls, topic/content filters, progress tracking, learning milestones
  - Weekly summary reports, export/clear history, password-protected access

- **Safety & Controls**
  - Child-safe content, no external links/contact sharing
  - Automatic flagging of concerning conversations, emergency contact features (planned)
  - Configurable sensitive words and daily usage limits, enforced in real time

- **Technical Architecture**
  - React functional components, hooks, Context API for state management
  - Tailwind CSS for styling and responsive design
  - All UI and prompts in English, minimal comments, clean codebase

---

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---


## Default Topics & Parent Guides

### Topics (for Kids)
| Emoji | Title         | Description                        |
|-------|---------------|------------------------------------|
| 🐾    | Animals       | Fun facts about animals            |
| 🚀    | Space         | Stories about space and planets    |
| 🔬    | Science Fun   | Cool science facts or experiments  |
| 📚    | Story Time    | Short, inspiring stories           |

### Parent Guides
| Emoji | Title                | Description                                 |
|-------|----------------------|---------------------------------------------|
| 🛡️    | Parent Guidance      | How to guide children safely online         |
| ⏰    | Screen Time Tips     | Managing children’s screen time             |
| 💬    | Encouraging Curiosity| How to encourage kids to ask questions      |
| 🤝    | Positive Reinforcement| Ways to praise and motivate children      |

---

## UI Overview

- **Sidebar:**  
  - Switch between Kid/Parent mode (top left, visually prominent)
  - Tabs: Topics, Parent Guide, History
  - Search, add, edit, favorite, and delete prompts

- **Main Area:**  
  - Chat window with markdown support, emoji, and animated responses
  - Profile prompt for age/gender (shown only if not set)
  - Parental dashboard with history, analytics, and controls

---

## Customization

- You can add/edit/remove topics and parent guides via the sidebar.
- All prompt templates are in `src/hooks/useTopics.js`.

---

## License

MIT
