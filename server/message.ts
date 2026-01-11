export const sendMessage = async (formData: FormData) => {
       const res = await fetch(
         `${process.env.Zapier_URL}`,
         {
           method: "POST",
           mode: "cors",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(Object.fromEntries(formData)),
         }
       );
       return res;  
};