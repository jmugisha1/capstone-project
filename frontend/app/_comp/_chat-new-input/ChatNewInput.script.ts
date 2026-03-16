export function getPlaceholder(stage: string): string {
  if (stage === "start") return "Describe your symptoms...";
  if (stage === "questions") return "Type Yes or No...";
  return "Type anything to start over...";
}
