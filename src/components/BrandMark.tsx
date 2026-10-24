import Image from "next/image";

type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Viyaan AI"
        width={32}
        height={32}
        className={compact ? "size-7 object-contain" : "size-8 object-contain"}
        priority
      />
      <span className="font-display text-sm font-semibold tracking-[0.08em] text-white">VIYAAN AI</span>
    </span>
  );
}
