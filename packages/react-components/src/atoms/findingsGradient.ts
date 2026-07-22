import { fern, info500, iris } from '../colors';

// Multi-stop brand ramp (purple → blue → teal → green) shared by the
// preliminary-findings wheel and bar so the two can't drift apart.
export const findingsRampStops = `${iris.hex} 30.25%, ${info500.hex} 51.91%, #1491B2 66.74%, #299C86 79.82%, ${fern.hex} 90.01%`;

export const findingsGradient = `linear-gradient(90deg, ${findingsRampStops})`;

// Green sits near 100% then blends back to purple at the seam so the ring loops.
export const findingsConicRamp = `conic-gradient(from 0deg, ${findingsRampStops}, ${iris.hex} 100%)`;
