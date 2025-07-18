import { useEffect,useState } from "react";
import Kitchen from "./Kitchens";
import axios from 'axios';

const KitchenList=()=>{
    const [kitchens, setKitchenProduct]=useState([]);

    const getKitchenProduct=async()=>{
        const res=await axios.get('https://twc-workspace.onrender.com/Kitchen-Products/api2/v1');
        setKitchenProduct(res.data);
    }
    useEffect(()=>{
        getKitchenProduct();
    },[]);
    return(
        <>
        {kitchens.map((kitchen,index)=>(
            <Kitchen {...kitchen} key={index}></Kitchen>
        ))}
        </>
    )
}
export default KitchenList;