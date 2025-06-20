// Email template for interview result (success/failure)
export function interviewResultEmailTemplate({
  candidateName,
  result,
  notes,
}: {
  candidateName: string;
  result: 'success' | 'failed';
  notes?: string;
}): { text: string; html: string } {
  const isSuccess = result === 'success';
  const text = `Hello ${candidateName},\n\nYour interview result: ${isSuccess ? 'Congratulations! You have passed the interview.' : 'Thank you for your time. Unfortunately, you did not pass the interview.'}${notes ? `\n\nNotes: ${notes}` : ''}\n\nBest regards,\nHiring Platform`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <p>Hello <b>${candidateName}</b>,</p>
      <p>Your interview result:</p>
      <p style="font-size:1.1em; color: ${isSuccess ? '#228B22' : '#B22222'}; font-weight:bold;">
        ${isSuccess ? 'Congratulations! You have passed the interview.' : 'Thank you for your time. Unfortunately, you did not pass the interview.'}
      </p>
      ${notes ? `<p><b>Notes:</b> ${notes}</p>` : ''}
      <p>Best regards,<br/>Hiring Platform</p>
    </div>
  `;
  return { text, html };
}
