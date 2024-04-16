import { useSearchParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Modal, Form,Button } from "react-bootstrap"
import { useState } from "react"
import { GetTijdFromDate } from "../../../components/DatumFuncties"
const KostToevoegen = () => {

  const queryClient = useQueryClient()
  const [queryParam] = useSearchParams()
  const etappeId = queryParam.get("etappeid")
  const missieId = queryParam.get("missieid")
  const data = queryClient.getQueryData(["missiedeelnemers", missieId])
const [verschuldigdDoor, setVerschuldigdDoor]=useState(false)
  const [nieuweKost, setNieuweKost] = useState({
    etappeId: etappeId,
    bedrag: 0,
    titel: "",
    locatie: "",
    startUur: GetTijdFromDate(''),
    eindUur: GetTijdFromDate(''),
    betaaldDoor:'',
    verschuldigdDoor: Array.from(data, (x)=> x.id)
  });

  const BewaarEtappeKostNieuw = (e) => {
    console.log(nieuweKost)
    e.preventDefault()
    const form = document.getElementById('formNieuweKost');
    if (form.checkValidity() === false) {
      e.stopPropagation();

    }

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

  const buttonClick = ()=>{
    console.log(nieuweKost.verschuldigdDoor)
  }

  return (
    <>
      <h4>Kost Toevoegen</h4>
      <Form id="formNieuweKost" className="pt-1" onSubmit={BewaarEtappeKostNieuw}>
        <Form.Group className="mb-3">
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
        <Form.Group className="mb-3">
          <Form.Label>Bedrag</Form.Label>
          <Form.Control
            type="number"
            id="titel"
            autoComplete="off"
            value={nieuweKost.bedrag}
            onChange={(e) =>
              setNieuweKost({ ...nieuweKost, bedrag: e.target.value })
            }
            min="0.01"
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Startdatum</Form.Label>
          <Form.Control
            type="time"
            id="startdatum"
            autoComplete="off"
            value={nieuweKost.startUur}
            onChange={(e) =>
              setNieuweKost({
                ...nieuweKost,
                startUur: e.target.value,
                eindUur: e.target.value,
              })
            }
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Einddatum</Form.Label>
          <Form.Control
            type="time"
            id="einddatum"
            autoComplete="off"
            value={nieuweKost.eindUur}
            onChange={(e) =>
              setNieuweKost({ ...nieuweKost, eindUur: e.target.value })
            }
            required
          ></Form.Control>
        </Form.Group>
        <hr/>
        <Form.Group className="mb-3">
          <Form.Label>Betaald door</Form.Label>
          <Form.Select>
            <option value="a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1" key="a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1">Rekening</option>
            {
              data?.map((deel) => {
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
              data?.map((deel) => {
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
            <Button variant="primary" type="button" onClick={buttonClick} >
              Bewaar
            </Button>
      </Form>
    </>
  )
}

export default KostToevoegen