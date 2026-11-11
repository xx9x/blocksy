"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { PhishingQuiz } from "@/components/activities/PhishingQuiz";

export default function PhishingPage() {
  return (
    <>
      <PageHeader
        title="Phishing Practice"
        badge="Yellow bricks · Phishing awareness"
        color="yellow"
        description="Eight realistic but completely fictional messages and pages. Decide whether each is safe or suspicious, then learn the tell-tale clues."
        bricks={[
          { x: 0, z: 0, level: 0, w: 4, d: 2, color: "yellow" },
          { x: 0, z: 0, level: 1, w: 1, d: 2, color: "yellow" },
          { x: 3, z: 1, level: 1, w: 1, d: 1, color: "orange" },
        ]}
      />
      <PhishingQuiz />
    </>
  );
}
