let date=new Date();
let weekNo=date.getDay();
let WeekDay="";
if(weekNo==0){weekDay="sunday";}
else if(weekNo==1){weekDay="monday";}
else if(weekNo==2){weekDay="tuesday";}
else if(weekNo==3){weekDay="wednesday";}
else if(weekNo==4){weekDay="thursday";}
else if(weekNo==5){WeekDay="friday";}
else if(weekNo==6){weekDay="saturday";}
let newDate =`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}| ${weekDay} `;
  module.exports = newDate;