export function calcEngagement(
  followers: number,
  avgLike: number,
  avgComment: number
): number {
  if (followers === 0) return 0;
  return Math.round(((avgLike + avgComment) / followers) * 100 * 100) / 100;
}

export function calcViewRate(followers: number, avgViews: number): number {
  if (followers === 0) return 0;
  return Math.round((avgViews / followers) * 100 * 100) / 100;
}

export function erRating(er: number): { label: string; color: string } {
  if (er < 1) return { label: 'Poor', color: '#EF4444' };
  if (er < 3) return { label: 'Average', color: '#F59E0B' };
  if (er <= 6) return { label: 'Good', color: '#10B981' };
  return { label: 'Excellent', color: '#814bfe' };
}
