import { padTwo } from "@/lib/format";

interface CardCounterProps {
  current: number;
  total: number;
}

export default function CardCounter({ current, total }: CardCounterProps) {
  return (
    <div className="fixed bottom-4 right-8 z-50 text-[10px] uppercase tracking-widest text-zinc-600 font-light">
      {padTwo(current + 1)} / {padTwo(total)}
    </div>
  );
}
