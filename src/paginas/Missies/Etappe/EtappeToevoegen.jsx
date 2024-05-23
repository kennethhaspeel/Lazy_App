import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { Form, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { HHMM_To_date, DateToDDMMYYYY, GetTijdFromDate } from '../../../components/DatumFuncties';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { set } from 'date-fns';

const EtappeToevoegen = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient()
    const from = location.state?.from?.pathname || "/";
    const [queryParam] = useSearchParams()
    const missieId = queryParam.get("missieid")
    const etappeDatum = queryParam.get("etappedatum")
    const [show, setShow] = useState(false);
    const [verschuldigdDoor, setVerschuldigdDoor] = useState(false)
    const [zonderKost,setZonderKost]= useState(false)

    const [nieuweEtappe, setNieuweEtappe] = useState({
        missieid: missieId,
        bedrag: 0,
        titel: "",
        locatie: "",
        datum: new Date(etappeDatum),
        startUur: GetTijdFromDate(new Date()),
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
            console.log(response.data)
            let arr = Array.from(response?.data.filter((deel) => deel.isDeelnemer || deel.isOrganisator), (x) => x.id)
            setNieuweEtappe({ ...nieuweEtappe, verschuldigdDoor: arr })
            return response.data;
        },
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: async (kost) => {
          console.log(kost)
          return axiosPrivate.post(axiosUrls("PostMissieEtappe"), kost);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["missieetappes", missieId]);
            setShow(true)
        },
      });

    const bewaarNieuweEtappe = (e) => {
        e.preventDefault();
        console.log(nieuweEtappe);
        const form = document.getElementById("formNieuweEtappe");
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        const postData = {
            missieId: missieId,
            titel: nieuweEtappe.titel,
            locatie: nieuweEtappe.locatie,
            Datum: HHMM_To_date(
                DateToDDMMYYYY(nieuweEtappe.datum),
                nieuweEtappe.startUur
            ),
            bedrag: nieuweEtappe.bedrag,
            betaalddoor: nieuweEtappe.betaaldDoor,
            verschuldigddoor: nieuweEtappe.verschuldigdDoor,
            zonderkost: zonderKost
        };
         mutate(postData)
    }

    const handleVerschuldChange = (e) => {
        let arr
        if (e.target.checked) {
          arr = [...nieuweEtappe.verschuldigdDoor, e.target.value]
        } else {
          arr = nieuweEtappe.verschuldigdDoor.filter(a => a !== e.target.value)
          
        }
        setNieuweEtappe({ ...nieuweEtappe, verschuldigdDoor: arr })
        console.log(arr)
      }
    return (
        <>
            <Form className="pt-1" id="formNieuweEtappe" onSubmit={bewaarNieuweEtappe}>
                <Form.Group className="mb-3">
                    <Form.Label>Titel</Form.Label>
                    <Form.Control
                        type="text"
                        id="titel"
                        autoComplete="off"
                        value={nieuweEtappe.titel}
                        placeholder="Geef een titel"
                        onChange={(e) =>
                            setNieuweEtappe({ ...nieuweEtappe, titel: e.target.value })
                        }
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Locatie</Form.Label>
                    <Form.Control
                        type="text"
                        id="locatie"
                        autoComplete="off"
                        value={nieuweEtappe.locatie}
                        placeholder="Wat is de algemene locatie"
                        onChange={(e) =>
                            setNieuweEtappe({ ...nieuweEtappe, locatie: e.target.value })
                        }
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tijdstip</Form.Label>
                    <Form.Control
                        type="time"
                        id="startdatum"
                        autoComplete="off"
                        value={nieuweEtappe.startUur}
                        onChange={(e) =>
                            setNieuweEtappe({
                                ...nieuweEtappe,
                                startUur: e.target.value
                            })
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
        <div hidden={zonderKost}>
                <Form.Group className="mb-3">
                    <Form.Label>Bedrag</Form.Label>
                    <Form.Control
                        type="number"
                        id="bedrag"
                        autoComplete="off"
                        value={nieuweEtappe.bedrag}
                        onChange={(e) =>
                            setNieuweEtappe({ ...nieuweEtappe, bedrag: e.target.value })
                        }
                        step="0.01"
                        required={!zonderKost}
                    ></Form.Control>
                </Form.Group>
                <hr />
                <Form.Group className="mb-3">
                    <Form.Label>Betaald door</Form.Label>
                    <Form.Select
                    onChange={(e) => {
                            setNieuweEtappe({ ...nieuweEtappe, betaaldDoor: e.target.value })
                            console.log(e.target.value)
                        }
                        }
                    >
                        <option 
                        value="a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1" 
                        key="a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1"
                        
                        >Rekening</option>
                        {
                            missiedeelnemers?.filter((deel) => deel.isDeelnemer || deel.isOrganisator).map((deel) => {
                                return (
                                    <option
                                        key={deel.id}
                                        value={deel.id}
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
                        missiedeelnemers?.filter((deel) => deel.isDeelnemer || deel.isOrganisator).map((deel) => {
                            return (
                                <Form.Check
                                    className='ms-3'
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
                </div>
                <hr />
                <Button variant="primary" type="submit">
                    Bewaar
                </Button>
            </Form>
            <Modal show={show}>
                <Modal.Header>
                    Bestand Toevoegen?
                </Modal.Header>
                <Modal.Body>
                    <p>Wilt u bewijsstukken toevoegen voor deze etappe?</p>
                    <p>Dit kan ook nog later toegevoegd worden</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>(navigate(`/missie/missiedetail?missieid=${missieId}`, { replace: true }))}>
                        Terug naar missie
                    </Button>
                    <Button variant="primary" disabled onClick={()=>(navigate(`/missie/missiedetail?missieid=${missieId}`, { replace: true }))}>
                        Bewijsstuk toevoegen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EtappeToevoegen