export const sendMessage = async (formData: FormData) => {
       const res = await fetch(
         "https://hooks.zapier.com/hooks/catch/25867827/uwul3yq/",
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