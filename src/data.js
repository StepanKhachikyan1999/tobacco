// import araratExclusiveImg from './images/Ararat_Exclusive.png';
import araratSevMets from './images/Ararat_sev_mets.png';
import araratWhiteBigImg from './images/Ararat_Spitat_mets.png';

export const tobaccoData = [
  {
    id: 'GT',
    name: 'Grand Tobacco',
    prefix: 'GT',
    products: [
      {
        id: 1,
        mark: "Big",
        price: 1600,
        name: "Ararat Black",
        image: araratSevMets
      },
      {
        id: 2,
        mark: "Big",
        price: 1600,
        name: "Ararat Exclusive",
        image: araratWhiteBigImg
      },
      {
        id: 3,
        mark: "Ararat Sev Mets",
        price: 1200,
        name: "Ararat Sev Mets",
        image: araratSevMets
      }
    ]
  },
  { id: 'Davidoff', name: 'Davidoff', prefix: 'Davidoff', products: [] },
  { id: 'Kent', name: 'Kent', prefix: 'Kent', products: [] },
  { id: 'PM', name: 'Phillip Moris', prefix: 'PM', products: [] },
  { id: 'Winston', name: 'Winston', prefix: 'Winston', products: [] },
];
