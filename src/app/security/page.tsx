import type { Metadata } from "next";
import { InfoPage } from "@/components/landing/InfoPage";

export const metadata: Metadata = { title: "Security" };

export default function SecurityInfoPage() {
  return (
    <InfoPage
      eyebrow="Security"
      color="blue"
      title="How Blocksy is built"
      intro="A security-education app should practice what it teaches. These are the principles behind this demo."
    >
      <section>
        <h2>Educational, and honest about it</h2>
        <ul>
          <li>Every check is labeled as an educational simulation or a self-reported checklist.</li>
          <li>Learning progress measures lessons completed here — never how secure your real accounts are.</li>
          <li>The breach checker is a clearly marked demonstration with fictional data. It doesn&apos;t look up real addresses.</li>
          <li>Phishing examples use invented brands, people and reserved domains, and none of their links go anywhere.</li>
        </ul>
      </section>
      <section>
        <h2>Minimal data by design</h2>
        <ul>
          <li>No server, database or user accounts in this version.</li>
          <li>Passwords are never stored, transmitted or logged.</li>
          <li>Random example passphrases come from the browser&apos;s cryptographic random number generator.</li>
        </ul>
      </section>
      <section>
        <h2>Roadmap</h2>
        <ul>
          <li>Real authentication via a reputable provider with secure server-side sessions — coming soon.</li>
          <li>Optional real breach checks through an authorized provider such as Have I Been Pwned, following its API terms — coming soon.</li>
        </ul>
      </section>
    </InfoPage>
  );
}
