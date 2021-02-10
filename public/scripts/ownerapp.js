$(document).ready(function() {
  //-----------------------------Navbar component------------------------------------------------------
  const navbar = function() {
    const userObject = false; //Retrive and pase cookie for user info if no user logged in set to false
    let $conditionalRendering = "";
    if (!userObject) {
      $conditionalRendering = `
        <button class="modal-open bg-transparent border border-gray-500 hover:border-indigo-500 text-gray-500 hover:text-indigo-500 font-bold py-2 px-4 rounded-full">Log in</button>
      `;
    } else  {
      $conditionalRendering = `
        <li class="p-5">Welcome : ${userObject.name}</li>
        <li class="p-5"><a >Logout</a></li>
      `;
    }
    $("#navbar").prepend($conditionalRendering);
  };

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
        if (result.result) {
          //do whatever you want
          alert("The user is authenticated");
          toggleModal();
        } else {
          //user is not authenticated
          alert("user / password is not correct");
        }
      },
      error: function(error) {
      }
    });
    // .done(() => console.log('Its working!'))
    // .fail(() => console.log('Error'))
    // .always(() => console.log('Request Completed'));
  });

  const openUserLoginForm = function() {
    let openmodal = document.querySelectorAll('.modal-open');
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener('click', function(event) {
        event.preventDefault();
        toggleModal();
      });
    }
    const overlay = document.querySelector('.modal-overlay');
    overlay.addEventListener('click', toggleModal);
    let closemodal = document.querySelectorAll('.modal-close');
    for (var i = 0; i < closemodal.length; i++) {
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


  //--------------------------------Order table rendering logic ---------------------------------------
  const orderIdHelper = function(rows) {
    let menuEntries = "";

    for (let row of rows) {
      let time = row.order_time;
      time = time.substr(11, 5);
      menuEntries += `
      <tr id="picked:${row.id}">
      <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.id}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.name}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.email}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${time}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="smsID(${row.telephone}, ${row.id})" id="ready:${row.id}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          SMS
        </button>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="orderCompleted(${row.id})"  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Remove from => queue
        </button>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
      <button onclick="orderDetail(${row.id})"  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Order Details
      </button>
    </td>
      </tr>
      `;
    }
    return menuEntries;
  };

  //Render a table with all curent orders
  const renderOrders = function() {
  //Insert menu conditional rendering here
  //need ajax call to the backen to get menu information where is_active is true (Warning for now all menu element are false)
    $.get("/order", function(data, status) {
      const orderItems = data.data.rows;
      let $body = `<div class="flex flex-col pt-5">
    <script>  </script>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  client email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order time
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order is ready
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order is picked up
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${orderIdHelper(orderItems)}
              <!-- More items... -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
      $(".owner-body").prepend($body);
    });
  };
  $(function() {
    $("li").on("click",function(event) {
      console.log("I clicked this shit");
    });
  });


  //---------------------------- Body management -----------------------------------------------------------------
  const clearBody = function() {
    $(".owner-body ").empty();
  };

  const showOrder = function() {
    $("#show-order").click(function() {
      clearBody();
      renderOrders();
    })
  }

  const editMenu = function() {
    $("#edit-menu").click(function() {
      clearBody();

    })
  }

  const addMenu = function() {
    $("#add-menu").click(function() {
      clearBody();

    })
  }


  //--------------------------Function calling -----------------------------------
  addMenu();
  editMenu();
  showOrder();
  navbar();
  openUserLoginForm();
  renderOrders();

});

