$(document).ready(function() {



//-----------------------------Navbar component------------------------------------------------------

const navbar = function() {
  const userObject = false; //Retrive and pase cookie for user info if no user logged in set to false
  let $conditionalRendering = ""
  if (!userObject) {
    $conditionalRendering =`
      <li class="p-5"><a>Login</a></li>
      <li class="p-5"><a >Register</a></li>
    `
    }
  if (userObject) {
    $conditionalRendering =`
       <li class="p-5">Welcome : ${userObject.name}</li>
       <li class="p-5"><a >Logout</a></li>
     `
  }
  $("#navbar").prepend($conditionalRendering);
}
//--------------------------------Login form rendering----------------------------------------------
const loginForm = function() {
  //Insert login form conditional rendering here
  $(".bodyContent").prepend($section);
}

const registerForm = function() {
  //Insert login form conditional rendering here
  $(".bodyContent").prepend($section);
}

//--------------------------------Menu rendering---------------------------------------------------
const renderMenu = function() {
  //Insert menu conditional rendering here
  //need ajax call to the backen to get menu information where is_active is true (Warning for now all menu element are false)
  $(".bodyContent").prepend($section);
}

//--------------------------------Function calling ------------------------------------------------
navbar();
}
)

