import Placeholder from 'react-bootstrap/Placeholder';


const SuspenseParagraaf = () => {
  return (
    <div className="d-flex justify-content-around">

        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>

  </div>
  )
}

export default SuspenseParagraaf