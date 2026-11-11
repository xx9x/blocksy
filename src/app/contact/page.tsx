import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/landing/InfoPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      color="orange"
      title="Say hello"
      intro="Blocksy is a portfolio project. A contact form is coming soon."
    >
      <section>
        <h2>In the meantime</h2>
        <p>
          The best way to explore is the{" "}
          <Link href="/app" className="font-bold text-sky-ink underline">
            live demo
          </Link>
          . If you found this project through a portfolio post, replying there is the quickest way to reach the
          author.
        </p>
      </section>
    </InfoPage>
  );
}
