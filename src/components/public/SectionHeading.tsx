export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-widest text-[#1e4fa3]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}
