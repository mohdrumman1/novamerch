import FeedbackForm from "./FeedbackForm";

export const dynamic = "force-dynamic";

export default async function CustomerFeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  return <FeedbackForm token={(await params).token} />;
}
