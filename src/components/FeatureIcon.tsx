import { CalendarCheck, Eye, Fish, KeyRound, Siren, Smartphone } from "lucide-react";
import type { FeatureInfo } from "@/lib/features";

const ICONS = {
  key: KeyRound,
  smartphone: Smartphone,
  fish: Fish,
  eye: Eye,
  siren: Siren,
  calendar: CalendarCheck,
};

export function FeatureIcon({ icon, className }: { icon: FeatureInfo["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden />;
}
