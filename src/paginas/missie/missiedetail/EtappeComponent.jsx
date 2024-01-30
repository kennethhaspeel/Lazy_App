
const EtappeComponent = ({ etappelijst, datum, index }) => {
    return (
        <>
            {
                    etappelijst.length ?
                        (etappelijst.map(rij => (<p key={rij.id}>{rij.titel}</p>))) :
                        (<p>Geen gegevens</p>)
            }
        </>

    )
}

export default EtappeComponent