// Stage 4b: Dynamic Time Warping.
// Aligns the user's rep speed against the expert reference ghost so joint
// comparisons happen at the correct point in the movement, not the same
// wall-clock frame.

export interface DtwResult {
  /** Total alignment cost - lower means closer timing match. */
  cost: number;
  /** path[i] = index into the reference sequence best aligned with user[i]. */
  path: number[];
}

function distance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

/**
 * Classic O(n*m) DTW over two sequences of feature vectors (e.g. per-frame
 * joint angle vectors). Returns the alignment path used to compare the
 * user's frame N against the correct reference frame, not frame N of the
 * reference clip.
 */
export function dtw(user: number[][], reference: number[][]): DtwResult {
  const n = user.length;
  const m = reference.length;
  const cost = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(Infinity));
  cost[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const d = distance(user[i - 1], reference[j - 1]);
      cost[i][j] = d + Math.min(cost[i - 1][j], cost[i][j - 1], cost[i - 1][j - 1]);
    }
  }

  // Backtrack to build the alignment path.
  const path: number[] = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    path.unshift(j - 1);
    const options = [cost[i - 1][j], cost[i][j - 1], cost[i - 1][j - 1]];
    const min = Math.min(...options);
    if (min === options[2]) {
      i--;
      j--;
    } else if (min === options[0]) {
      i--;
    } else {
      j--;
    }
  }

  return { cost: cost[n][m], path };
}
