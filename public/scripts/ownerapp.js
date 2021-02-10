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
        <button onclick="orderCompleted(${row.id})"  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Remove from queue
        </button>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
      <button onclick="orderDetail(${row.id})"  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
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
//--------------------------------Add items to the menu feature--------------------------------------------------

window.submitNewItem = function() {
  $("#new-item-form").submit(function(event){
    event.preventDefault();
    const formContent = $(this).serialize();
    console.log(formContent);
    $.ajax({
      url: "/menu/add",
      method: 'POST',
      data: formContent,
      success: function(result) {
        $(".owner-body ").empty();
      },
      error: function(error) {
      }
    });
  })
}

const newMenuItem = function() {
  const $newMenuItemForm = `
<script>



</script>
  <div class=" flex items-center justify-center">
        <form id="new-item-form" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
           <br>
            <h1 class="block text-gray-700 font-bold mb-2 text-xl text-center">Create New Menu Element</h1>
            <br>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                    Name
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="name" id="name" type="text" placeholder="Name of the plate or product" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
                    Price
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="price" id="price" type="number" placeholder="Price" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="prep">
                    Estimated time to prep
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="prep" id="prep" type="number" placeholder="Preparation time in minutes" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="type">
                    Type of the Element
                </label>
                  <select name="type" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
                    <option value="entry">entry</option>
                    <option value="main">main</option>
                    <option value="dessert">dessert</option>
                    <option value="wine">wine</option>
                  </select>

            </div>
            <div class="flex items-center justify-between">
                <button
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit">
                    Add New Element
                </button>
            </div>
            <div class="mb-4">
        </form>
    </div>
<script>submitNewItem();</script>
  `
  $(".owner-body").prepend($newMenuItemForm);
}

//----------------------------------------------Edit menu logic ---------------------------------------------------------
const statusButton = function(status) {
  if (status) {
    return `
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
    On menu
    </button>`
  }
  if(!status)
  {
    return `
    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
    Not on menu
    </button>`
  }
}
window.setActive = function(id, button) {

  $.post("/menu/" + id, function(data, status) {

  })
button.parentElement.parentElement.querySelector('.status').innerHTML =statusButton(true)
}
window.setInActive = function(id, button) {

  $.post("/menu/disable/" + id, function(data, status) {
  })
  button.parentElement.parentElement.querySelector('.status').innerHTML =statusButton(false)
}
const editMenuHelper = function(id) {
  console.log("receiving response from backend", id)

  let menuEntries = `
    <script>


    </script>`;
  for (let row of id) {

    console.log(row)
    menuEntries += `

    <tr id="picked:${row.id}">
      <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.id}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.name}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.price}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.prep_time}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.type_plate}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="setActive(${row.id},this)" class="menu-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          ADD
        </button>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="setInActive(${row.id},this)"  class="menu-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Remove
        </button>
      </td>
      <td class="status px-6 py-4 whitespace-nowrap">
       ${statusButton(row.is_active)}
      </td>
    </tr>
  ` };
  return menuEntries;
}


const renderEditMenu = function() {
  $.get("/menu/all", function(data, status){
    menuItems = data.data.rows
  const $body = `<div class="flex flex-col pt-5 pl-5 pr-5 rounded">
  <script>  </script>
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prep Time
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Add to Menu
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Remove from Menu
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
              // ${editMenuHelper(menuItems)}
            <!-- More items... -->
          </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>

    <script></script>
    `;
    $(".owner-body").prepend($body);
    $('.menu-button').click(function(){
      console.log('I hate state management in Vanilla JS')})
  })
}

  //---------------------------- Body management -----------------------------------------------------------------
  const clearBody = function() {
    $(".owner-body ").empty();
  };



  const showOrder = function() {
    $("#show-order").click(function() {
      console.log('button working')
      clearBody();
      renderOrders();
    })
  }

  const editMenu = function() {
    $("#edit-menu").click(function() {
      clearBody();
      renderEditMenu();
    })
  }

  const addMenu = function() {
    $("#add-menu").click(function() {
      clearBody();
      newMenuItem();
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



