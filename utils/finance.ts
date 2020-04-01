export function standardDeviation(values) {
  const avg = average(values);

  const squareDiffs = values.map((value) => {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  const stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data) {
  const sum = data.reduce((s, value) => {
    return s + value;
  }, 0);

  const avg = sum / data.length;
  return avg;
}
