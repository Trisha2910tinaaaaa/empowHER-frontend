# Women Job Chatbot

A Next.js application designed to help women find tech jobs with a focus on women-friendly workplaces. The application includes a full-stack solution with a modern UI, FastAPI backend, and AI-powered features.

## Features

### Modern Job Search Assistant

- **Interactive Chatbot Interface**: User-friendly conversational interface for job searching
- **Real-time Job Recommendations**: Get job listings tailored to your skills and preferences
- **Women-Friendly Focus**: Special emphasis on companies with inclusive policies
- **Detailed Job Insights**: View comprehensive job details including skills, benefits, and qualifications
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

### Smart Backend

- **AI-Powered Search**: Utilizes LLM models to understand and process job search queries
- **Women-Friendly Detection**: Automatically identifies job listings from women-friendly companies
- **Skill Extraction**: Analyzes job descriptions to extract relevant skills and requirements
- **API-First Design**: Robust backend API built with FastAPI
- **Performance Optimized**: Parallel processing and caching for fast responses

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, Python, LangChain, Groq LLM
- **APIs**: Diffbot for job data extraction, Tavily for search
- **Deployment**: Vercel (frontend), optional Docker for backend

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- API keys for:
  - Groq (LLM)
  - Tavily (Search)
  - Diffbot (Web scraping)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/women-job-chatbot.git
cd women-job-chatbot
```

2. Install frontend dependencies:

```bash
npm install
# or
yarn install
```

3. Set up the backend:

```bash
cd backend
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory with your API keys:

```
GROQ_API_KEY=your-groq-api-key
TAVILY_API_KEY=your-tavily-api-key
DIFFBOT_API_KEY=your-diffbot-api-key
```

5. Start the backend server:

```bash
cd backend
uvicorn main:app --reload
```

6. Start the frontend development server:

```bash
# In the root directory
npm run dev
# or
yarn dev
```

7. Visit `http://localhost:3000` to see the application running.

## Usage

1. Navigate to the Career Assistant page
2. Type your job search query in the chatbot
3. View recommended jobs based on your query
4. Click on jobs to see detailed information
5. Use suggestion chips for common searches
6. Apply to jobs directly through provided links

## Environment Variables

This project requires certain environment variables to be set for proper functionality:

### Stripe Integration

For payment processing with Stripe, you need to set up the following environment variables:

1. Create a `.env` file in the root directory of the project
2. Add the following variables:

```
STRIPE_SECRET_KEY=sk_test_your_test_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

Note:

- Use test keys for development environments
- Use production keys for production environments
- Never commit your `.env` file to version control
- Never hardcode API keys directly in your source code

You can get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).

### Frontend (Next.js)

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BACKEND_API_URL=https://empowher-i03j.onrender.com
```

### Backend (FastAPI)

```
GROQ_API_KEY=your-groq-api-key
TAVILY_API_KEY=your-tavily-api-key
DIFFBOT_API_KEY=your-diffbot-api-key
```

## Project Structure

```
women-job-chatbot/
├── app/                  # Next.js app directory
│   ├── (main)/           # Main layout routes
│   │   ├── chatbot/      # Chatbot page
│   │   └── job/          # Job details page
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   ├── job-chatbot.tsx   # Chatbot component
│   └── ui/               # UI components
├── backend/              # FastAPI backend
│   ├── main.py           # Main API code
│   └── requirements.txt  # Python dependencies
├── public/               # Static files
└── package.json          # Project dependencies
```

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [LangChain](https://langchain.com/)
- [Groq](https://groq.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
