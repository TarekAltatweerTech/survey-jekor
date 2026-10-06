import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone site (deployed on Vercel). Its only link to Laravel is the API address,
// given at build time in VITE_SURVEY_API_URL.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // A build without the API address would deploy a page that can never load the
  // survey: stop the build instead of shipping it.
  if (command === 'build' && !env.VITE_SURVEY_API_URL) {
    throw new Error(
      'VITE_SURVEY_API_URL is missing. Set it to the survey API, e.g. ' +
        'https://api.example.com/api/v4/survey (Vercel: Project → Settings → Environment Variables).',
    );
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      // `npm run dev`: /api/* is forwarded to the local Laravel (Laragon) host.
      proxy: env.VITE_PROXY_TARGET
        ? { '/api': { target: env.VITE_PROXY_TARGET, changeOrigin: true } }
        : undefined,
    },
  };
});
