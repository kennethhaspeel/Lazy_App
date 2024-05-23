import { useSearchParams } from "react-router-dom"
import { Modal, Form, Button } from "react-bootstrap"
import { useState } from "react"
import { GetTijdFromDate } from "../../../components/DatumFuncties"
import { useMutation,useQueryClient, useQuery } from "@tanstack/react-query"
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";

const KostToevoegen = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const [queryParam] = useSearchParams()
  const etappeId = queryParam.get("etappeid")
  const missieId = queryParam.get("missieid")

  const [zonderKost,setZonderKost]= useState(false)
  const [verschuldigdDoor, setVerschuldigdDoor] = useState(false)
  const [nieuweKost, setNieuweKost] = useState({
    etappeId: etappeId,
    missieId: missieId,
    bedrag: 0,
    titel: "",
    locatie: "",
    betaaldDoor: 'a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1',
    verschuldigdDoor: []
  });
  const {
    data: missiedeelnemers,
    isLoading: DeelnemersLoading,
    isError: DeelnemersError,
  } = useQuery({
    queryKey: ["missiedeelnemers", missieId],
    queryFn: async () => {
      const url = `${axiosUrls("GetMissieDeelnemers")}/${missieId}`;
      const response = await axiosPrivate.get(url);
      // console.log(response.data)
      let arr = Array.from(response?.data.filter((deel)=>deel.isDeelnemer || deel.isOrganisator),(x)=>x.id)
      setNieuweKost({...nieuweKost, verschuldigdDoor: arr})
      return response.data;
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (kost) => {
      console.log(kost)
      return axiosPrivate.post(axiosUrls("PostMissieEtappeKost"), kost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["missieetappekost", missieId]);
      navigate(`/missie/missiedetail?missieid=${missieId}`, { replace: true });
    },
  });


  const BewaarEtappeKostNieuw = (e) => {
   
    e.preventDefault()

    const form = document.getElementById('formNieuweKost');
     console.log(form.checkValidity() )
    if (form.checkValidity() === false) {
      e.stopPropagation();

    }
    mutate(nieuweKost)
  }

  const handleVerschuldChange = (e) => {
    let arr
    if (e.target.checked) {
      arr = [...nieuweKost.verschuldigdDoor, e.target.value]
    } else {
      arr = nieuweKost.verschuldigdDoor.filter(a => a !== e.target.value)
      console.log(arr)
    }
    setNieuweKost({ ...nieuweKost, verschuldigdDoor: arr })
  }

  const buttonClick = () => {
    console.log(nieuweKost.verschuldigdDoor)
  }
  if (isLoading) {
    return <p>Gegevens worden bewaard ...</p>
  }

  return (
    <>
      <h4>Kost Toevoegen</h4>
      <Form id="formNieuweKost" className="pt-1" onSubmit={BewaarEtappeKostNieuw}>
        <Form.Group className="mb-3" key={'group_titel'}>
          <Form.Label>Titel</Form.Label>
          <Form.Control
          
            type="text"
            id="titel"
            autoComplete="off"
            value={nieuweKost.titel}
            placeholder="Geef een titel"
            onChange={(e) =>
              setNieuweKost({ ...nieuweKost, titel: e.target.value })
            }
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3"  key={'group_zonderkost'}>
          <Form.Check
            inline
            label="Zonder kost"
            name="chkZonderKost"
            type='checkbox'
            checked={zonderKost}
            onChange={()=>{setZonderKost(prev=>!prev)}}
          />
        </Form.Group>
        <Form.Group className="mb-3" key={'group_bedrag'}>
          <Form.Label>Bedrag</Form.Label>
          <Form.Control
            type="number"
            id="titel"
            autoComplete="off"
            value={nieuweKost.bedrag}
            onChange={(e) =>
              setNieuweKost({ ...nieuweKost, bedrag: e.target.value })
            }
            step="0.01"
            required={!zonderKost}
          ></Form.Control>
        </Form.Group>
        <hr />
        <Form.Group className="mb-3" key={'group_BetaaldDoor'}>
          <Form.Label>Betaald door</Form.Label>
          <Form.Select>
            <option value="a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1" key="a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1">Rekening</option>
            {
              missiedeelnemers?.filter((deel)=>deel.isDeelnemer || deel.isOrganisator).map((deel) => {
                return (
                  <option
                    key={deel.id}
                    value={deel.id}
                    onChange={() => {
                      setNieuweKost({ ...nieuweKost, betaaldDoor: e.target.value })
                    }
                    }
                  >
                    {deel.volledigeNaam}

                  </option>
                )
              })
            }
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Verschuldigd door</Form.Label>
          {
            missiedeelnemers?.filter((deel)=>deel.isDeelnemer || deel.isOrganisator).map((deel) => {
              return (
                <Form.Check
                  type='checkbox'
                  value={deel.id}
                  key={deel.id}
                  label={deel.volledigeNaam}
                  isInvalid={verschuldigdDoor}
                  onChange={handleVerschuldChange}
                  defaultChecked={true}
                />
              )
            })
          }

        </Form.Group>
        <hr />
        <Button variant="primary" type="submit" >
          Bewaar
        </Button>
      </Form>
    </>
  )
}

export default KostToevoegen