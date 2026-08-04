require('dotenv').config();

const express      = require('express');
const helmet       = require("helmet");
const cors         = require('cors');
const morgan       = require('morgan');
const errorHandler = require('./middleware/Errorhandler.js');
const { requireAuth } = require('./middleware/auth');
const sanitize     = require("./middleware/sanitize");

// ── Route modules ─────────────────────────────────────────────────────────────
const authRouter    = require('./routes/auth');
console.log('AUTH ROUTER IMPORTED');

const booksRouter   = require('./routes/books');
const membersRouter = require('./routes/members');
const loansRouter   = require('./routes/loans');
const authorsRouter = require('./routes/authors');
const finesRouter   = require('./routes/fines');
const statsRouter   = require('./routes/stats');
const profileRouter = require("./routes/profile");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(sanitize);
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health check (public) ───────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database Test Route
const db = require('./config/db');
console.log("DB TEST ROUTE LOADED");
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS server_time');

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ── Auth routes (login/register are public; sub-routes guard themselves) ──────
app.use('/api/auth', authRouter);

// ── Everything below requires a valid JWT ──────────────────────────────────────
app.use('/api/books',   requireAuth, booksRouter);
app.use('/api/members', requireAuth, membersRouter);
app.use('/api/loans',   requireAuth, loansRouter);
app.use('/api/authors', requireAuth, authorsRouter);
app.use("/api/fines", requireAuth, finesRouter);
app.use('/api/stats',   requireAuth, statsRouter);
app.use("/api/profile", profileRouter);

// ── 404 catcher ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Central error handler (must be LAST) ─────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n📚 Library Tracker API running on http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
});


