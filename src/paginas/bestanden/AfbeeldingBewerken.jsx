import  Resizer  from 'react-image-file-resizer'

export const AfbeeldingVerkleinen = (afb,breedte,hoogte,kwaliteit) => {
   return new Promise((resolve) => {
        Resizer.imageFileResizer(
          afb,
          breedte,
          hoogte,
          "JPEG",
          kwaliteit,
          0,
          (uri) => {
            resolve(uri);
          },
          "file"
        );
      });

}