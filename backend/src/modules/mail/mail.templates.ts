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

export function notificationEmail(
  name: string,
  title: string,
  body: string | null,
  url: string,
): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1F4E79; font-size: 20px;">Hi ${name},</h2>
      <p style="font-size: 16px; color: #111;">${title}</p>
      ${body ? `<p style="color: #555;">${body}</p>` : ""}
      <p style="margin: 28px 0;">
        <a href="${url}"
           style="background: #2E74B5; color: #fff; padding: 12px 28px;
                  border-radius: 6px; text-decoration: none; display: inline-block;">
          Open in Qadem
        </a>
      </p>
      <p style="color: #888; font-size: 13px;">
        You received this because of activity on your Qadem account.
      </p>
    </div>
  `;
}