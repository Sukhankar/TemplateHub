import axiosInstance from "../../user/utils/axiosInstance";

export const getDeveloperDashboard = async () => {
  const res = await axiosInstance.get("/developer/dashboard");
  return res.data;
};

export const getDeveloperTemplates = async (status) => {
  const res = await axiosInstance.get("/developer/templates", {
    params: status ? { status } : {},
  });
  return res.data;
};

export const createTemplate = async (formData, onProgress) => {
  const res = await axiosInstance.post("/developer/templates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    },
  });
  return res.data;
};

export const updateTemplate = async (id, formData, onProgress) => {
  const res = await axiosInstance.put(`/developer/templates/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    },
  });
  return res.data;
};

export const deleteTemplate = async (id) => {
  const res = await axiosInstance.delete(`/developer/templates/${id}`);
  return res.data;
};

export const getDeveloperAnalytics = async () => {
  const res = await axiosInstance.get("/developer/analytics");
  return res.data;
};

export const getDeveloperEarnings = async () => {
  const res = await axiosInstance.get("/developer/earnings");
  return res.data;
};

export const requestPayout = async (payoutData) => {
  const res = await axiosInstance.post("/developer/payout-request", payoutData);
  return res.data;
};
