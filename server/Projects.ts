
interface Project {
    id: string;
    title: string;
    type: 'Residential' | 'Commercial';
    description: string;
    image: string;
    status: 'completed' | 'in-progress' | 'planning';
    location: string;
    completionDate?: string;
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



export const CreateProject = async (project: Project)=>{
    const res = await fetch('http://localhost:3000/api/projects',{
        method:'POST',
        body:JSON.stringify(project),
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })
    return res.json();
}