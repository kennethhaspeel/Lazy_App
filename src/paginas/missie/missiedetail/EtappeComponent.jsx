
import { axiosUrls } from '../../../api/axios';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useState, useEffect } from 'react'
import { DateToYYYYMMDD, DateToDDMMYYYY } from '../../../components/DatumFuncties';
import SuspenseParagraaf from '../../../components/SuspenseParagraaf';
import Alert from 'react-bootstrap/Alert'

const EtappeComponent = ({ missieid, datum, index }) => {
    // console.log(missieid)
    // console.log(datum)
    // console.log(IsoToC(datum))
    //console.log(index)

    const axiosPrivate = useAxiosPrivate();
    const [rijen, setRijen] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController();
        const getEtappes = async () => {
            const response = await axiosPrivate.get(`${axiosUrls('GetEtappesPerDag')}?missieid=${missieid}&datum=${DateToYYYYMMDD(datum)}`, {
                signal: controller.signal
            });
            console.log(response.data)
            setRijen(response.data);
            setIsLoading(false)
        }
        setTimeout(() => {
            getEtappes();
        }, "3000");
        


        return () => {
            controller.abort();
        }
    }, [])

    return (
        <>

            {
                isLoading ? (
                    <div className='pb-3'>
                        <SuspenseParagraaf />
                    </div>
                    
                ) : (
                    rijen.length ?
                        (rijen.map(rij => (<p key={rij.id}>{rij.titel}</p>))) :
                        (<p>Geen gegevens</p>)


                )



            }

        </>

    )
}

export default EtappeComponent