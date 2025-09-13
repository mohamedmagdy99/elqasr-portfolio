import { getSession } from "next-auth/react";
export const getAllProjects = async ({
                                         page = 1,
                                         limit = 10,
                                         status,
                                         type,
                                     }: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (status) params.append("status", status);
    if (type) params.append("type", type);

    const res = await fetch(`http://localhost:3000/api/projects?${params.toString()}`);
    const json = await res.json();
    return json.success ? json : { data: [], totalPages: 0, currentPage: 1 };
};


export const getSingleProject = async (id: string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);
        const json = await res.json();

        const project = json.data ?? null;

        if (!project) return null;

        return {
            ...project,
            status: project.status?.toLowerCase(),   // "Completed" → "completed"
            type: project.type?.toLowerCase(),       // "Residential" → "residential"
        };
    } catch (error) {
        console.error("getSingleProject error:", error);
        return null;
    }
};
export const CreateProject = async (formData: FormData) => {
    const session = await getSession();
    const token = session?.user?.token;
    if (!token) throw new Error("No token found in session");

    const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${session.user.token}`, // ✅ send token manually
        },
        credentials: "include", // ✅ important
    });
    console.log("Fetch called");
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to create project: ${res.status} ${JSON.stringify(errorData)}`);
    }

    return res.json();
};
export const UpdateProject = async (id: string, formData: FormData) => {
    const session = await getSession();
    const token = session?.user?.token;

    if (!token) throw new Error("No token found in session");

    const res = await fetch(`http://localhost:3000/api/projects/${id}`, { // ✅ include ID in URL
        method: "PUT",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`, // use token here
        },
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to update project: ${res.status} ${JSON.stringify(errorData)}`);
    }

    return res.json();
};
export const DeleteProject = async (id: string) => {
    const session = await getSession();
    const token = session?.user?.token;
    if (!token) throw new Error("No token found in session");
    const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to delete project: ${res.status} ${JSON.stringify(errorData)}`);
    }
}

