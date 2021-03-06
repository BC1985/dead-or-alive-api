module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DATABASE_URL,
  TEST_DB_URL: "postgresql://postgres@localhost/dead-or-alive-test-db",
  LOCAL_URL: "postgresql://postgres@localhost/dead-or-alive"
};
