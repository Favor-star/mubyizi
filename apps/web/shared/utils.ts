export function getInitials(names: string) {
  if (!names) return "AB";
  const splittedNames = names.trim().split(" ");
  const firstLetter = splittedNames[0][0].toUpperCase();

  const secondLetter =
    splittedNames.length > 1 ? splittedNames[1]?.[0]?.toUpperCase() : splittedNames[0][0].toUpperCase();
  return firstLetter + secondLetter;
}
