
import { axiosUrls } from '../../../api/axios';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useState, useEffect } from 'react'
import { DateToYYYYMMDD, DateToDDMMYYYY } from '../../../components/DatumFuncties';
import Alert from 'react-bootstrap/Alert'

const EtappeComponent = ({ missieid, datum ,index}) => {
    // console.log(missieid)
    // console.log(datum)
    // console.log(IsoToC(datum))
//console.log(index)

    const axiosPrivate = useAxiosPrivate();
    const [rijen, setRijen] = useState([])

    useEffect(() => {
        const controller = new AbortController();
        const getEtappes = async () => {
            const response = await axiosPrivate.get(`${axiosUrls('GetEtappesPerDag')}?missieid=${missieid}&datum=${DateToYYYYMMDD(datum)}`, {
                signal: controller.signal
            });
            console.log(response.data)
            setRijen(response.data);
        }
        getEtappes();
        return () => {
            controller.abort();
        }
    }, [])

    return (
        <>
            <div className="alert alert-primary" role="alert">
                {
                    index === 0 ? ('Algemeen') : DateToDDMMYYYY(datum)
                }
                
            </div>
            {
                rijen.length ? (
                    rijen.map(rij => (
                        <p key={rij.id}>{rij.titel}</p>
                    ))

                ) : (
                    <div className='pb-2'>Geen gegevens</div>
                )

            }

        </>

    )
}

export default EtappeComponent