import { getSession } from "next-auth/react";
interface ParsedProject {
    _id: string;
    title: { en: string; ar: string };
    type: "Residential" | "Commercial";
    description: { en: string; ar: string };
    image: string[];
    status: { en: string; ar: string }; // Correct type for the parsed object
    location: { en: string; ar: string };
    completionDate?: string;
    features: { en: string[]; ar: string[] };
}

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

    const res = await fetch(
        `https://api.elqasr-development.com/api/projects?${params.toString()}`
    );
    const json = await res.json();

    if (json.success) {
        // Backend already returns proper objects, no JSON.parse needed
        return { ...json, data: json.data as ParsedProject[] };
    }

    return { data: [], totalPages: 0, currentPage: 1 };
};


export const getSingleProject = async (id: string) => {
    try {
        const res = await fetch(
            `https://api.elqasr-development.com/api/projects/${id}`,
            { cache: "no-store" }
        );

        if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);
        const json = await res.json();

        const project = json.data ?? null;
        if (!project) return null;

        // No parsing needed, project already contains objects
        return {
            ...project,
            status: project.status?.en?.toLowerCase() ?? "",
            type: project.type?.toLowerCase() ?? "",
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

    const res = await fetch("https://api.elqasr-development.com/api/projects", {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${session.user.token}`,
        },
        credentials: "include",
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

    const res = await fetch(`https://api.elqasr-development.com/api/projects/${id}`, { // ✅ include ID in URL
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
    const res = await fetch(`https://api.elqasr-development.com/api/projects/${id}`, {
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

