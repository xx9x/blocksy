import type { Metadata } from "next";
import { InfoPage } from "@/components/landing/InfoPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyInfoPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      color="purple"
      title="Your data stays with you"
      intro="Blocksy is currently an educational demo with no backend. Here's exactly what that means for your information."
    >
      <section>
        <h2>What&apos;s stored, and where</h2>
        <p>
          Your demo progress — a display name, an optional email you typed, earned bricks, your build layout,
          checklist ticks and habit log — is saved in your own browser&apos;s local storage. It never leaves your device,
          and clearing your browser data (or using Settings → Delete all demo data) removes it.
        </p>
      </section>
      <section>
        <h2>Passwords</h2>
        <ul>
          <li>The Password Check analyzes what you type entirely in your browser. It isn&apos;t sent, saved or logged.</li>
          <li>The log-in and sign-up forms validate your input and then discard the password immediately.</li>
          <li>Please use example passwords in the checker rather than your real ones.</li>
        </ul>
      </section>
      <section>
        <h2>No tracking</h2>
        <p>The demo includes no analytics, advertising or third-party tracking scripts. Fonts are self-hosted at build time.</p>
      </section>
      <section>
        <h2>If this changes</h2>
        <p>
          If real accounts are added in the future, they&apos;ll use a reputable authentication provider with secure
          server-side sessions, and this page will be updated before launch.
        </p>
      </section>
    </InfoPage>
  );
}
