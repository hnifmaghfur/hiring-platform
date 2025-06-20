export function interviewNotificationEmailTemplate({
  candidateName,
  date,
  time,
  link,
}: {
  candidateName: string;
  date: string;
  time: string;
  link?: string;
}): { text: string; html: string } {
  const text = `Hello ${candidateName},
\nYour application has been approved for an interview.\n\nDate: ${date}\nTime: ${time}\n${link ? `Link: ${link}\n` : ''}\n\nBest regards,\nHiring Platform`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <p>Hello <b>${candidateName}</b>,</p>
      <p>Your application has been <b>approved for an interview</b>.</p>
      <ul style="list-style:none; padding:0;">
        <li><b>Date:</b> ${date}</li>
        <li><b>Time:</b> ${time}</li>
        ${link ? `<li><b>Link:</b> ${link}</li>` : ''}
      </ul>
      <p>Best regards,<br/>Hiring Platform</p>
    </div>
  `;
  return { text, html };
}
