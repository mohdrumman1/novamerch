import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/d1";
import { verifyOrderLinkToken } from "@/lib/signed-links";

type FeedbackPayload = {
  overallRating?: unknown;
  communicationRating?: unknown;
  productQualityRating?: unknown;
  resolutionRating?: unknown;
  whatWentWell?: unknown;
  whatWeCanImprove?: unknown;
  futureBusiness?: unknown;
  permissionToContact?: unknown;
};

function rating(value: unknown, required = true) {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 5) return parsed;
  return required ? null : undefined;
}

async function feedbackToken(tokenValue: string) {
  return verifyOrderLinkToken(tokenValue, "feedback", process.env.ORDER_LINK_SECRET ?? "");
}

function feedbackFormHtml(orderRef: string) {
  const recipientName = orderRef === "#O1001" ? "Siennah" : "there";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NovaMerch feedback</title><style>body{margin:0;background:#eeecea;color:#111;font:15px system-ui,-apple-system,sans-serif;line-height:1.5}.card{max-width:680px;margin:40px auto;background:#fff;border:1px solid #e5e3de;border-radius:16px;padding:32px;box-shadow:0 2px 10px #0000000d}h1{font-size:28px;line-height:1.15;margin:8px 0 12px}.eyebrow{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#777}p{color:#666}fieldset{border:0;padding:0;margin:28px 0}legend,label{font-weight:650;display:block}.help{font-weight:400;font-size:14px;margin:4px 0 12px}.ratings{display:flex;gap:8px}.ratings button,.choice button{border:1px solid #ccc;background:#fff;border-radius:999px;padding:10px 15px;font-weight:650;cursor:pointer}.ratings button{height:40px;width:40px;padding:0}.ratings button.selected,.choice button.selected{background:#c8f135;border-color:#c8f135}textarea{box-sizing:border-box;width:100%;min-height:105px;margin-top:8px;border:1px solid #ccc;border-radius:8px;padding:12px;font:inherit}.check{display:flex;gap:10px;font-weight:400;color:#555}.submit{width:100%;border:0;border-radius:8px;background:#c8f135;padding:13px;font-size:15px;font-weight:700;cursor:pointer}.error{display:none;background:#fff0ef;color:#c22;padding:10px;border-radius:8px;margin-top:16px}.thankyou{display:none;text-align:center;padding:48px 0}.note{font-size:12px;text-align:center;margin-top:14px}</style></head><body><main class="card"><section id="form"><p class="eyebrow">NovaMerch customer feedback</p><h1>Hi ${recipientName}, we would value your honest feedback.</h1><p>This takes about two minutes. Your feedback helps the NovaMerch team understand what worked well for you and where we need to improve.</p><form id="feedback"><input type="hidden" name="orderRef" value="${orderRef}"><fieldset data-rating="overallRating"><legend>Overall experience *</legend><p class="help">Thinking about your experience with NovaMerch overall.</p><div class="ratings"></div></fieldset><fieldset data-rating="communicationRating"><legend>Communication *</legend><p class="help">Clarity, responsiveness and keeping you informed.</p><div class="ratings"></div></fieldset><fieldset data-rating="productQualityRating"><legend>Product outcome *</legend><p class="help">How well the supplied products met expectations.</p><div class="ratings"></div></fieldset><fieldset data-rating="resolutionRating"><legend>Resolution</legend><p class="help">How satisfied you were with the way concerns were handled.</p><div class="ratings"></div></fieldset><label>What went well?<textarea name="whatWentWell" placeholder="Anything we should keep doing?"></textarea></label><label style="margin-top:24px">What could we improve? *<textarea required name="whatWeCanImprove" placeholder="Please be as specific as you can."></textarea></label><fieldset><legend>Would you consider NovaMerch again? *</legend><div class="choice">${["Yes","Maybe","No"].map((item) => `<button type="button" data-choice="${item}">${item}</button>`).join("")}</div></fieldset><label class="check"><input type="checkbox" name="permissionToContact">I’m happy for NovaMerch to contact me about this feedback.</label><div class="error" id="error"></div><button class="submit">Submit feedback</button><p class="note">Your response is linked to this order and is not published publicly.</p></form></section><section class="thankyou" id="thankyou"><h1>Thank you, ${recipientName}.</h1><p>Your response has been received and will help us improve how we work with customers.</p></section></main><script>const data={};document.querySelectorAll('[data-rating]').forEach(group=>{const key=group.dataset.rating,box=group.querySelector('.ratings');for(let n=1;n<6;n++){const b=document.createElement('button');b.type='button';b.textContent=n;b.onclick=()=>{data[key]=n;box.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b))};box.append(b)}});document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{data.futureBusiness=b.dataset.choice;document.querySelectorAll('[data-choice]').forEach(x=>x.classList.toggle('selected',x===b))});document.getElementById('feedback').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),error=document.getElementById('error');Object.assign(data,{whatWentWell:f.get('whatWentWell'),whatWeCanImprove:f.get('whatWeCanImprove'),permissionToContact:f.get('permissionToContact')==='on'});if(!data.overallRating||!data.communicationRating||!data.productQualityRating||!data.whatWeCanImprove.trim()||!data.futureBusiness){error.textContent='Please complete the required questions before submitting.';error.style.display='block';return}const r=await fetch(location.pathname,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),result=await r.json().catch(()=>({}));if(!r.ok){error.textContent=result.error||'We could not save your feedback. Please try again.';error.style.display='block';return}document.getElementById('form').style.display='none';document.getElementById('thankyou').style.display='block'};</script></body></html>`;
}

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const token = await feedbackToken((await params).token);
  if (!token) return NextResponse.json({ error: "This feedback link is invalid or has expired." }, { status: 401 });
  const db = getDatabase();
  const response = db ? await db.prepare("SELECT submitted_at FROM feedback_responses WHERE order_ref = ?").bind(token.orderId).first<{ submitted_at: string }>() : null;
  if (request.headers.get("accept")?.includes("text/html")) {
    if (response) return new Response(feedbackFormHtml(token.orderId).replace('<section id="form">', '<section id="form" style="display:none">').replace('<section class="thankyou"', '<section class="thankyou" style="display:block"'), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } });
    return new Response(feedbackFormHtml(token.orderId), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } });
  }
  return NextResponse.json({ orderRef: token.orderId, alreadySubmitted: Boolean(response), submittedAt: response?.submitted_at ?? null });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const token = await feedbackToken((await params).token);
  if (!token) return NextResponse.json({ error: "This feedback link is invalid or has expired." }, { status: 401 });
  const body: FeedbackPayload = await request.json().catch(() => ({}));
  const overallRating = rating(body.overallRating);
  const communicationRating = rating(body.communicationRating);
  const productQualityRating = rating(body.productQualityRating);
  const resolutionRating = rating(body.resolutionRating, false);
  const whatWeCanImprove = typeof body.whatWeCanImprove === "string" ? body.whatWeCanImprove.trim() : "";
  const whatWentWell = typeof body.whatWentWell === "string" ? body.whatWentWell.trim() : "";
  const futureBusiness = typeof body.futureBusiness === "string" ? body.futureBusiness : "";
  if (!overallRating || !communicationRating || !productQualityRating || resolutionRating === null || !whatWeCanImprove || !["Yes", "Maybe", "No"].includes(futureBusiness)) {
    return NextResponse.json({ error: "Please complete the required feedback fields." }, { status: 400 });
  }
  const db = getDatabase();
  if (!db) return NextResponse.json({ error: "Feedback storage is not available. Please try again later." }, { status: 503 });
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO feedback_responses (id, order_ref, overall_rating, communication_rating, product_quality_rating, resolution_rating, what_went_well, what_we_can_improve, future_business, permission_to_contact, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(order_ref) DO UPDATE SET overall_rating = excluded.overall_rating, communication_rating = excluded.communication_rating, product_quality_rating = excluded.product_quality_rating, resolution_rating = excluded.resolution_rating, what_went_well = excluded.what_went_well, what_we_can_improve = excluded.what_we_can_improve, future_business = excluded.future_business, permission_to_contact = excluded.permission_to_contact, submitted_at = excluded.submitted_at`)
    .bind(crypto.randomUUID(), token.orderId, overallRating, communicationRating, productQualityRating, resolutionRating ?? null, whatWentWell || null, whatWeCanImprove, futureBusiness, body.permissionToContact === true ? 1 : 0, now).run();
  await db.prepare("UPDATE feedback_jobs SET status = 'Completed', sent_at = COALESCE(sent_at, ?) WHERE order_ref = ?").bind(now, token.orderId).run();
  return NextResponse.json({ status: "Submitted" }, { status: 201 });
}
