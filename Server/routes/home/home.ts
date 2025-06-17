import { Request, Response, Router } from "express";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Backend is Live</title>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;500;700&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Josefin Sans', sans-serif;
          block-size: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          background-size: 400% 400%;
          animation: gradientShift 10s ease infinite;
          color: #fff;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .container {
          text-align: center;
          position: relative;
        }

        .title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .candle {
          position: relative;
          width: 20px;
          height: 60px;
          margin: 0 auto;
          background: #eee;
          border-radius: 5px;
        }

        .flame {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 25px;
          background: radial-gradient(circle at 50% 30%, #ffecb3 0%, #ff9800 60%, transparent 100%);
          border-radius: 50% 50% 50% 50%;
          animation: flicker 1s infinite ease-in-out alternate;
          opacity: 0.8;
        }

        @keyframes flicker {
          0% { transform: translateX(-50%) scale(1); opacity: 0.8; }
          100% { transform: translateX(-50%) scale(1.1); opacity: 1; }
        }

        .status {
          margin-top: 15px;
          font-size: 1.2rem;
          font-weight: 300;
        }

      </style>
    </head>
    <body>
      <div class="container">
       <div class="candle">
          <div class="flame"></div>
        </div>
        <div class="title">🔥 Backend is Live</div>
        <div class="status">Running Smoothly with Style</div>
      </div>
    </body>
    </html>
  `);
});

export default router;
