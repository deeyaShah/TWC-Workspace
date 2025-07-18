import { useEffect,useState } from "react";
import Product from './Product';
import axios from 'axios';

const ProductList=()=>{
    const [products, setProduct]=useState([]);

    const getProducts=async()=>{
        const res=await axios.get('https://twc-workspace.onrender.com/Products/api1/v2');
        setProduct(res.data);
    }
    useEffect(()=>{
        getProducts();
    },[]);
    return(
        <>
        {products.map((product,index)=>(
            <Product {...product} key={index}></Product>
        ))}
        </>
    )
}
export default ProductList;
