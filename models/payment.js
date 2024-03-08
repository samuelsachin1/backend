const mongoose=require('mongoose')
const schema=mongoose.Schema
const payment=new schema({
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'registration',
        required:true
    },
    amount:Number,
    duedate:Date,
    dateofpayment:Date,
    ispaid:Boolean,
    description:String,
    service:String,
    subService:String,
    files: [
        {
          filename: {
            type: String,
            required: true,
          },
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        },
      ],
      timestamp: {
        type: Date,
        default: Date.now,
      },
      companyName:String
})
module.exports=mongoose.model('payment',payment)