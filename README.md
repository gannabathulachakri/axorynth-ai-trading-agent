# Axorynth AI Trading Agent

Hackathon MVP dashboard for a simulated AI trading agent. Axorynth combines live crypto market data, technical indicators, structured signal reasoning, risk checks, and a paper-trading panel in a Next.js interface.

## Live Demo

The app is deployed on Vercel:

```text
https://axorynth-ai-trading-agent.vercel.app/
```

## Features

- Live crypto market snapshots from Binance, with CoinGecko and demo-data fallbacks.
- Technical indicator layer with RSI, EMA, MACD, ATR, Bollinger Bands, and VWAP.
- Local rule-based signal engine for deterministic trade decisions.
- Optional OpenAI-powered reasoning text when an API key is available.
- Risk sentinel and simulated execution controls for demo trading workflows.
- Futuristic dashboard UI built with Tailwind CSS, Framer Motion, Recharts, Lightweight Charts, and Lucide icons.

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- OpenAI SDK
- Recharts
- Lightweight Charts
- technicalindicators

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the app at:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file if you want AI-generated reasoning text:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.2
```

`OPENAI_API_KEY` is optional. Without it, the app uses the local signal engine and marks AI responses as fallback output.

`OPENAI_MODEL` is optional and defaults to `gpt-5.2`.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Project Structure

```text
app/                  Next.js app routes, layout, and API endpoints
components/           Dashboard UI components
src/hooks/            Client-side trading intelligence hook
src/lib/              Shared library setup, including OpenAI client config
src/services/         Market data, indicators, signals, risk, and AI analysis
src/types/            Shared TypeScript types
```

## Notes

This project is a demo and does not execute real trades. Market data may fall back to generated demo data when external providers are unavailable.
