interface Users {
    name:string,
    email:string,
    password:string,
}

export const signup = async (user:Users) => {
    const res = await fetch('http://localhost:3000/api/auth/signup',{
        method:'POST',
        body:JSON.stringify(user),
        headers:{
            'Content-Type':'application/json'
        }
    })
    return res.json().then(data=>{
        return data;
    })
}