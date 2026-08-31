import React, { createContext, useContext, useState, useEffect } from "react";

const BreadcrumbContext = createContext({
  extraCrumbs: [],
  setExtraCrumbs: () => {},
});

export const BreadcrumbProvider = ({ children }) => {
  const [extraCrumbs, setExtraCrumbs] = useState([]);

  return (
    <BreadcrumbContext.Provider value={{ extraCrumbs, setExtraCrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// Consumed internally by <Breadcrumbs />
export const useBreadcrumbExtra = () => useContext(BreadcrumbContext);

/**
 * Call from inside any routed page to append crumbs after the
 * route-based ones — e.g. an entity name and/or active tab, which
 * don't have their own URL segment.
 *
 * Example (ViewStudentDetails.jsx):
 *   usePageBreadcrumbs(["Sarah Jenkins", activeTab]);
 *   // Home > Student Profile > Sarah Jenkins > Guardians
 *
 * Crumbs reset automatically when the page unmounts.
 */
export const usePageBreadcrumbs = (labels = []) => {
  const { setExtraCrumbs } = useContext(BreadcrumbContext);
  const key = JSON.stringify(labels);

  useEffect(() => {
    setExtraCrumbs(labels.filter(Boolean));
    return () => setExtraCrumbs([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
};