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
      </tr>
      `;
  }
  return menuEntries;
};

//Render a table with all curent orders
const renderOrders = function() {
  //Insert menu conditional rendering here
  //need ajax call to the backen to get menu information where is_active is true (Warning for now all menu element are false)
  $.get("http://localhost:8080/order", function(data, status) {
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
//----------------------------Views order content logic -----------------------------------------------------------------

const clearTable = function() {
  $(".owner-body").empty();

};

const smsID = function(telephone, id) {
  // $.ajax({
  //   url: `http://localhost:8080/sendsms`,
  //   method: 'POST',
  //   data: id,
  //   success: function(result) {
  //     console.log("everything went well. ", result);
  //   },
  //   error: function(error) {
  //     console.log(error);
  //   }
  // });
  $(`#ready:${id}`).css("background-color","gray")
  console.log(telephone);
};


const createOrder = function(cart) {
  if (cart) {
    console.log(cart);
    $.ajax({
      url: `http://localhost:8080/cart`,
      method: 'POST',
      data: cart,
      success: function(result) {
        console.log(result);
      },
      error: function(error) {
        console.log(error);
      }
    });

  }

};


const orderCompleted = function(id) {
  if (id) {
    $.ajax({
      url: `http://localhost:8080/order`,
      method: 'PUT',
      data: id.toString(),
      success: function(result) {
        clearTable();
        $(document).ready(function() {
          renderOrders();
        });

      // location.reload(); //Need to make it only rerender the table
      },
      error: function(error) {
        console.log(error);
      }
    });

  }

};
