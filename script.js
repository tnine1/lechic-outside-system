(function(){
  emailjs.init("L7OVBMyNKCDepbswR");
})();

const params = new URLSearchParams(window.location.search);
const table = params.get("table");

const statusText = document.getElementById("status");
const spinner = document.querySelector(".spinner");
const sound = document.getElementById("notifySound");

if(table){

  statusText.innerHTML = "Notifying staff...";
  
  emailjs.send("service_s88acd7","template_io3n30m",{
    table_number: table,
    time: new Date().toLocaleString()
  }).then(function(response){

      spinner.style.display = "none";
      statusText.innerHTML = 
      "Murakoze kudusura 😊<br><br>Umukozi araje kubakira kuri <strong>Table " + table + "</strong>.<br><br>Please wait...";

      sound.play();

  }, function(error){

      spinner.style.display = "none";
      statusText.innerHTML = 
      "System error. Please call staff.";

  });

} else {
  spinner.style.display = "none";
  statusText.innerHTML = "Invalid QR Code.";
}
