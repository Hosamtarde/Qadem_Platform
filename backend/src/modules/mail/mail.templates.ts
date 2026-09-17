export function verificationEmail(name: string, link: string): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1F4E79;">Welcome, ${name}</h2>
      <p>Thanks for signing up to Qadem. Click the button below to verify your account:</p>
      <p style="margin: 28px 0;">
        <a href="${link}"
           style="background: #2E74B5; color: #fff; padding: 12px 28px;
                  border-radius: 6px; text-decoration: none; display: inline-block;">
          Verify account
        </a>
      </p>
      <p style="color: #666; font-size: 13px;">
        This link expires in 2 hours. If you didn't sign up to Qadem, ignore this email.
      </p>
    </div>
  `;
}