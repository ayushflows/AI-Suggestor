# AIProductiv: Your Intelligent Productivity Partner

**Elevate Your Focus. Conquer Your Day, Intelligently.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--suggestor.vercel.app-blue?style=for-the-badge&logo=vercel)](https://ai-suggestor.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repo-green?style=for-the-badge&logo=github)](https://github.com/ayushflows/AI-Suggestor.git)

---

AIProductiv is your personalized command center for peak performance. It's designed to help you seamlessly switch between different work/life modes, get smart, actionable suggestions, and unlock your true potential with AI-driven insights. Stop just managing tasks, start mastering your flow!

## Key Features

*   **🧠 Dynamic Modes:** Instantly switch your digital environment for **Gaming, Deep Work, or Study**. Each mode comes with tailored suggestions.
*   **✨ AI-Powered Insights:** Leverage AI to understand your needs based on your current mode, mood (Happy, Stressed, Tired, Energetic), and time of day. Get smart reminders and motivational nudges.
*   **🚀 Actionable Suggestions:** Not just *what* to do, but *how*. Receive 2-3 concrete suggestions including:
    *   Direct links to relevant apps, websites, or articles.
    *   Pre-filled search queries for YouTube videos or Spotify playlists.
    *   Inspiring quotes or practical advice.
*   **💬 Personalized Chat Interface:** Engage with the AI through an intuitive chat, receiving rich responses with embedded media (YouTube videos) and styled links.
*   **🔐 Secure Authentication:** Sign in with Google or traditional email/password, powered by NextAuth.js.
*   **💾 Persistent Chat History:** Your conversations and AI suggestions are saved to your account.
*   **🎨 Modern & Focused UI:** Built with Next.js, Tailwind CSS, and Lucide Icons, designed for focus and flow with a sleek dark theme.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **Database:** [MongoDB](https://www.mongodb.com/) (with MongoDB Adapter for NextAuth)
*   **AI:** [OpenAI API](https://openai.com/api/) (gpt-3.5-turbo)
*   **UI Components:** [Lucide React](https://lucide.dev/) (Icons), [React Markdown](https://github.com/remarkjs/react-markdown), [React Player](https://github.com/CookPete/react-player)
*   **Deployment:** [Vercel](https://vercel.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

*   **Node.js:** Version 18.x or later (LTS recommended). [Download Node.js](https://nodejs.org/)
*   **npm, yarn, or pnpm:** Package manager.
*   **MongoDB:** A running MongoDB instance (local or cloud-hosted, e.g., MongoDB Atlas free tier).
*   **API Keys:**
    *   Google OAuth Client ID & Secret (from Google Cloud Console)
    *   OpenAI API Key

### Environment Variables Setup

1.  Create a `.env.local` file in the root of your project.
2.  Add the following environment variables, replacing the placeholder values with your actual credentials:

    ```env
    # MongoDB
    MONGODB_URI=your_mongodb_connection_string
    DB_NAME=your_database_name # e.g., ai_productiv

    # NextAuth.js
    NEXTAUTH_URL=http://localhost:3000 # For development. Change for production.
    NEXTAUTH_SECRET=generate_a_strong_secret_key # A random string for signing tokens
    
    # Google OAuth Provider (Ensure these are for a client configured with http://localhost:3000/api/auth/callback/google as a redirect URI for dev)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # OpenAI API Key
    OPENAI_API_KEY=your_openai_api_key
    ```
    *   **`NEXTAUTH_SECRET`:** You can generate a strong secret using `openssl rand -base64 32` in your terminal.
    *   **`MONGODB_URI`:** Make sure to include your database name in the connection string if your driver/MongoDB version requires it, or use `DB_NAME` if your `lib/mongodb.ts` is set up to use it.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ayushflows/AI-Suggestor.git
    cd AI-Suggestor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```
    *Note: If you encounter peer dependency issues (e.g., with `mongodb` and `@next-auth/mongodb-adapter`), ensure you have a compatible version of `mongodb` (e.g., `^5.9.2`) installed, as per recent project history.* 

### Running the Development Server

```bash
npm run dev
# or
# yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
```
This will create an optimized production build in the `.next` folder.

## Usage / How It Works

1.  **Sign Up / Login:** Create an account using your Google account or email/password.
2.  **Chat Interface:** You'll be directed to the main chat page.
3.  **Set Your Context:**
    *   **Select Mode:** Choose between "Work", "Study", or "Gaming".
    *   **Select Mood:** Indicate your current mood ("Happy", "Stressed", "Tired", "Energetic").
    *   The **Time of Day** is automatically detected.
    *   Optionally, type an **additional message** or question for the AI.
4.  **Get Suggestions:** Click "Get AI Suggestions".
5.  **Receive AI Response:** The AI will provide 2-3 actionable suggestions tailored to your input, including resource links, tasks, and motivational tips. Responses are formatted in Markdown and can include playable YouTube videos.
6.  **Interact:** Continue the conversation, refine your context, or try new scenarios.

## Project Structure (Overview)

```
AI-Suggestor/
├── app/                    # Next.js App Router directory
│   ├── api/                # API routes (auth, chat)
│   ├── chat/               # Main chat page UI components (page.tsx, ChatHistory, ChatInput, Header)
│   ├── (auth)/             # Authentication pages (login, register - route groups)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing/Home page
├── lib/                    # Core logic, services, utilities
│   ├── authOptions.ts      # NextAuth.js configuration
│   ├── mongodb.ts          # MongoDB client connection
│   └── openaiService.ts    # OpenAI API interaction logic
├── public/                 # Static assets
├── components/             # Shared UI components (if any beyond route-specific)
├── .env.local.example      # Example environment variables (add your actual .env.local)
├── next.config.mjs         # Next.js configuration
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! If you have ideas for improvements or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourAmazingFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some YourAmazingFeature'`).
5.  Push to the branch (`git push origin feature/YourAmazingFeature`).
6.  Open a PullRequest.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (if you choose to add one).

---

*Built with Next.js, Tailwind CSS, and Lucide Icons. Designed for focus & flow.*
