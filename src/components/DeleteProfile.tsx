"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { Button } from "react-bootstrap"
import { toast } from "react-toastify";


type DeleteProfileProps = {
  refresh: () => void; 
};

function DeleteProfile({refresh}:DeleteProfileProps ) {
    const router = useRouter();
        const { status, data } = useSession();
    const [success, setSuccess] = useState<boolean>(false)
  

    const handleDeleteProfile = async() => {
       
        if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            return; // Stop execution if the user cancels
          }
try {
    if (data?.user?.id)
   { const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      const response= await fetch(`http://localhost:3000/api/users/${data.user.id}`, requestOptions);
      const result= await response.json();
      refresh();

      if (result.success) {
    
            toast.success("Delete succesfull!  You'll be redirected in 3 seconds.", {
              position: "top-right",
              autoClose: 3000,
            });
            setTimeout(() => {
              router.push("/");
            }, 3000);
            return;
          }
        }
     
      } catch (error) {
    console.log(error);
}
       }
  return (
    <>
    <Button size="sm" variant="outline-danger" onClick={handleDeleteProfile}>Delete</Button>
    </>
  )
}

export default DeleteProfile