// Published 2026-09-14 in n8n's existing "Build Report1" Code node, Run Once for All Items.
// Reads existing upstream Airtable results; never sends email here.
function recordsFrom(...names) {
  for (const name of names) {
    let items;
    try {
      items = $items(name);
    } catch {
      continue;
    }
    // Airtable Always Output Data may supply a placeholder {} on empty results.
    return items.filter((item) => typeof item.json?.id === 'string');
  }
  throw new Error(`Required report input missing or unexecuted: ${names.join(' / ')}`);
}

const initialSent = recordsFrom('Initial Emails Sent Today1', 'Initial Emails Sent Today').length;
const fu1Sent = recordsFrom('FU1 Sent Today1', 'FU1 Sent Today').length;
const fu2Sent = recordsFrom('FU2 Sent Today1', 'FU2 Sent Today').length;
const totalReplies = recordsFrom('Total Replies1', 'Total Replies').length;
const emailFoundPending = recordsFrom('Email Found Pending1', 'Email Found Pending').length;
const totalEmailsToday = initialSent + fu1Sent + fu2Sent;
const today = new Date().toLocaleDateString('en-AU', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Australia/Sydney',
});

const report = `NovaMerch Daily Report -- ${today}

EMAILS RECORDED SENT TODAY: ${totalEmailsToday}
  Initial emails: ${initialSent}
  Follow-up 1: ${fu1Sent}
  Follow-up 2: ${fu2Sent}

PIPELINE
  Replies/interested recorded in CRM (total): ${totalReplies}
  Email found, awaiting review: ${emailFoundPending}

${emailFoundPending > 0
  ? `ACTION: Review the ${emailFoundPending} Email Found leads. These leads are NOT scheduled to send. Only eligible, approved Ready to Email leads are selected by the weekday sender.`
  : 'No Email Found leads awaiting review were returned by the report query.'}

${totalEmailsToday === 0
  ? 'CHECK: No sends were recorded today. Check the approved queue and sender executions; zero sends alone does not establish the cause.'
  : 'Counts are based on Airtable send-date records, not confirmed delivery.'}

Not measured by this report: approved queue size, lead-discovery health, delivery, bounces, or inbox replies not yet recorded in the CRM.`;

return [{ json: { report, totalEmailsToday, initialSent, fu1Sent, fu2Sent, totalReplies, emailFoundPending } }];
