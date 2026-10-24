// Product page content. General buying guidance only: no prices, minimums,
// lead times or supplier claims. Those stay "confirmed per quote".

export interface ProductContent {
  name: string;
  summary: string;
  bestFor: string[];
  choose: [string, string][];
  methods: string[];
  send: string[];
  faqs: [string, string][];
  related: string[];
}

const commonSend = ["Your logo (vector .ai, .eps or .pdf is best; a clear PNG works to start)", "Rough quantity and budget", "Your deadline and delivery suburb"];

export const products: Record<string, ProductContent> = {
  "custom-drink-bottles": {
    name: "Custom drink bottles",
    summary: "Branded drink bottles are one of the most-used items in a merchandise pack. They suit clubs, gyms, workplaces and events because people keep and reuse them.",
    bestFor: ["Sports clubs and junior registration packs", "Gyms and member programs", "Staff onboarding and events"],
    choose: [
      ["Material", "Stainless steel keeps drinks cold or hot longer. Plastic and Tritan-style bottles are lighter and usually lower cost. Aluminium is light and takes bright colour."],
      ["Capacity", "Common sizes are around 500 to 750 ml. Bigger suits training and sport, smaller suits desks and events."],
      ["Lid and spout", "Sports spouts suit training. Screw caps suit desks and travel. Check what the club or team will actually use."],
      ["Colour", "Bottle colour and print colour both matter. Dark bottles with light print are usually clearest."],
    ],
    methods: ["Screen or pad printing for simple logos", "Laser engraving on metal bottles", "Full-colour wrap or digital print for detailed artwork (availability depends on the bottle)"],
    send: commonSend,
    faqs: [
      ["What is the minimum order?", "It varies by bottle and decoration method. Tell us your quantity and we will confirm suitable options."],
      ["Can you match our club colours?", "We work from your colour references and confirm the closest achievable result on the chosen bottle and method before production."],
      ["Are bottles dishwasher safe?", "It depends on the bottle and the decoration. We will check this for the specific option you shortlist."],
    ],
    related: ["branded-tote-bags", "corporate-gifts", "embroidered-caps"],
  },
  "embroidered-caps": {
    name: "Embroidered caps",
    summary: "Embroidered caps give a lasting, textured logo that suits teams, trades, clubs and events. Embroidery handles bold, simple logos best.",
    bestFor: ["Trades and construction crews", "Sports clubs and supporters", "Business and event teams"],
    choose: [
      ["Style", "Structured six-panel caps hold a front logo well. Unstructured caps are softer. Trucker and bucket styles suit casual wear."],
      ["Logo suitability", "Fine detail, tiny text and gradients do not stitch well. A simplified version of the logo often looks better embroidered."],
      ["Placement", "Front is standard. Side and back embroidery can add a sponsor or club name."],
      ["Colour", "Thread colours are matched to the closest available thread. Share brand colours so we can recommend the nearest options."],
    ],
    methods: ["Flat embroidery for most logos", "3D or raised embroidery on some caps for a bolder look", "Patches or transfers for very detailed logos"],
    send: commonSend,
    faqs: [
      ["Can any logo be embroidered?", "Most can, but very fine detail may need simplifying. We will tell you before production if your artwork needs adjusting."],
      ["Do I need a digitised file?", "Embroidery uses a stitch file made from your artwork. Send your logo and we will advise how it is prepared."],
      ["What is the minimum order?", "It varies by cap and method. Tell us your quantity and we will confirm options."],
    ],
    related: ["branded-workwear", "branded-polos", "custom-hoodies"],
  },
  "custom-hoodies": {
    name: "Custom hoodies",
    summary: "Custom hoodies work as club, staff and fundraising merchandise. The right fabric weight and print method decide how they look and last.",
    bestFor: ["Sports clubs and school groups", "Staff and gym teams", "Fundraising and supporter runs"],
    choose: [
      ["Fabric weight", "Heavier fleece is warmer and feels premium. Lighter hoodies suit milder climates and layering."],
      ["Fit and sizing", "Order a spread of sizes. For clubs, collect sizes first and include kids sizes if needed."],
      ["Print or embroidery", "Large artwork suits print. Small chest logos suit embroidery."],
      ["Placement", "Chest, back, sleeve and hood are common. More placements add cost."],
    ],
    methods: ["Screen printing for bold, repeat runs", "DTF or digital transfer for multi-colour artwork", "Embroidery for small chest logos"],
    send: [...commonSend, "Size breakdown if you have it"],
    faqs: [
      ["Which is better, print or embroidery?", "Print suits large and colourful artwork. Embroidery suits small logos and a premium feel. See our guide to printing methods."],
      ["Can we order mixed sizes?", "Yes, hoodies are normally ordered with a size breakdown."],
      ["What is the minimum order?", "It varies by garment and method. Tell us your quantity and we will confirm."],
    ],
    related: ["branded-polos", "embroidered-caps", "branded-workwear"],
  },
  "branded-polos": {
    name: "Branded polos",
    summary: "Branded polos are the standard smart-casual uniform for businesses, clubs and events. Embroidery is the usual finish for a clean chest logo.",
    bestFor: ["Staff and front-of-house uniforms", "Club officials and coaches", "Events and sponsors"],
    choose: [
      ["Fabric", "Cotton blends feel traditional. Polyester or performance fabrics wick moisture and suit active wear."],
      ["Fit", "Offer mens and womens cuts where relevant, and a size spread."],
      ["Colour", "Garment colour affects logo contrast. Share your brand colours and we will suggest what reads well."],
      ["Logo placement", "Left chest is standard. Add a sleeve or back for sponsors."],
    ],
    methods: ["Embroidery for a durable chest logo", "Screen print or heat transfer for larger or lighter artwork"],
    send: [...commonSend, "Size breakdown if you have it"],
    faqs: [
      ["Embroidery or print for polos?", "Embroidery is the common choice for a chest logo. Print can suit larger designs on performance fabric."],
      ["Can we add staff names?", "Name personalisation is often possible. Tell us what you need and we will confirm."],
      ["What is the minimum order?", "It varies by polo and method. Tell us your quantity."],
    ],
    related: ["branded-workwear", "embroidered-caps", "custom-hoodies"],
  },
  "branded-workwear": {
    name: "Branded workwear",
    summary: "Branded workwear gets crews recognised on site and in the community. Durability of the logo and suitability of the garment matter more than looks alone.",
    bestFor: ["Construction and trades", "Cleaning, landscaping and maintenance", "Service businesses with vehicles and sites"],
    choose: [
      ["Garment type", "Shirts, polos, jackets and hi-vis each have different requirements. Check any site or industry standards that apply."],
      ["Durability", "Embroidery typically holds up to heavy wash and wear. Printed logos vary by garment and ink."],
      ["Placement", "Chest and back are common. Back logos help visibility on site."],
      ["Sizing", "Collect sizes per person to avoid reorders."],
    ],
    methods: ["Embroidery for durable chest logos", "Screen print or transfer for larger back prints"],
    send: [...commonSend, "Any hi-vis or site requirements"],
    faqs: [
      ["Do you supply hi-vis?", "Tell us what you need. We will confirm what is available and whether branding is suitable for the standard you must meet."],
      ["Which logo method lasts longest?", "Embroidery is generally the most durable for workwear, but the right choice depends on the garment."],
      ["What is the minimum order?", "It varies by garment and method. Tell us your quantity."],
    ],
    related: ["branded-polos", "embroidered-caps", "custom-hoodies"],
  },
  "promotional-pens": {
    name: "Promotional pens",
    summary: "Promotional pens are a low-cost, practical item for events, reception desks and customer handouts.",
    bestFor: ["Events and trade shows", "Reception and client handouts", "Large giveaways"],
    choose: [
      ["Style", "Plastic pens suit large giveaways. Metal pens feel more premium for clients."],
      ["Ink", "Check ink colour and writing feel, not only looks."],
      ["Print area", "Pens have a small print area, so keep the logo simple and legible."],
      ["Quantity", "Pens are normally ordered in larger runs."],
    ],
    methods: ["Pad or screen printing for logos", "Laser engraving on metal pens"],
    send: commonSend,
    faqs: [
      ["Can you print a full-colour logo on a pen?", "Some pens suit it. Tell us your logo and we will recommend an option."],
      ["What is the minimum order?", "It varies by pen. Tell us your quantity."],
      ["Can we have different pens per team?", "Often, yes. Ask and we will confirm."],
    ],
    related: ["corporate-gifts", "branded-tote-bags", "custom-drink-bottles"],
  },
  "branded-tote-bags": {
    name: "Branded tote bags",
    summary: "Tote bags give a large print area and high visibility. They suit events, retail, gifting and sustainability-minded campaigns.",
    bestFor: ["Events and conferences", "Retail and gifting", "Community and fundraising"],
    choose: [
      ["Material", "Cotton canvas is sturdy and takes print well. Non-woven and recycled options are lighter and lower cost."],
      ["Size and handles", "Check strap length and capacity for the real use."],
      ["Print colours", "Fewer colours keep cost down. Bold single-colour logos look clean."],
      ["Colour", "Bag colour sets contrast for the logo."],
    ],
    methods: ["Screen printing for bold repeat artwork", "Transfers or digital print for multi-colour designs"],
    send: commonSend,
    faqs: [
      ["Is cotton better than non-woven?", "Cotton is sturdier and reused more. Non-woven is lighter and often lower cost. Choose by use and budget."],
      ["What is the minimum order?", "It varies by bag and method. Tell us your quantity."],
      ["Can we print both sides?", "Often, yes. Extra print positions can add cost."],
    ],
    related: ["corporate-gifts", "custom-drink-bottles", "promotional-pens"],
  },
  "corporate-gifts": {
    name: "Corporate gifts",
    summary: "Corporate gifts work best when they are useful, suit the recipient and are presented well. A curated pack often beats a single item.",
    bestFor: ["Staff onboarding and recognition", "Client thank-you gifts", "Events and end-of-year gifting"],
    choose: [
      ["Recipient", "Match the item to who receives it: new hire, client or sponsor."],
      ["Budget per pack", "Set a per-person budget first, then build the pack to fit."],
      ["Presentation", "Packaging and a simple card change how a gift feels."],
      ["Timing", "Gifting seasons are busy. Share your date early so we can say if it is realistic."],
    ],
    methods: ["Mixed decoration across items (engraving, print, embroidery)", "Branded packaging or inserts where available"],
    send: [...commonSend, "Who the gift is for and the occasion"],
    faqs: [
      ["Can you build a mixed pack?", "Yes. Mixed packs are a common brief. Tell us the budget and recipients."],
      ["Can each pack be personalised?", "Sometimes. Tell us what you want and we will confirm what is possible."],
      ["What is the minimum order?", "It varies by item and pack. Tell us your quantity."],
    ],
    related: ["custom-drink-bottles", "branded-tote-bags", "promotional-pens"],
  },
};
