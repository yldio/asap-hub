import { PerformanceMetrics } from '@asap-hub/model';

export interface Quartiles {
  min: number;
  q1: number;
  q3: number;
  max: number;
}

const isEven = (number: number) => number % 2 === 0;

export const getMedian = (numbers: number[]): number => {
  const midValue = Math.floor(numbers.length / 2);
  if (isEven(numbers.length)) {
    return (numbers[midValue - 1] + numbers[midValue]) / 2;
  }
  return numbers[midValue];
};

export const getQuartiles = (
  numbers: number[],
): { min: number; q1: number; q3: number; max: number } => {
  const n = numbers.length;
  if (n < 4) return { min: 0, q1: 0, q3: 0, max: 0 };

  const sortedData = numbers.sort((a, b) => a - b);
  const middleIndex = Math.floor(n / 2);
  const q1 = getMedian(sortedData.slice(0, middleIndex));
  const q3 = isEven(n)
    ? getMedian(sortedData.slice(middleIndex))
    : getMedian(sortedData.slice(middleIndex + 1));
  return { min: sortedData[0], q1, q3, max: sortedData[n - 1] };
};

export const getPerformanceMetrics = (
  data: number[],
  isInteger: boolean = true,
): PerformanceMetrics => {
  const { min, q1, q3, max } = getQuartiles(data);
  const firstQuartile = isInteger ? q1 : parseFloat(q1.toFixed(2));
  const thirdQuartile = isInteger ? q3 : parseFloat(q3.toFixed(2));
  const factor = isInteger ? 1 : 0.01;

  if (min === max) {
    return {
      belowAverageMin: -1,
      belowAverageMax: -1,
      averageMin: min,
      averageMax: max,
      aboveAverageMin: -1,
      aboveAverageMax: -1,
    };
  }

  const belowAverageMin = min;
  let belowAverageMax;
  let averageMin;
  let averageMax;
  let aboveAverageMin;
  let aboveAverageMax = max;

  if (
    isInteger &&
    (!Number.isInteger(firstQuartile) || !Number.isInteger(thirdQuartile))
  ) {
    belowAverageMax = Number.isInteger(firstQuartile)
      ? Math.max(belowAverageMin, firstQuartile - factor)
      : Math.floor(firstQuartile);
    averageMin = belowAverageMax + factor;
    averageMax = Number.isInteger(thirdQuartile)
      ? Math.max(averageMin, thirdQuartile)
      : Math.floor(thirdQuartile);
    aboveAverageMin = Math.min(averageMax + factor, max);
  } else {
    belowAverageMax = Math.max(min, firstQuartile - factor);
    averageMin = belowAverageMax + factor;
    averageMax = Math.max(averageMin, thirdQuartile);
    aboveAverageMin = Math.min(averageMax + factor, max);
  }

  if (averageMax === aboveAverageMax) {
    aboveAverageMin = -1;
    aboveAverageMax = -1;
  }
  return {
    belowAverageMin,
    belowAverageMax,
    averageMin,
    averageMax,
    aboveAverageMin,
    aboveAverageMax,
  };
};
