import React, { useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { axiosUrls } from "../../api/axios";

const BestandOpladen = () => {
    const axiosPrivate = useAxiosPrivate();
    const [file, setFile] = useState(null)
const [progress, setProgress]=useState({started:false,procent:0})

    const handleUpload = async ()=>{
        if(!file){
            return;
        }
        setProgress(prevState=>{return {...prevState,started:true}})
        const fd = new FormData();
        fd.append('file',file)
       await axiosPrivate.post(axiosUrls('PostBestand'),fd,{
            onUploadProgress:(ProgressEvent)=>{
                console.log(ProgressEvent.progress*100)
                setProgress(prevState=> {return {...prevState,pc:ProgressEvent.progress*100}})
            }
        })
        .then(res =>console.log(res.data))
        .catch(err=>console.log(err))

    }
  return (
    <section>
       <div>Bestand Opladen</div> 
       <input type="file" onChange={(e)=>{setFile(e.target.files[0])}}/>
       <button onClick={handleUpload}>Opladen</button>
       <p>Vooruitgang: {progress.procent} %</p>
       <p>
        {progress.started && <progress max="100" value={progress.procent}></progress>}
       </p>
    </section>
    
  )
}

export default BestandOpladen