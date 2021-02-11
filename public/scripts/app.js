$(document).ready(function() {
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
          $("#navbar").prepend(`<div class="welcome-message">Welcome: ${result.name}</div>`);
          setTimeout(function(){// wait for 5 secs(2)
            location.reload(); // then reload the page.(3)
       }, 100);
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
        menuEntries += `<li class="addCart cursor-pointer select-none" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  const mainHelper = function(rows) {
    let menuEntries = "";
    for (let row of rows) {
      if (row.type_plate === "main") {
        menuEntries += `<li class="addCart cursor-pointer select-none" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  const dessertHelper = function(rows) {
    let menuEntries = "";
    for (let row of rows) {
      if (row.type_plate === "dessert") {
        menuEntries += `<li class="addCart cursor-pointer select-none" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  const cellarHelper = function(rows) {
    let menuEntries = "";
    for (let row of rows) {
      if (row.type_plate === "wine") {
        menuEntries += `<li class="addCart cursor-pointer select-none" id="${row.id}">${row.name} ----- ${row.price} $</li>`;
      }
    }
    return menuEntries;
  };

  let menuItems;

  const renderMenu = function() {
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
  const cart = [];

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
    $(this).css("color", "rgba(245, 158, 11)")
    // Remove this console log at end of project:
    console.log("Added to cart:" , cart);
  });

  let quantityCounter = 0;
  // let subtotalCounter = 0;

  $(document).ready(function() {
    $("#formButton").click(function() {
      $("#form1").toggle();
      // Remove this console log at end of project:
      console.log("items in cart:", cart);
      let subtotalCounter = 0;

      $("#food").empty();
      for (let row in cart) {
        $("#food").append(`<div id="color-change${row}">${cart[row].name} - $${cart[row].price} <button class="delete bg-red-500 hover:bg-red-700 mt-1 text-white font-bold py-1 px-1 rounded" data-index="${row}">X</button> </div> `);
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

      // to do , change menu item to color black on click of delete
      // $("#color-change").css("color", "black")
      const $parent = $(this).parent();

      const siblingPriceString = $parent.html().split("\$")[1].split("\<")[0];
      const itemPrice = parseInt(siblingPriceString);

      const subTotal = parseInt(getSubtotal());

      $("#quantity").text(`Total Quantity: ${cart.length - 1}`);
      $("#stotal").text(subTotal - itemPrice);
      $("#sub-total").text(getSubtotal());


      $(event.target).parent().remove();
      cart.splice($(event.target).data("index"), 1);
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
            location.reload();
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

  openUserLoginForm();
  renderMenu();
  scrollToBottom();

});

//--------------------------------Used to render the modal form ----------------------------------------------


const getSubtotal = function () {
  return $("#stotal").text();
}


function toggleModal() {
  const body = document.querySelector('body');
  const modal = document.querySelector('.modal');
  modal.classList.toggle('opacity-0');
  modal.classList.toggle('pointer-events-none');
  body.classList.toggle('modal-active');
}
