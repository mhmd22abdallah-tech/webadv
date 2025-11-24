import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  totalQuantity:0,
  totalPrice:0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state,action){
      const newItem=action.payload
      const itemIndex=state.products.find((item)=>item.id===newItem.id)
      if(itemIndex){
        itemIndex.quantity++;
        itemIndex.totalPrice =+ newItem.price
      }
      else{
        state.products.push({
          name:newItem.name,
          id:newItem.id,
          price: newItem.price,
          quantity:1,
          image:newItem.image,
          totalPrice:newItem.price
          

        })
      }
      state.totalPrice+=newItem.price
      state.totalQuantity++
    },
    removeFromCart(state,action){
      const id=action.payload
      const FindItem=state.products.find((item)=>item.id===id)
      if(FindItem){
        state.totalPrice -= FindItem.totalPrice
        state.totalQuantity=FindItem.quantity
        state.products= state.products.filter((item)=>id!==item.id)
      }
    },
    increment(state,action){
      const id=action.payload
      const FindItem=state.products.find((item)=>item.id===id)
      
      if(FindItem){
        FindItem.quantity++;
        FindItem.totalPrice += FindItem.price
        state.totalPrice += FindItem.price
        state.totalQuantity++

        }
    
  },
  decrement(state,action){
    const id=action.payload
    const FindItem=state.products.find((item)=>item.id===id)
    if(FindItem.quantity>1){
    if(FindItem){
      FindItem.quantity--;
      FindItem.totalPrice -= FindItem.price
      state.totalPrice -= FindItem.price
      state.totalQuantity--
      }
  }
}
  }

});
export const {addToCart,removeFromCart,increment,decrement} = cartSlice.actions
export default cartSlice.reducer;