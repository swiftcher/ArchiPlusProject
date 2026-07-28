import { useState } from "react";
import apiPrivate from "../api/apiPrivate";


export function useAdminProductsViewModel(){

    const [products,setProducts] = useState([]);
    const createProduct = async(product)=>{

    try{

    await apiPrivate.post(
    "/admin/products",
    product
    );


        }
    catch(err){

    console.log(
    "CREATE PRODUCT ERROR:",
    err
    );

    }

    };


    const loadProducts = async()=>{

        try{

            const res = await apiPrivate.get(
                "/admin/products"
            );

            setProducts(
                res.data?.data || []
            );


        }catch(err){

            console.error(
                "Load products error:",
                err
            );

        }

    };



    const deleteProduct = async(P_ID)=>{


        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );


        if(!confirmDelete)
            return;


        try{


            await apiPrivate.delete(
                `/admin/products/${P_ID}`
            );


            // refresh products
            loadProducts();


        }catch(err){

            console.error(
                "Delete product error:",
                err
            );

        }


    };



    const updateProduct = async(P_ID, productData)=>{


        try{


            await apiPrivate.put(
                `/admin/products/${P_ID}`,
                productData
            );


            loadProducts();


        }catch(err){

            console.error(
                "Update product error:",
                err
            );

        }


    };




    return {

        products,
        loadProducts,
        deleteProduct,
        updateProduct,
        createProduct

    };


}