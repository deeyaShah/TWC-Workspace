// const Products = () => {
//   return (
//     <div>
//       <div className="container mx-auto p-6">
//         <h1 className="text-4xl font-bold text-gray-800">Furniture Products</h1>
//         <p className="text-lg text-gray-600 mt-4">List of furniture products will be displayed here.</p>
//       </div>
//     </div>
//   );
// };

// export default Products;

import './Product.css';

function Product({title,thumbnail,Description,Rating,Price})
{
  return(
    <>
    <div className='product-list'>
    <div className='product-container'>
      <div className='pic'>
        <img src={thumbnail}/>
      </div>
      <div className='title'>Title: {title}</div>
      <div className='discription'>Discription: {Description}</div>
      <div className='custom'>Price :{Price}</div>
      <div className='rating'>Rating:{Rating}</div>
    </div>
    </div>
    </>
  )
}

export default Product;
