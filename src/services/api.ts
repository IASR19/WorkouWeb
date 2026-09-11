import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("workou_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("workou_token");
      localStorage.removeItem("workou_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const api = {
  async login(email: string, password: string, role?: string) {
    const response = await client.post("/auth/login", {
      email,
      password,
      role,
    });
    if (response.data.accessToken) {
      localStorage.setItem("workou_token", response.data.accessToken);
      localStorage.setItem("workou_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(
    name: string,
    email: string,
    password: string,
    role: "recruiter" | "candidate",
    companyData?: {
      companyName?: string;
      companyCNPJ?: string;
      companyWebsite?: string;
      companyIndustry?: string;
      plan?: string;
    },
  ) {
    const response = await client.post("/auth/register", {
      name,
      email,
      password,
      role,
      ...companyData,
    });
    if (response.data.accessToken) {
      localStorage.setItem("workou_token", response.data.accessToken);
      localStorage.setItem("workou_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("workou_token");
    localStorage.removeItem("workou_user");
  },

  getCurrentUser(): {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    availableRoles?: string[];
  } | null {
    const userStr = localStorage.getItem("workou_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  async getCandidateMe() {
    const response = await client.get("/candidates/me");
    return response.data;
  },

  async updateCandidate(id: string, dto: Partial<{
    headline: string;
    location: string;
    workModel: string;
    yearsExperience: number;
    desiredSalary: number;
    skills: string[];
  }>) {
    const response = await client.patch(`/candidates/${id}`, dto);
    return response.data;
  },

  async getCandidateQueue() {
    const response = await client.get("/matches/candidate");
    return response.data;
  },

  async getRecruiterQueue(jobId: string) {
    const response = await client.get(`/matches/recruiter/${jobId}`);
    return response.data;
  },

  async swipeCandidate(matchId: string, decision: "approved" | "skipped") {
    const response = await client.patch(
      `/matches/${matchId}/recruiter-decision`,
      { decision },
    );
    return response.data;
  },

  async swipeJob(matchId: string, decision: "approved" | "skipped") {
    const response = await client.patch(
      `/matches/${matchId}/candidate-decision`,
      { decision },
    );
    return response.data;
  },

  async undoSwipe(matchId: string, role: "recruiter" | "candidate") {
    const response = await client.post(`/matches/${matchId}/undo`, { role });
    return response.data;
  },

  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await client.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getConversations() {
    const response = await client.get("/conversations");
    return response.data;
  },

  async getMessages(conversationId: string) {
    const response = await client.get(
      `/conversations/${conversationId}/messages`,
    );
    return response.data;
  },

  async sendMessage(conversationId: string, body: string) {
    const response = await client.post(
      `/conversations/${conversationId}/messages`,
      { body },
    );
    return response.data;
  },

  async getJobs(page = 1, limit = 50) {
    const response = await client.get("/jobs", { params: { page, limit } });
    return response.data as { items: any[]; total: number; page: number; limit: number; totalPages: number };
  },

  async createJob(dto: {
    title: string;
    description: string;
    requiredSkills: string[];
    workModel?: string;
    location?: string;
    seniority?: string;
    salaryMin?: number;
    salaryMax?: number;
  }) {
    const response = await client.post("/jobs", dto);
    return response.data;
  },

  // Company / Recruiter management
  async getMyCompany() {
    const response = await client.get("/companies/me");
    return response.data;
  },

  async getMyRecruiterProfile() {
    const response = await client.get("/companies/me/profile");
    return response.data;
  },

  async getSeats() {
    const response = await client.get("/companies/me/seats");
    return response.data;
  },

  async addSeat(dto: {
    name: string;
    email: string;
    password: string;
    cardLast4?: string;
  }) {
    const response = await client.post("/companies/me/seats", dto);
    return response.data;
  },

  async removeSeat(profileId: string) {
    const response = await client.delete(`/companies/me/seats/${profileId}`);
    return response.data;
  },

  async subscribeToPlan(dto: {
    plan: string;
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvv: string;
  }) {
    const response = await client.post("/companies/me/subscribe", dto);
    return response.data;
  },

  async buyExtraJob(profileId: string, cardLast4?: string) {
    const response = await client.post(
      `/companies/me/seats/${profileId}/extra-job`,
      { cardLast4 },
    );
    return response.data;
  },

  async getBillingRecords() {
    const response = await client.get("/companies/me/billing");
    return response.data;
  },

  // User profile
  async getMe() {
    const response = await client.get("/users/me");
    return response.data;
  },

  async updateMe(dto: {
    name?: string;
    email?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const response = await client.patch("/users/me", dto);
    const user = api.getCurrentUser();
    if (user) {
      // Only merge display fields — response.data is the full User entity and its
      // `role` is the account's base role, not the active session role (a user can
      // be logged in as a different role than the one stored on the entity).
      localStorage.setItem(
        "workou_user",
        JSON.stringify({
          ...user,
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar,
        }),
      );
    }
    return response.data;
  },

  async updateMyCompany(dto: {
    name?: string;
    website?: string;
    industry?: string;
    logo?: string;
  }) {
    const response = await client.patch("/companies/me", dto);
    return response.data;
  },

  // Job management
  async getJob(id: string) {
    const response = await client.get(`/jobs/${id}`);
    return response.data;
  },

  async updateJob(id: string, dto: Partial<{
    title: string;
    description: string;
    requiredSkills: string[];
    niceToHaveSkills: string[];
    workModel?: string;
    location?: string;
    seniority?: string;
    salaryMin?: number;
    salaryMax?: number;
  }>) {
    const response = await client.patch(`/jobs/${id}`, dto);
    return response.data;
  },

  async setJobStatus(id: string, status: "draft" | "open" | "paused" | "closed") {
    const response = await client.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  async deleteJob(id: string) {
    const response = await client.delete(`/jobs/${id}`);
    return response.data;
  },
};
