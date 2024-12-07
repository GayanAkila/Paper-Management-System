import axiosInstance from "./axiosInstance";

export const getUserSubmissions = async () => {
  const response = await axiosInstance.get("/submissions/by-author");
  return response.data;
};

export const editSubmission = async (id: string, formData: FormData) => {
  const response = await axiosInstance.put(`/submissions/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const createSubmission = async (formData: FormData) => {
  const response = await axiosInstance.post("/submissions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteSubmission = async (id: string) => {
  const response = await axiosInstance.delete(`/submissions/${id}`);
  return response.data;
};
