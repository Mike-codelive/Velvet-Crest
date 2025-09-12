export function getSubscriptionDisplay(plan: string): string {
  switch (plan) {
    case '1_week':
      return 'Every 1 Week';
    case '2_weeks':
      return 'Every 2 Weeks';
    case '4_weeks':
      return 'Every 4 Weeks';
    case '8_weeks':
      return 'Every 8 Weeks';
    default:
      return 'Unknown Frequency';
  }
}
