import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.EMAIL_FROM    || 'onboarding@resend.dev';
const FRONT  = process.env.FRONTEND_URL  || 'http://localhost:4200';

class EmailService {
  /**
   * Send a verification email with a one-click confirmation link.
   * @param {string} toEmail   - recipient address
   * @param {string} fullName  - recipient's display name
   * @param {string} rawToken  - the un-hashed token (goes in the URL)
   */
  async sendVerificationEmail(toEmail, fullName, rawToken) {
    const verifyUrl = `${FRONT}/verify-email?token=${rawToken}`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verifica tu correo — Escolatour</title>
</head>
<body style="margin:0;padding:0;background:#eff5f3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff5f3;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(23,42,38,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2b8b79,#41c2aa);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:1.8rem;letter-spacing:-0.02em;">Escolatour</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:0.95rem;">Explora el mundo, aprende sin fronteras</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-size:1.05rem;color:#172a26;font-weight:600;">Hola, ${fullName} 👋</p>
            <p style="margin:0 0 24px;font-size:0.95rem;color:#52756e;line-height:1.6;">
              Gracias por registrarte en Escolatour. Para activar tu cuenta y empezar a explorar destinos educativos, confirma tu correo electrónico haciendo clic en el botón de abajo.
            </p>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:8px 0 32px;">
                <a href="${verifyUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#2b8b79,#41c2aa);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:1rem;font-weight:700;letter-spacing:0.01em;box-shadow:0 4px 14px rgba(65,194,170,0.35);">
                  Verificar mi correo
                </a>
              </td></tr>
            </table>

            <p style="margin:0 0 8px;font-size:0.85rem;color:#52756e;line-height:1.5;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            <p style="margin:0 0 24px;word-break:break-all;">
              <a href="${verifyUrl}" style="color:#41c2aa;font-size:0.8rem;">${verifyUrl}</a>
            </p>

            <hr style="border:none;border-top:1px solid #dcece8;margin:0 0 24px;" />

            <p style="margin:0;font-size:0.8rem;color:#a0b8b3;line-height:1.5;">
              Este enlace expira en <strong>24 horas</strong>. Si no creaste esta cuenta, puedes ignorar este correo con seguridad.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0f5f3;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:0.75rem;color:#a0b8b3;">© ${new Date().getFullYear()} Escolatour. Todos los derechos reservados.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to:   toEmail,
      subject: 'Verifica tu correo — Escolatour',
      html,
    });

    if (error) {
      console.error('[EmailService] Resend error:', error);
      throw new Error('No se pudo enviar el correo de verificación.');
    }
  }
}

export const emailService = new EmailService();
