import { IconProfile, IconSearch } from "@/components/icons";
import { STROKE, input } from "../ui";

/** Paieškos laukas su piktograma kairėje, kaip programėlės paieškos juosta. */
export function SearchField({
  name,
  defaultValue,
  placeholder,
  label,
  icon,
  required,
}: {
  name: string;
  defaultValue?: string;
  placeholder: string;
  label: string;
  icon: "search" | "user";
  required?: boolean;
}) {
  const Icon = icon === "search" ? IconSearch : IconProfile;
  return (
    <label className="relative block min-w-0 flex-1 basis-60">
      <span className="sr-only">{label}</span>
      <Icon
        size={18}
        strokeWidth={STROKE}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-app-faint"
      />
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        maxLength={200}
        placeholder={placeholder}
        className={`${input} pl-11`}
      />
    </label>
  );
}
