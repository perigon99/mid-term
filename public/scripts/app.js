$(document).ready(function () {
  //-----------------------------Navbar component------------------------------------------------------
  const navbar = function () {
    const userObject = false; //Retrive and parse cookie for user info if no user logged in set to false
    let $conditionalRendering = ""
    if (!userObject) {
      $conditionalRendering = `
        <button class="modal-open bg-transparent border border-gray-500 hover:border-indigo-500 text-gray-500 hover:text-indigo-500 font-bold py-2 px-4 rounded-full" id="login-button">Log in</button>
        <button class="bg-transparent border border-gray-500 hover:border-indigo-500 text-gray-500 hover:text-indigo-500 font-bold py-2 px-4 rounded-full hidden" id="logout-button" >Log out</button>
      `
    }
    else  {
      $conditionalRendering = `
        <li class="p-5">Welcome : ${userObject.name}</li>
        <li class="p-5"><a >Logout</a></li>
      `
    }
    $("#navbar").prepend($conditionalRendering);
  }
  //--------------------------------Login form rendering----------------------------------------------
  const loginForm = function () {
    let $section = `
      <h3>Login to Restaurant App:</h3>
      <form method="POST" action="/login">
      <div class="userform-group">
        <label for="userID">User ID:</label>
        <input class="form-control" type="userID" name="userID" placeholder="Enter userID here" style="width: 1000px">
      </div>
      <div class="userform-group">
        <label for="password">Password:</label>
        <input class="form-control" type="password" name="password" placeholder="Enter password here" style="width: 1000px">
      </div>
      <button type="submit" class="btn btn-dark" style="margin-top: 1em;" > Login </button>
      </form>
    `
    $(".bodyContent").prepend($section);
  }
  const registerForm = function () {
    //Insert login form conditional rendering here
    $(".bodyContent").prepend($section);
  }

  //--------------------------------Function calling ------------------------------------------------

  $('#login-form').submit(function(event) {
    event.preventDefault();
    const formContent = $(this).serialize();
    console.log(formContent);
    $.ajax({
      url: `/login`,
      method: 'POST',
      data: formContent,
      success: function(result){
        console.log("everything went well. ", result);
        if(result.name){
          //do whatever you want
          alert("The user is authenticated");
          toggleModal();
          const loginButton = document.getElementById("login-button");
          const logoutButton = document.getElementById("logout-button");

          loginButton.style.display = "none";
          logoutButton.style.display = "block";
          $("#navbar").prepend(`Welcome: ${result.name}`)
        } else{
          //user is not authenticated
          alert("user / password is not correct");
        }
      },
      error: function(error){
      }
    })
      // .done(() => console.log('Its working!'))
      // .fail(() => console.log('Error'))
      // .always(() => console.log('Request Completed'))
  });

//   $.get("http://localhost:8080/menu", function(data, status){
//     console.log("everything went well. ", status, "My data is", data);
//     console.log(data.length)
//   }
// )
  const openUserLoginForm = function () {
    var openmodal = document.querySelectorAll('.modal-open')
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener('click', function (event) {
        event.preventDefault()
        toggleModal()
      })
    }
    const overlay = document.querySelector('.modal-overlay')
    overlay.addEventListener('click', toggleModal)
    var closemodal = document.querySelectorAll('.modal-close')
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener('click', toggleModal)
    }
    document.onkeydown = function (evt) {
      evt = evt || window.event
      var isEscape = false
      if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc")
      } else {
        isEscape = (evt.keyCode === 27)
      }
      if (isEscape && document.body.classList.contains('modal-active')) {
        toggleModal()
      }
    };
    function toggleModal() {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.toggle('opacity-0')
      modal.classList.toggle('pointer-events-none')
      body.classList.toggle('modal-active')
    }
  };




//--------------------------------Menu rendering---------------------------------------------------


const entryHelper = function(rows) {
  let menuEntries = "";
  for (let row of rows) {
    if(row.type_plate === "entry") {
      menuEntries += `<li class="addCart" id="${row.id}">${row.name} ----- ${row.price} $</li>`
    }
  }
  return menuEntries;
}

const mainHelper = function(rows) {
  let menuEntries = "";
  for (let row of rows) {
    if(row.type_plate === "main") {
      menuEntries += `<li class="addCart" id="${row.id}">${row.name} ----- ${row.price} $</li>`
    }
  }
  return menuEntries;
}
const dessertHelper = function(rows) {
  let menuEntries = "";
  for (let row of rows) {
    if(row.type_plate === "dessert") {
      menuEntries += `<li class="addCart" id="${row.id}">${row.name} ----- ${row.price} $</li>`
    }
  }
  return menuEntries;
}

const cellarHelper = function(rows) {
  let menuEntries = "";
  for (let row of rows) {
    if(row.type_plate === "wine") {
      menuEntries += `<li class="addCart" id="${row.id}">${row.name} ----- ${row.price} $</li>`
    }
  }
  return menuEntries;
}


let menuItems

const renderMenu = function () {
  //Insert menu conditional rendering here
  //need ajax call to the backen to get menu information where is_active is true (Warning for now all menu element are false)
  $.get("/menu", function(data, status){
    menuItems = data.data.rows
    let $body =`
    <div class="flex pt-5 z-0">
      <div class="max-w-7xl mx-auto rounded overflow-hidden shadow-lg flex-1 border-double border-4 border-black menu-item">
          <div class="flex pt-2">
            <div class="max-w-7xl mx-auto rounded overflow-hidden shadow-lg flex-1 ">
              <div class="px-6 py-4">
                <div class="mb-2 text-center font-serif font-black text-4xl tracking-wider menu-category">Entries</div>
                <p class="text-gray-700 text-base">
                  <ul class="menu-lists">
                  ${entryHelper(menuItems)}
                  </ul>
                </p>
              </div>
            </div>
          </div>
          <div class="flex pt-2">
            <div class="max-w-7xl mx-auto rounded overflow-hidden shadow-lg flex-1">
              <div class="px-6 py-4">
                <div class="mb-2 text-center font-serif font-black text-4xl tracking-wider">Main courses</div>
                <p class="text-gray-700 text-base">
                  <ul class="menu-lists">
                  ${mainHelper(menuItems)}
                  </ul>
                </p>
              </div>
            </div>
          </div>
          <div class="flex pt-2">
            <div class="max-w-7xl mx-auto rounded overflow-hidden shadow-lg flex-1">
              <div class="px-6 py-4">
                <div class="mb-2 text-center font-serif font-black text-4xl tracking-wider">desserts</div>
                <p class="text-gray-700 text-base">
                  <ul class="menu-lists">
                  ${dessertHelper(menuItems)}
                  </ul>
                </p>
              </div>
            </div>
          </div>
          <div class="flex pt-2">
            <div class="max-w-7xl mx-auto rounded overflow-hidden shadow-lg flex-1">
              <div class="px-6 py-4">
                <div class="mb-2 text-center font-serif font-black text-4xl tracking-wider">Cellar</div>
                <p class="text-gray-700 text-base">
                  <ul class="menu-lists">
                  ${cellarHelper(menuItems)}
                  </ul>
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
    `
    $(".bodyContent").prepend($body);
  })
}

//-------------------------------- Check Cart Rendering ---------------------------------------------------

let cart = [];
// JSON.stringify(cart);

// object => key = id , value = quantity
// displaying the cart => lookup the key in this object => food item


  $(document).on("click", ".addCart", function (event) {
    // console.log(menuItems);

    // if addcart => on click this specific class , do the below
    let foodItemId = parseInt(event.target.id);
    // console.log("is it firing?", foodItemId);
    let data = menuItems.filter(item => item.id === foodItemId)


    //  console.log(data);
    //  console.log(data[0].name)
    if (data) {
      cart.push(data[0])
      // cartInfo(cart);
    }

    // console.log("Added to cart:" , cart);

    // console.log(`Added to cart: ${cart[0].name} , $${cart[0].price}`)
  })


  // console.log(cart)

  // const cartInfo = function (foodCart) {

  //   for (let item of foodCart) {
  //     // console.log("foodcart here", foodCart);
  //     // console.log("items in the cart", item)
  //   }
  // }



  // console.log("Added to cart:" , cart);

  // $(".addCart").click(function() {
  //   // console.log("thisOne", cart)
  //   ("#testappend").append("<div>test</div>");
  // })


$(document).ready(function() {
  $("#formButton").click(function() {
    $("#form1").toggle();
    console.log("items in cart:", cart);

    let subtotalCounter = 0;
    let quantityCounter = 0;

    $("#food").empty();


    cart.forEach(item => {
      // console.log("items in the cart", item)
      $("#food").append(`<div>${item.name} - $${item.price} </div>`);

      subtotalCounter += item.price;
      quantityCounter += 1;
    })

    $("#stotal").text(subtotalCounter);
    $("#sub-total").text(subtotalCounter);
    $("#quantity").text(`Quantity: ${quantityCounter}`);

    // console.log(subtotalCounter);
    // console.log(quantityCounter);


      // console.log("test name finder", item.name)


    // $("#testappend").append("<div>test</div>");
  });
});

navbar();
openUserLoginForm();
renderMenu();
  $(document).ready( function () {
    const logoutButton = document.getElementById("logout-button");
    $(logoutButton).on('click', function() {
      alert("Handle for logout called");
      $.ajax({
        url: `/logout`,
        method: 'POST',
        success: function(result){
          console.log(result)
          if(result) {
            console.log(result);
            const loginButton = document.getElementById("login-button");
            const logoutButton = document.getElementById("logout-button");
            loginButton.style.display = "block";
            logoutButton.style.display = "none";
          }
        }
      })
    });
  })
})


function toggleModal() {
  const body = document.querySelector('body')
  const modal = document.querySelector('.modal')
  modal.classList.toggle('opacity-0')
  modal.classList.toggle('pointer-events-none')
  body.classList.toggle('modal-active')
}
