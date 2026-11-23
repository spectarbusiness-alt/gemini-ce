# Gemini (CE)

<img width="1408" alt="SCR-20240703-kgws" src="https://github.com/nyintosh/gemini-ce/assets/56629705/3ab37579-eb23-448d-b0b6-314233917463">

## Description

A simplified clone of Google Gemini, created with React, Tailwind CSS, TypeScript, and Vite. It aims to replicate the core features of Google Gemini in a straightforward manner.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Starting the Development Server](#starting-the-development-server)
- [Contributing](#contributing)
- [Live Preview](#live-preview)

## Tech Stack

- React
- Tailwind CSS
- TypeScript
- Vite

## Installation

Make sure you have Node.js installed on your machine.

Clone the repository:

```bash
git clone https://github.com/nyintosh/gemini-ce.git
```

Navigate to the project directory:

```bash
cd gemini-ce
```

Install dependencies:
Run one of the following commands based on your preferred package manager:

- Using npm:

```bash
npm install
```

- Using yarn:

```bash
yarn install
```

- Using pnpm:

```bash
pnpm install
```

## Environment Variables

For local development, add your key to `.env.local` in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

The key is read by the server and is not exposed to the browser. Restart the dev server after adding or changing the key. For a Vercel deployment, set `OPENROUTER_API_KEY` in the project's environment variables. The app uses the `google/gemini-2.5-flash` model through OpenRouter.

## Starting the Development Server

To start the development server:
Run one of the following commands based on your preferred package manager:

- Using npm:

```bash
npm run dev
```

- Using yarn:

```bash
yarn dev
```

- Using pnpm:

```bash
pnpm dev
```

Open your browser and navigate to http://localhost:5173 to see the app live.

## Contributing

If you want to add additional features and improvements, we welcome contributions! Please follow these guidelines:

- Fork the repository
- Create a new branch
- Make your changes
- Submit a pull request

## Live Preview

You can preview the live version of the project at [https://gemini-ce.vercel.app](https://gemini-ce.vercel.app).

## Starter GitHub Repo for React

The starter GitHub repository used for this project [React Starter](https://github.com/nyintosh/react-starter).
