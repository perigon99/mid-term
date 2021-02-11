$(document).ready(function() {
  //-----------------------------Navbar Component / Login Rendering ------------------------------------------------------
  const navbar = function() {
    const userObject = false; //Retrive and parse cookie for user info if no user logged in set to false
    let $conditionalRendering = "";
    if (!userObject) {
      $conditionalRendering = `
        <button class="modal-open bg-transparent w-36 border border-gray-500 hover:border-indigo-500 text-gray-500 hover:text-indigo-500 font-bold m-2 rounded-full" id="login-button">Log in</button>
        <button class="bg-transparent border w-36 border-gray-500 hover:border-indigo-500 text-gray-500 hover:text-indigo-500 font-bold m-2 rounded-full hidden" id="logout-button" >Log out</button>
      `;
    } else  {
      $conditionalRendering = `
        <li class="p-5">Welcome : ${userObject.name}</li>
        <li class="p-5"><a >Logout</a></li>
      `;
    }
    $("#navbar").prepend($conditionalRendering);
  };
  //-------------------------------- Login Authentication: POST ------------------------------------------------
  $('#login-form').submit(function(event) {
    event.preventDefault();
    const formContent = $(this).serialize();
    console.log(formContent);
    $.ajax({
      url: `/login`,
      method: 'POST',
      data: formContent,
      success: function(result) {
        console.log("everything went well. ", result);
        if (result.name) {
          alert("The user is authenticated");
          toggleModal();
          const loginButton = document.getElementById("login-button");
          const logoutButton = document.getElementById("logout-button");

          loginButton.style.display = "none";
          logoutButton.style.display = "block";
          $("#navbar").prepend(`<div class="welcome-message">Welcome: ${result.name}</div>`);
        } else {
          //user is not authenticated
          alert("user / password is not correct");
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  //--------------------------------Modal Form Popup on Clicking Login ------------------------------------------------
  const openUserLoginForm = function() {
    let openmodal = document.querySelectorAll('.modal-open');
    for (let i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener('click', function(event) {
        event.preventDefault();
        toggleModal();
      });
    }
    const overlay = document.querySelector('.modal-overlay');
    overlay.addEventListener('click', toggleModal);
    let closemodal = document.querySelectorAll('.modal-close');
    for (let i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener('click', toggleModal);
    }
    document.onkeydown = function(evt) {
      evt = evt || window.event;
      let isEscape = false;
      if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
      } else {
        isEscape = (evt.keyCode === 27);
      }
      if (isEscape && document.body.classList.contains('modal-active')) {
        toggleModal();
      }
    };
    function toggleModal() {
      const body = document.querySelector('body');
      const modal = document.querySelector('.modal');
      modal.classList.toggle('opacity-0');
      modal.classList.toggle('pointer-events-none');
      body.classList.toggle('modal-active');
    }
  };
  //--------------------------------Menu rendering---------------------------------------------------
  const entryHelper = function(rows) {
    let menuEntries = "";
    for (let row of rows) {
      if (row.type_plate === "entry") {
        menuEntries += `<li class="addCart cursor-pointer" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  const mainHelper = function(rows) {
    let menuEntries = "";
    for (let row of rows) {
      if (row.type_plate === "main") {
        menuEntries += `<li class="addCart cursor-pointer" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  const dessertHelper = function(rows) {
    let menuEntries = "";
    for (let row of rows) {
      if (row.type_plate === "dessert") {
        menuEntries += `<li class="addCart cursor-pointer" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  const cellarHelper = function(rows) {
    let menuEntries = "";
    for (let row of rows) {
      if (row.type_plate === "wine") {
        menuEntries += `<li class="addCart cursor-pointer" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  let menuItems;

  const renderMenu = function() {
  //Insert menu conditional rendering here
  //need ajax call to the backen to get menu information where is_active is true (Warning for now all menu element are false)
    $.get("/menu", function(data, status) {
      menuItems = data.data.rows;
      let $body = `
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
    `;
      $(".bodyContent").prepend($body);
    });
  };
  //-------------------------------- Check Cart Rendering ---------------------------------------------------

  // Stretch: object => key = id , value = quantity : displaying the cart => lookup the key in this object => food item
  let cart = [];

  const createOrder = function(cart) {
    if (cart) {
      console.log(cart);
      $.ajax({
        url: `/cart`,
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(cart),
        success: function(result) {
          console.log(result);
        },
        error: function(error) {
          console.log(error);
        }
      });
    }
  };

  $(document).on("click", ".addCart", function(event) {

    let foodItemId = parseInt(event.target.id);

    let data = menuItems.filter(item => item.id === foodItemId);
    if (data) {
      cart.push(data[0]);
    }
    // Remove this console log at end of project:
    console.log("Added to cart:" , cart);
  });


  $(document).ready(function() {
    $("#formButton").click(function() {
      $("#form1").toggle();
      // Remove this console log at end of project:
      console.log("items in cart:", cart);

      let subtotalCounter = 0;
      let quantityCounter = 0;

      $("#food").empty();

      for (let row in cart) {

        // console.log(cart[row]);
        $("#food").append(`<div>${cart[row].name} - $${cart[row].price} <button class="delete bg-red-500 hover:bg-red-700 mt-1 text-white font-bold py-2 px-4 rounded" data-index="${row}"> Delete </button> </div> `);

        subtotalCounter += cart[row].price;
        quantityCounter += 1;
      }

      $("#stotal").text(subtotalCounter);
      $("#sub-total").text(subtotalCounter);
      $("#quantity").text(`Total Quantity: ${quantityCounter}`);

      $("#Pay").click(function(event) {
        event.preventDefault();
        console.log("Final Order sent to backend:", cart);
        createOrder(cart);
      });
    });

    // ----------------------- Delete Rendering for Check Cart --------------------------
    $("body").on("click", ".delete", function(event) {

      event.preventDefault();

      cart.splice($(event.target).data("index"), 1);

      $(event.target).parent().remove();
    });

  });

  //--------------------------------Logout rendering----------------------------------------------
  $(document).ready(function() {
    const logoutButton = document.getElementById("logout-button");
    $(logoutButton).on('click', function() {
      alert("Handle for logout called");
      $.ajax({
        url: `/logout`,
        method: 'POST',
        success: function(result) {
          console.log(result);
          if (result) {
            console.log(result);
            const loginButton = document.getElementById("login-button");
            const logoutButton = document.getElementById("logout-button");
            $(".welcome-message").empty();
            loginButton.style.display = "block";
            logoutButton.style.display = "none";
          }
        }
      });
    });
  });
  window.scrollToBottom = function() {
    $("#formButton").click(function(){
          $('html, body').animate({scrollTop:$(document).height()}, 'slow');
    })

  }

  navbar();
  openUserLoginForm();
  renderMenu();
  scrollToBottom();
});

//--------------------------------Used to render the modal form ----------------------------------------------

function toggleModal() {
  const body = document.querySelector('body');
  const modal = document.querySelector('.modal');
  modal.classList.toggle('opacity-0');
  modal.classList.toggle('pointer-events-none');
  body.classList.toggle('modal-active');
}
