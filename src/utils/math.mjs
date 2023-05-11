import { sum } from 'lodash-es';

/**
 * @param {number[]} weights
 */
export const randomWithWeight = weights => {
  const weightSum = sum(weights);
  const weightBoundaries = [];
  for (let i = 0; i < weights.length; i++) {
    weightBoundaries[i] = (weightBoundaries[i - 1] || 0) + weights[i] / weightSum;
  }
  const randomVal = Math.random();
  const randomIndex = weightBoundaries.findIndex(val => randomVal <= val);
  return randomIndex === -1 ? weights.length - 1 : randomIndex;
};
