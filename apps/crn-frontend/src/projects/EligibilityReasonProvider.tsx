import React, { createContext, useState } from 'react';

type EligibilityReasonContextData = {
  eligibilityReasons: Set<string>;
  setEligibilityReasons: (newEligibilityReason: Set<string>) => void;
};

export const EligibilityReasonContext =
  createContext<EligibilityReasonContextData>(
    {} as EligibilityReasonContextData,
  );

export const EligibilityReasonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [eligibilityReasons, setEligibilityReasons] = useState<Set<string>>(
    new Set(),
  );

  return (
    <EligibilityReasonContext.Provider
      value={{
        eligibilityReasons,
        setEligibilityReasons,
      }}
    >
      {children}
    </EligibilityReasonContext.Provider>
  );
};
