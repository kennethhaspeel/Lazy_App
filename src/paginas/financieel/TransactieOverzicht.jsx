import { useRef, useState, useEffect } from 'react';
import {axiosUrls} from '../../api/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Table,Alert, Spinner } from 'react-bootstrap';
import {format, parseISO} from 'date-fns'

const TransactieOverzicht = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading,setIsLoading] = useState(false)
  const [transacties,setTransacties]=useState([])

  useEffect(()=>{
    const controller = new AbortController();
    const getTransacties = async () => {
      try {
          const response = await axiosPrivate.get(`${ axiosUrls('GetOverzichtTransacties')}?volledigoverzicht=true`, {
              signal: controller.signal
          });
          console.log(response.data)
          setTransacties(response.data);
        } catch (err) {
          console.error(err);
        }
        setIsLoading(false);
      }
  
      getTransacties();
  
      return () => {
        
        controller.abort();
      }
    }, [])

    useEffect(()=>{
      if(transacties.length > 0){
        console.log('transacties not empty')
      }
      if(transacties.length == 0){
        console.log('transacties empty')
      }
    },[transacties])

  return (
    <>
      <h2>{transacties?.length ? (`${transacties.length} transactie(s)`) : "Nog geen transacties"}</h2>
      <div>
                {
                    isLoading ?
                        (
                            <Alert variant='light'>
                                <p>Even geduld ... <Spinner animation="border" variant="primary" /> </p>
                            </Alert>
                        )
                        :
                        ('')
                }
            </div>
            <div>
              {
                !transacties.lenght ? 
                (
                  <>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className='text-center col-md-2'>Datum</th>
                          <th className='col-md-3'>Naam</th>
                          <th className='text-end pe-5 col-md-2'>Bedrag</th>
                          <th className='col-lg-5'>Omschrijving</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          transacties.map((transactie) => (
                            <tr key={transactie.id}>
                              <td className='text-center'>{format(parseISO(transactie.datum),'dd/MM/yyyy') }</td>
                              <td>{transactie.volledigeNaam}</td>
                              <td className='text-end pe-5'>{transactie.bedrag}</td>
                              <td>{transactie.mededeling}</td>
                            </tr>
    
                          ))
                        }
                      </tbody>
                    </Table>
                    </>
                )
                : 
                (
                  <p>Niets gevonden... {transacties?.length}</p>
                )
              }
            </div>
    </>

  )
}

export default TransactieOverzicht