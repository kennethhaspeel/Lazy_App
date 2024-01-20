import { useState, useEffect, useRef } from 'react'
import { axiosUrls } from '../../api/axios'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Alert, Col, Row, Spinner } from 'react-bootstrap'
import { format,parse,isValid } from 'date-fns'
import useAuth from "../../hooks/useAuth"

const NieuweMissie = () => {
    const { auth } = useAuth()
    const currentUser = auth?.user
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(true)
    const [allesInOrde, setAllesInOrde] = useState(true)
    const [foutmelding, setFoutmelding] = useState([])
    const [allesBewaard, setAllesBewaard] = useState(false)

    const [titel, setTitel] = useState('')
    const [omschrijving, setOmschrijving] = useState('')
    const [locatie, setLocatie] = useState('')
    const [users, setUsers] = useState([])
    const [startdatum, setStartdatum] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [einddatum, setEinddatum] = useState(format(new Date(), 'yyyy-MM-dd'))

    const paginaHoofd = useRef(null)

    useEffect(() => {
        const controller = new AbortController();
        let userlist = []
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`${axiosUrls('GetAllUsers')}`, {
                    signal: controller.signal
                });
                response.data.map((u) => {
                    userlist.push({
                        id: u.id,
                        naam: u.volledigeNaam,
                        organisator: u.id == currentUser.id ? true : false
                    })
                })
                console.log(userlist)
                setUsers(userlist);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        }
        getUsers();
        return () => {
            controller.abort();
        }
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(startdatum)
        const datumb = isValid(parse(startdatum,"yyyy-MM-dd",new Date()))
        console.log(datumb)
        setAllesInOrde(true)
        setFoutmelding([])


        if(!titel.length){
            setAllesInOrde(false);
            setFoutmelding(foutmelding => [...foutmelding, "Titel: Iedere missie verdient een titeltje"])
        }
        if(!omschrijving.length){
            setAllesInOrde(false);
            setFoutmelding(foutmelding => [...foutmelding, "Omschrijving: klein beetje moeite mag wel"])
        }
        if(!locatie.length){
            setAllesInOrde(false);
            setFoutmelding(foutmelding => [...foutmelding, "Locatie: een missie zonder doel is ook maar dwaas. We zijn het Belgisch leger niet"])
        }

        if (!isValid(parse(startdatum, "yyyy-MM-dd", new Date()))) {
            setAllesInOrde(false);
            setFoutmelding(foutmelding => [...foutmelding, "Begindatum: er lijkt iets niet te kloppen met de begindatum"])
        }
        if (!isValid(parse(einddatum, "yyyy-MM-dd", new Date()))) {
            setAllesInOrde(false);
            setFoutmelding(foutmelding => [...foutmelding, "Einddatum: er lijkt iets niet te kloppen met de einddatum"])
        }
        let heeftOrganisator = false
        users.forEach(u=>{
            if(u.organisator){
                heeftOrganisator = true
                return
            }
            return
        })
        if(!heeftOrganisator){
            setAllesInOrde(false);
            setFoutmelding(foutmelding => [...foutmelding, "Iedere missie heeft op zijn minst 1 organisator nodig"])
        }
        paginaHoofd.current.scrollIntoView()
        if(allesInOrde){
            setIsLoading(true)
            let data = JSON.stringify({ 
               titel,omschrijving,startdatum,einddatum,locatie,publiekzichtbaar:false,missiedeelnemers:users 
            })
            const controller = new AbortController();
            const bewaarMissie= async () => {
                try {
                    const response = await axiosPrivate.post(`${axiosUrls('NieuweMissie')}`, data, {
                        signal: controller.signal
                    });
                    console.log(response.data)
                    setAllesBewaard(true)
                    setIsLoading(false);
                } catch (err) {
                    console.error(err);
                    setIsLoading(false);
                }

            }
            bewaarMissie();
            return () => {
      
                controller.abort();
              }
        }
    }

    const handleToggle = (id) => {
        const list = users.map(obj => {
            if (obj.id === id) {
                return { ...obj, organisator: !obj.organisator }
            }
            return obj
        })
        setUsers(list)
    }
    return (
        <>
            <h2 ref={paginaHoofd}>Nieuwe missie aanmaken</h2>
            <span>
                {
                    isLoading ?
                        (
                            <Alert variant='light'>
                                Even geduld ... <Spinner animation="border" variant="primary" />
                            </Alert>
                        )
                        :
                        ('')
                }
            </span>
            <span>
                {allesBewaard ?
                    (
                        <Alert variant='success'>
                            <p>De missie werd bewaard...</p>
                        </Alert>
                    )
                    :
                    ('')
                }
            </span>
            <span>
                {
                    !allesInOrde ? (
                        <Alert variant='danger' id="alertFout">
                            <ul>
                                {
                                    foutmelding.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))
                                }
                            </ul>
                        </Alert>
                    )
                        : ('')
                }
            </span>
            <form onSubmit={handleSubmit} className='mb-4'>
                <Form.Group className="mb-3">
                    <Form.Label>Titel</Form.Label>
                    <Form.Control
                        id="formTitel"
                        type="text"
                        onChange={(e) => setTitel(e.target.value)}
                        value={titel}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Locatie</Form.Label>
                    <Form.Control
                        id="formLocatie"
                        type="text"
                        onChange={(e) => setLocatie(e.target.value)}
                        value={locatie}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Omschrijving</Form.Label>
                    <Form.Control as="textarea"
                        id="formOmschrijving"
                        rows={3}
                        onChange={(e) => setOmschrijving(e.target.value)}
                        value={omschrijving}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Startdatum</Form.Label>
                    <Form.Control
                        id="formDatumStart"
                        type="date"
                        onChange={(e) => setStartdatum(e.target.value)}
                        value={startdatum}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Einddatum</Form.Label>
                    <Form.Control
                        id="formDatumEinde"
                        type="date"
                        onChange={(e) => setEinddatum(e.target.value)}
                        value={einddatum}
                    />
                </Form.Group>
                <hr />
                <h4>Organisatoren</h4>
                <Form.Group>
                    {
                        users?.length ? (
                            users.map((user) => (
                                <Form.Check // prettier-ignore
                                    type='checkbox'
                                    name='chkOrganisator'
                                    id={user.id}
                                    key={user.id}
                                    label={user.naam}
                                    defaultChecked={user.organisator ? true : false}
                                    onChange={()=>{handleToggle(user.id)}}
                                />
                            ))
                        )
                            :
                            ('')
                    }
                </Form.Group>
                <hr />
                <Button variant="primary" type="submit">
                    Verstuur
                </Button>
            </form>
        </>

    )
}

export default NieuweMissie