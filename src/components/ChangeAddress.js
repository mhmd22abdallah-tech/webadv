import React, { useState } from "react"
function ChangeAddress({setAddress,setIsModelOpen}){
    const [newAddress,setNewAddress]=useState("")
    function onClose(){
        setAddress(newAddress)
        setIsModelOpen(false)
    }
    
    return(
        <div>
            <input type="text" className="form-control border" placeholder="Enter New Address" onChange={(e)=>setNewAddress(e.target.value)} />
            <br/>
            <div className="d-flex justify-content-end">
                <button className="rounded bg-danger" onClick={()=> setIsModelOpen(false)}>Cancel</button>&nbsp;&nbsp;
                <button className="rounded bg-primary" onClick={onClose}>Save</button>
            </div>

        </div>
    )
}
export default ChangeAddress;