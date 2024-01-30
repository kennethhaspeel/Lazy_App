import { GetMissieDagen,DateToDDMMYYYY } from "../../../components/DatumFuncties"
import { useState,useEffect } from "react"
import Card from 'react-bootstrap/Card'

const EtappeComponent = ({etappes, setEtappes, isOrganisator,missiedetail}) => {
    const [missiedagen, setMissiedagen] = useState([])

useEffect(()=>{
setMissiedagen(GetMissieDagen(missiedetail.startDatum,missiedetail.eindDatum))
},[missiedetail])



    
    
  return (
    <>
    {
      missiedagen.length ? (
        missiedagen.map((dag,index)=>(
          <div key={`div${index}`} className="ps-5">
            <Card key={`Card${index}`}>
             <Card.Body>{index === 0 ? ('Algemeen') :DateToDDMMYYYY(dag)}</Card.Body>
            </Card>
          </div>

        ))
      ) : (
        <p>Nog geen etappes</p>
      )
    }
    </>
  )
}

export default EtappeComponent