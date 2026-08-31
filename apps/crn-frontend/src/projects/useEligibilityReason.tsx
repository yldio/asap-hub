import { useContext } from 'react';

import { EligibilityReasonContext } from './EligibilityReasonProvider';

export const useEligibilityReason = () => useContext(EligibilityReasonContext);
