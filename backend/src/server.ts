import app from './app.js';
import { connectDB } from './config/db.js';
import { initBrowser, browserInstance } from './utils/pdfGenerator.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Parallel initialization for speed
    await Promise.all([
      connectDB(),
      initBrowser()
    ]);
    
    const server = app.listen(PORT, () => {
      console.log(`🌐 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Stopping server...');
      server.close(async () => {
        console.log('HTTP server closed.');
        if (browserInstance) {
          await browserInstance.close();
          console.log('Puppeteer browser closed.');
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
