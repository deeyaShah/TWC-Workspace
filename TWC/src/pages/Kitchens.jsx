// import Navbar from "./Navbar";

// const Kitchens = () => {
//   return (
//     <div>
//       {/* <Navbar /> */}
//       <div className="container mx-auto p-6">
//         <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Kitchens Page!</h1>
//         <p className="text-lg text-gray-600 mt-4">Explore modern kitchen designs and appliances.</p>
//       </div>
//     </div>
//   );
// };

// export default Kitchens;

import './Kitchens.css'

function Kitchen({title,thumbnail,Description,Rating,Price})
{
  return(
    <>
    <div className='Kitchen-list'>
    <div className='kitchen-container'>
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

export default Kitchen;
