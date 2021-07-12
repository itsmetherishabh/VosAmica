// Search button functionality

const searchFocus = document.getElementById('search-focus');
const keys = [
  { keyCode: 'AltLeft', isTriggered: false },
  { keyCode: 'ControlLeft', isTriggered: false },
];

window.addEventListener('keydown', (e) => {
  keys.forEach((obj) => {
    if (obj.keyCode === e.code) {
      obj.isTriggered = true;
    }
  });

  const shortcutTriggered = keys.filter((obj) => obj.isTriggered).length === keys.length;

  if (shortcutTriggered) {
    searchFocus.focus();
  }
});

window.addEventListener('keyup', (e) => {
  keys.forEach((obj) => {
    if (obj.keyCode === e.code) {
      obj.isTriggered = false;
    }
  });
});

// --------------------------------------------------------


function changeCity()
{
  var name=document.getElementById('city').value;
  console.log(name);
  alert(name);
}

// Dates restrictions

// Date objects are created wiyh the new date() constructor./

function check()
{
  var chk=new Date(document.getElementById('chk').value);
  var month = chk.getMonth() +1;
			  var day = chk.getDate() +1;
			  var year = chk.getFullYear() ;
			  if(month < 10)
			  month='0' + month.toString();
			  if(day < 10)
			  day = '0' + day.toString();
			  maxDate = year + '-' + month + '-' + day;
  $('.dateEnd').attr('min', maxDate);
}

$(document).ready(function(){

        var dtToday = new Date();
			  var month = dtToday.getMonth() +1;
			  var day = dtToday.getDate();
			  var year = dtToday.getFullYear() ;
			  if(month < 10)
			  month='0' + month.toString();
			  if(day < 10)
			  day = '0' + day.toString();
			  var maxDate = year + '-' + month + '-' + day;
        $('.dateStart').attr('min', maxDate);
        $('.dateEnd').attr('min', maxDate);
           
// Toast  --------------------------------------------

        $('.toast').toast('show');
        $('.toast').toast({delay:2000, animation:false});
});


// MODAL ----------------------------------------------

var modal1 = document.getElementById("myModal1");
var modal2 = document.getElementById("myModal2");

// Get the button that opens the modal
var btn1 = document.getElementById("myBtn1");
var btn2 = document.getElementById("myBtn2");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

// When the user clicks the button, open the modal 
btn1.onclick = function() {
  modal1.style.display = "block";
}
btn2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span[0].onclick = function() {
  modal1.style.display = "none";
}
span[1].onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}