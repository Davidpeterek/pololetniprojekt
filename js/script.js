//proměnná time, day, midday 
var time = document.getElementById("time");
var day = document.getElementById("day");
var midday = document.getElementById("midday");

var clock = setInterval(
    function calcTime(){
        //dostání hodin, minut, sekund
        var date_now = new Date();
        var hr = date_now.getHours();
        var min = date_now.getMinutes();
        var sec = date_now.getSeconds();
        var middayValue = "AM"
        //vypsání dnů  
        var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        
        day.textContent = days[date_now.getDay()];
        //převod z pm na am
        middayValue = (hr >= 12) ? "PM" : "AM";
        //funkce pro výpočet hodin z PM do AM
        if(hr == 0){
            hr = 12;
        }
        else if(hr > 12){
            hr-=12;
        }

        hr = (hr < 10) ? "0" + hr : hr;
        min = (min < 10) ? "0" + min : min;
        sec = (sec < 10) ? "0" + sec : sec;

        //funkce pro získání textového obsahu
        time.textContent = hr + ":" + min + ":" + sec;
        midday.textContent = middayValue;
    },
    1000
);