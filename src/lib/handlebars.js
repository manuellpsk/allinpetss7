const {format}= require('timeago.js');

const helpers={}

helpers.timeago= (timestamp)=>{
    const fec= new Date(timestamp);
    return fec.toDateString()+'. '+format(timestamp);
};


module.exports=helpers;