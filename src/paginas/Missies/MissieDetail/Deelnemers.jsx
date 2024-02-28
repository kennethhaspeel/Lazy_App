import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

import useSWR from "swr"
import { Row, Col, Button } from 'react-bootstrap'
import { FaTrash, FaPlus } from 'react-icons/fa6'
import SuspenseParagraaf from '../../../components/SuspenseParagraaf'

const Deelnemers = ({ missieid }) => {

    const axiosPrivate = useAxiosPrivate();
    const { data: users, isLoading, isValidating } =
        useSWR(`MissieDeelnemers_${missieid}`, async () => { const response = await axiosPrivate(`${axiosUrls('MissieDeelnemers')}/${missieid}`); return response.data }, {
            onSuccess(data, key, config) {
                console.log(data)
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (error.status === 404) return
                if (retryCount >= 3) return
                revalidate({ retryCount })
            }
        })
    return (
        <>
            {
                isLoading || isValidating ? (<SuspenseParagraaf />)  :
                    (
                        users?.length ? (
                            <Row className="mb-3">
                                <Col md={2} sm={12} >Organisatoren <Button variant="info" onClick={() => { setShowModalSelectOrganisator(true) }} ><FaPlus /></Button></Col>
                                <Col md={8} sm={12}>
                                    {
                                        users.filter((u) => { if (u.isOrganisator) { return true } else { return false } }).map((u) => (
                                            <Button key={u.id} variant="danger" className='me-2 mb-2' onClick={() => { ToggleOrganisator(u.id); setSaveEdits(true) }}>
                                                <FaTrash /> {u.volledigeNaam}
                                            </Button>
                                        ))
                                    }
                                </Col>
                            </Row>
                        ) : ('')
                    )
            }
        </>
    )
}

export default Deelnemers