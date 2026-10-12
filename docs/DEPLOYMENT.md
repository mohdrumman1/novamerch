# Deployment checklist

1. Deploy to a preview/staging environment first.
2. Confirm the public canonical host and www redirect behaviour.
3. Confirm the lead-intake endpoint accepts the current payload from the preview origin.
4. Submit a test lead and verify acknowledgement, notification and admin visibility.
5. Validate `/robots.txt`, `/sitemap.xml`, metadata and the existing public routes.
6. Review the mockup builder's intended access level before changing indexing or navigation.
7. Capture final mobile and desktop screenshots and Lighthouse reports.
8. Keep the prior deployment available for rollback until lead handling is confirmed.
