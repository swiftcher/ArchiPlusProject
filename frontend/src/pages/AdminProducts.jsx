import { useEffect, useState } from "react";
import "./AdminProducts.css";

import { useAdminProductsViewModel } from "./useAdminProductViewModel";


export default function AdminProducts() {

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const [newProduct, setNewProduct] = useState({
        Cat_ID:"",
        P_Name:"",
        P_Description:"",
        P_Price:"",
        P_Picture:"",
        P_Stock:""
    });


    const {
        products,
        loadProducts,
        deleteProduct,
        updateProduct,
        createProduct

    } = useAdminProductsViewModel();



    useEffect(()=>{
        loadProducts();
    },[]);



    const resetNewProduct = () => {

        setNewProduct({
            Cat_ID:"",
            P_Name:"",
            P_Description:"",
            P_Price:"",
            P_Picture:"",
            P_Stock:""
        });

    };



    const saveNewProduct = async()=>{

        await createProduct(newProduct);

        setShowAddProduct(false);

        resetNewProduct();

        loadProducts();

    };



    return (

    <div className="admin-products">


        <div className="products-header">

            <h1>
                Products Management
            </h1>

            <button
            className="add-product-btn"
            onClick={()=>setShowAddProduct(true)}
            >
                + Add Product
            </button>

        </div>



        <div className="products-list">


        {
        products.map(product=>(

            <div
            className="product-card"
            key={product.P_ID}
            >


                {
product.P_Picture ?

        <img 
            src={product.P_Picture}
            alt={product.P_Name}
        />

        :

        <div className="no-image">
            No Image
        </div>

        }


                <div className="product-info">

                    <h3>
                        {product.P_Name}
                    </h3>

                    <p>
                        Category: {product.Cat_Name}
                    </p>

                    <p>
                        Price: ${product.P_Price}
                    </p>

                    <p>
                        Stock: {product.P_Stock}
                    </p>

                </div>



                <div className="product-actions">


                    <button
                    onClick={()=>setEditProduct(product)}
                    >
                        Edit
                    </button>



                    <button
                    className="delete"
                    onClick={()=>deleteProduct(product.P_ID)}
                    >
                        Delete
                    </button>


                </div>


            </div>

        ))
        }


        </div>





        {/* EDIT MODAL */}

        {
        editProduct && (

        <div className="edit-overlay">

            <div className="edit-box">

                <h2>
                    Edit Product
                </h2>


                <input
                value={editProduct.P_Name}
                onChange={(e)=>
                    setEditProduct({
                        ...editProduct,
                        P_Name:e.target.value
                    })
                }
                />


                <input
                type="number"
                value={editProduct.P_Price}
                onChange={(e)=>
                    setEditProduct({
                        ...editProduct,
                        P_Price:e.target.value
                    })
                }
                />


                <input
                type="number"
                value={editProduct.P_Stock}
                onChange={(e)=>
                    setEditProduct({
                        ...editProduct,
                        P_Stock:e.target.value
                    })
                }
                />



                <div className="modal-buttons">

                    <button
                    onClick={()=>{

                        updateProduct(
                            editProduct.P_ID,
                            editProduct
                        );

                        setEditProduct(null);

                    }}
                    >
                        Save
                    </button>


                    <button
                    onClick={()=>setEditProduct(null)}
                    >
                        Cancel
                    </button>

                </div>


            </div>

        </div>

        )
        }







        {/* ADD MODAL */}

        {
        showAddProduct && (

        <div className="edit-overlay">

            <div className="edit-box">


                <h2>
                    Add Product
                </h2>


                <input
                placeholder="Product Name"
                value={newProduct.P_Name}
                onChange={(e)=>
                    setNewProduct({
                        ...newProduct,
                        P_Name:e.target.value
                    })
                }
                />


                <input
                placeholder="Category ID"
                type="number"
                value={newProduct.Cat_ID}
                onChange={(e)=>
                    setNewProduct({
                        ...newProduct,
                        Cat_ID:e.target.value
                    })
                }
                />


                <input
                placeholder="Description"
                value={newProduct.P_Description}
                onChange={(e)=>
                    setNewProduct({
                        ...newProduct,
                        P_Description:e.target.value
                    })
                }
                />


                <input
                placeholder="Price"
                type="number"
                value={newProduct.P_Price}
                onChange={(e)=>
                    setNewProduct({
                        ...newProduct,
                        P_Price:e.target.value
                    })
                }
                />


                <input
                placeholder="Picture URL"
                value={newProduct.P_Picture}
                onChange={(e)=>
                    setNewProduct({
                        ...newProduct,
                        P_Picture:e.target.value
                    })
                }
                />


                <input
                placeholder="Stock"
                type="number"
                value={newProduct.P_Stock}
                onChange={(e)=>
                    setNewProduct({
                        ...newProduct,
                        P_Stock:e.target.value
                    })
                }
                />



                <div className="modal-buttons">

                    <button
                    onClick={saveNewProduct}
                    >
                        Create
                    </button>


                    <button
                    onClick={()=>{
                        setShowAddProduct(false);
                        resetNewProduct();
                    }}
                    >
                        Cancel
                    </button>

                </div>


            </div>

        </div>

        )
        }


    </div>

    );

}