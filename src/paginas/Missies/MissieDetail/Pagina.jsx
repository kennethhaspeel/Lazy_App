import { useSearchParams } from 'react-router-dom'
import { useState, useEffect, Suspense } from 'react'
import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import { tempData } from './tempData'
import { CheckCurrentUser } from './functies'
import DetailComponent from './Details'
import Deelnemers from './Deelnemers'
import EtappeComponent from './Etappes'
import Alert from 'react-bootstrap/Alert'
import { format, parse, isValid } from 'date-fns'
import { GetMissieDagen, DateToDDMMYYYY, HHMM_To_date, CompareDates } from '../../../components/DatumFuncties'
import SuspenseParagraaf from '../../../components/SuspenseParagraaf'

const Pagina = () => {
    const [queryParam] = useSearchParams()
    const missieid = queryParam.get("missieid")
    const { auth } = useAuth()
    const currentUser = auth?.user
    const [isOrganisator, setIsOrganisator] = useState(false)
    const [isDeelnemer, setIsDeelnemer] = useState(false)
    const axiosPrivate = useAxiosPrivate();

    const [missiedetail, setMissiedetail] = useState({})
    const [users, setUsers] = useState([])
    const [etappes, setEtappes] = useState([])

    return (
        <>
            <Alert variant='info'>
                <Alert.Heading>
                    Missie {missiedetail?.titel}
                </Alert.Heading>
            </Alert>
             <Alert variant='primary'>
                Details
            </Alert>
                <DetailComponent missieid={missieid} missiedetail={missiedetail} setMissiedetail={setMissiedetail} isOrganisator={isOrganisator} />
            
            <Alert variant='primary'>
                Deelnemers
            </Alert>
                {/* <Deelnemers users={users} setUsers={setUsers} isOrganisator={isOrganisator} setIsOrganisator={setIsOrganisator} setIsDeelnemer={setIsDeelnemer} missieid={missieid} currentUser={currentUser} /> */}
            <Alert variant='primary'>
                Etappes
            </Alert>
            <EtappeComponent etappes={etappes} setEtappes={setEtappes} isOrganisator={isOrganisator} missiedetail={missiedetail} missieid={missieid} />
       <hr/>
        </>

    )
}

export default Pagina