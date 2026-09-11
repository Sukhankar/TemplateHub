import { createContext, useContext, useState, useCallback } from "react";
import * as devApi from "../api/developerApi";

const DeveloperContext = createContext();

export const DeveloperProvider = ({ children }) => {
  const [metrics, setMetrics] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await devApi.getDeveloperDashboard();
      setMetrics(data.metrics);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load developer dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTemplates = useCallback(async (status) => {
    setIsLoading(true);
    try {
      const data = await devApi.getDeveloperTemplates(status);
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load templates.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await devApi.getDeveloperEarnings();
      setEarnings(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load earnings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <DeveloperContext.Provider
      value={{
        metrics,
        templates,
        earnings,
        isLoading,
        error,
        fetchDashboard,
        fetchTemplates,
        fetchEarnings,
      }}
    >
      {children}
    </DeveloperContext.Provider>
  );
};

export const useDeveloper = () => useContext(DeveloperContext);
