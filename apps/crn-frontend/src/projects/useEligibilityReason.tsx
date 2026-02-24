import { useContext } from 'react';

import { EligibilityReasonContext } from '../network/teams/EligibilityReasonProvider';

export const useEligibilityReason = () => useContext(EligibilityReasonContext);
