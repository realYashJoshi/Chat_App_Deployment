const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            
            
            
        })
        console.log(`Mongoose Connected:${conn.connection.host}`);

    }
    catch(e){console.log(e.message);}
}
module.exports=connectDB;