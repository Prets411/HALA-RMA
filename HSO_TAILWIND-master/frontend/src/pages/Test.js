import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

const Test = () =>{
    const [fetchError, setFetchError] = useState(null)
    const [announcements, setAnnouncements] = useState(null) 

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
            .from('announcements')
            .select()
            
            if (error){
                setFetchError("Error Fetching")
                setAnnouncements(null)
                console.log(error)
            }
            if(data){
                setAnnouncements(data)
                setFetchError(null)
            }
        }
        fetchAnnouncements()
    }, [])

return(
    <div>

    </div>
)}