import Image from 'react-bootstrap/Image';

const Home = () => {
  let basisurl = window.location.hostname ==='localhost' ? 'development' : 'production'
  console.log(basisurl)
  return (
    <div className='pt-2 pb-2 text-center'>
        <Image src="afbeeldingen/banner.png" fluid />
    </div>
  )
}

export default Home