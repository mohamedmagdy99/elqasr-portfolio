import { getSession } from "next-auth/react";

interface ParsedProject {
  _id: string;
  title: { en: string; ar: string };
  type: "Residential" | "Commercial";
  description: { en: string; ar: string };
  image: string[];
  state: string;
  location: { en: string; ar: string };
}
export const getSingleMainProject = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/main-projects/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch main project: ${res.status}`);
  const json = await res.json();
  return json.data;
};

export const getAllProjectsForMain = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/main/${id}`
  );
  if (!res.ok)
    throw new Error(`Failed to fetch projects for main project: ${res.status}`);
  const json = await res.json();
  return json.data;
};
export const getAllMainProjects = async ({
  page = 1,
  limit = 10,
  state,
  type,
}: {
  page?: number;
  limit?: number;
  state?: string;
  type?: string;
}) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (state) params.append("state", state);
  if (type) params.append("type", type);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/main-projects?${params}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch main projects");
  }
  const json = await res.json();

  if (json.success) {
    // Backend already returns proper objects, no JSON.parse needed
    return { ...json, data: json.data as ParsedProject[] };
  }

  return { data: [], totalPages: 0, currentPage: 1 };
};
export const updateMainProject = async (id: string, formData: FormData) => {
  const session = await getSession();
  const token = session?.user?.token;
  if (!token) throw new Error("No token found in session");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/main-projects/${id}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Failed to update main project: ${res.status} ${JSON.stringify(
        errorData
      )}`
    );
  }
  const json = await res.json();
  return json.data;
};
export const deleteMainProject = async (id: string) => {
  const session = await getSession();
  const token = session?.user?.token;
  if (!token) throw new Error("No token found in session");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/main-projects/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Failed to delete main project: ${res.status} ${JSON.stringify(
        errorData
      )}`
    );
  }
  return res.json();
}
export const createMainProject = async (formData: FormData) => {
  try {
        const session = await getSession();

    const token = session?.user?.token;
    if (!token) throw new Error("No token found in session");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/main-projects`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
        credentials: "include",
        body: formData,
      }
    );

    const json = await res.json();

    if (!res.ok) {
      // Handle backend validation errors (like the 'fields' array you have in your controller)
      throw new Error(json.err || "Failed to create project");
    }

    return json;
  } catch (error: any) {
    console.error("Create Project Error:", error);
    throw error;
  }
};