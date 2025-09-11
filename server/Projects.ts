
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
export const getAllProjects = async () => {
    const res = await fetch('http://localhost:3000/api/projects');
    const json = await res.json();
    return Array.isArray(json) ? json : json.data;
}

export const getSingleProject = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/projects/${id}`);
    const json = await res.json();
    return Array.isArray(json) ? json : json.data;
}

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