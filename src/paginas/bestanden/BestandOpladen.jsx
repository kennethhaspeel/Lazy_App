import React, { useState } from "react";
import useAxiosPrivateFile from "../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../api/axios";
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const BestandOpladen = () => {
  const axiosPrivate = useAxiosPrivateFile();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [queryParam] = useSearchParams()
  const etappeId = queryParam.get("etappeid")
  const onderwerp = queryParam.get("onderwerp")

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ started: false, procent: 0 });

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    console.log(`Bestandsgrootte: ${file.size}`);
    setProgress((prevState) => {
      return { ...prevState, started: true };
    });
    const fd = new FormData();
    fd.append("file", file);
    fd.append("etappeId",etappeId)
    fd.append("onderwerp",onderwerp)
    await axiosPrivate
      .post(axiosUrls("PostBestand"), fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (ProgressEvent) => {
          console.log(ProgressEvent.progress * 100);
          setProgress((prevState) => {
            return { ...prevState, pc: ProgressEvent.progress * 100 };
          });
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };
  return (
    <section>
      <div>Bestand Opladen</div>
      <input
        type="file"
        onChange={(e) => {
            console.log(`Bestandsgrootte: ${e.target.files[0].size}`)
          setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Opladen</button>
      <p>Vooruitgang: {progress.procent} %</p>
      <p>
        {progress.started && (
          <progress max="100" value={progress.procent}></progress>
        )}
      </p>
    </section>
  );
};

export default BestandOpladen;
