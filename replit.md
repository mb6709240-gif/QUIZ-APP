# QuizFlow

QuizFlow is a browser-only React/Vite college quiz and examination portal. It uses localStorage for users, quizzes, quiz progress, results, settings, and theme preferences; there is no backend or external service.

## Run on Replit

```bash
npm install
npm run dev -- --port 5000
```

The Replit workflow is configured as **Start application** and serves the preview on port 5000.

## Demo accounts

- Student: `student@quiz.com` / `student123`
- Admin: `admin@quiz.com` / `admin123`

On first load, demo users, quizzes, and sample results are seeded only when the corresponding localStorage key is empty. Clearing browser storage resets the demo data.