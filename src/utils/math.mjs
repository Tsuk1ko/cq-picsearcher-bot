import { sum } from 'lodash-es';

/**
 * @param {number[]} weights
 */
export const randomWithWeight = weights => {
  const weightSum = sum(weights);
  const weightBoundaries = weights.map((weight, i) => (weights[i - 1] || 0) + weight / weightSum);
  const randomVal = Math.random();
  const randomIndex = weightBoundaries.findIndex(val => randomVal <= val);
  return randomIndex === -1 ? weights.length - 1 : randomIndex;
};
