// Removed incorrect import; no external defineConfig required

export default {
  datasource: {
    // This pulls from your .env file
    url: process.env.DATABASE_URL,
  },
};
