import { MAIL_CONFIG } from '../config/email.config';

export const mailgunCred = {
  auth: {
    api_key:
      process.env.NODE_ENV === 'production'
        ? MAIL_CONFIG.production.EMAIL_API
        : MAIL_CONFIG.development.EMAIL_API,
    domain:
      process.env.NODE_ENV === 'production'
        ? MAIL_CONFIG.production.EMAIL_DOMAIN
        : MAIL_CONFIG.development.EMAIL_DOMAIN,
  },
};

export const mailVerifyContent = (
  userEmail: string,
  userName: string,
  mailToken: string,
) => ({
  from: {
    name:
      process.env.NODE_ENV === 'production'
        ? MAIL_CONFIG.production.EMAIL_USER
        : MAIL_CONFIG.development.EMAIL_USER,
    address: 'test-no-reply@mail.test.id',
  },
  to: userEmail,
  subject: 'Test Email Verification',
  html: `
  <html>
    <head>
      <title>Verification Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f1f1f1;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
        }
        h1 {
          font-size: 24px;
          color: #333333;
        }
        p {
          font-size: 16px;
          color: #666666;
        }
        .btn {
          display: inline-block;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          text-decoration: none;
          background-color: #333333;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Halo, ${userName}</h1>
        <p>Selamat bergabung menjadi Future Hero! Sebelum menjelajahi petualangan seru bersama ISE 2024, lengkapi proses pembuatan akun kamu dengan langkah-langkah berikut:</p>
        <br>
        <p>Klik tombol dibawah untuk verifikasi akun :</p>
        <a class="btn" href="BASE${mailToken}"
          >Verifikasi Email</a
        >
        <br>
        <p>Jika tombol tersebut tidak bekerja, kamu dapat verifikasi melalui link ini :</p>
        <a href="BASE${mailToken}">BASE${mailToken}</a>
        <br>
        <p>Setelah verifikasi, proses pembuatan akun kamu telah selesai. Jika terdapat kendala silakan menghubungi atau sosial media.</p>
        <br>
        <p>Salam,</p>
        <br>
        <p>ISE 2024</p>
      </div>
    </body>
  </html>
    `,
});
