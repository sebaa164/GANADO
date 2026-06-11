export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-AR");
}

export function initialLetter(name: string): string {
  return name?.charAt(0).toUpperCase() || "U";
}
