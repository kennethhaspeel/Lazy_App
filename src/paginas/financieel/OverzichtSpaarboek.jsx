import { useState, useEffect } from 'react';
import { axiosUrls } from '../../api/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns'
import SuspenseParagraaf from '../../components/SuspenseParagraaf';


const OverzichtSpaarboek = () => {

  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true)
  const [transacties, setTransacties] = useState([])
  const [saldo, setSaldo]= useState(0)

  useEffect(() => {
    const controller = new AbortController();
    const getTransactions = async () => {
      try {
        const response = await axiosPrivate.get(`${axiosUrls('GetOverzichtTransacties')}?volledigoverzicht=false`, {
          signal: controller.signal
        });
        console.log(response.data)
        setTransacties(response.data);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    }

    getTransactions();

    return () => {

      controller.abort();
    }
  }, [])
  useEffect(()=>{
    let totaal = 0
    if(transacties.length > 0){
      transacties.map(t=>totaal += t.bedrag)
    }
    setSaldo(totaal)

  },[transacties])

  return (
    <>
      
      {
        isLoading ? (
          <SuspenseParagraaf/>
        ) : (
          <>
          <h2>{transacties?.length ? (`${transacties.length} transactie(s)`) : "Nog geen transacties"}</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Uw saldo:</th>
                  <th colSpan={2}>&euro;&nbsp;{saldo}</th>
                </tr>
                <tr>
                  <th className='text-center col-lg-3'>Datum</th>
                  <th className='text-end pe-5 col-lg-3'>Bedrag</th>
                  <th className='col-lg-6'>Omschrijving</th>
                </tr>
              </thead>
              <tbody>
                {
                  !transacties.lenght ?
                    (
                      transacties.map((transactie) => (
                        <tr key={transactie.id}>
                          <td className='text-center'>{format(parseISO(transactie.datum), 'dd/MM/yyyy')}</td>
                          <td className='text-end pe-5'>{transactie.bedrag}</td>
                          <td>{transactie.mededeling}</td>
                        </tr>

                      ))
                    )
                    :
                    (
                      <tr><td colSpan={3} className='text-center'>Niets gevonden</td></tr>
                    )
                }

              </tbody>
            </Table>
          </>


        )

      }
    </>

  )
}

export default OverzichtSpaarboek