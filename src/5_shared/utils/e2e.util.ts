export function randomEmailGeneration(): string {
  return `e2e-tester-${Date.now()}-${Math.random().toString(36).slice(2, 10)}@example.com`;
}

export function randomUsernameGeneration(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length: 15 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

export function randomPhoneNumberGeneration(): string {
  const operators = [39, 50, 63, 66, 67, 68, 73, 89, 93, 95, 96, 97, 98, 99];

  return `+380${operators[Math.floor(Math.random() * operators.length)]}${Math.floor(1000000 + Math.random() * 9000000)}`;
}
