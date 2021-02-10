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
  $.get("http://localhost:8080/order", function(data, status) {
    const orderItems = data.data.rows;
    let $body = `
    <div class="flex flex-col pt-5">

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

//----------------------------Views order content logic -----------------------------------------------------------------

const clearTable = function() {
  $(".owner-body").empty();

};

const smsID = function(telephone, id) {

  $(`#ready:${id}`).css("background-color","gray")
  console.log(telephone);
};
const orderCompleted = function(id) {
  if (id) {
    $.ajax({
      url: `http://localhost:8080/order`,
      method: 'POST',
      data: id.toString(),
      success: function(result) {
        clearTable();
        $(document).ready(function() {
          renderOrders();
        });
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
};

const detailHelper = function(rows) {
  let menuDetail = "";
  for (let row of rows) {
    menuDetail += `
      <tr ">
        <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.orders_id}</td>
        <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.name}</td>
        <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.prep_time}</td>
        <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.price} </td>
        <td class="cancel-button" >
          <button onclick="cancelItem(${row.target})"  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ">
            Cancel
          </button>
         </td>
    `
  }
  return menuDetail;
}

const clearPopup = function() {
  $(".popup").empty();
};


const orderDetail = function(id) {
  if (id) {
    $.ajax({
      url: `/order/${id}`,
      method: 'POST',
      success: function(result) {
        console.log(result.data)
        $(document).ready(function() {
          const $popUp =`
          <div class="bg-white rounded md:w-2/3 w-full border shadow-lg">
            <div class="rounded-t bg-teal-500">
              <div class="relative py-3 px-2 flex">
             <span class="font-semibold text-white md:text-base text-sm">Popup Title</span>

            </div>
          </div>
          <div class="flex flex-col pt-5">

          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order_id
                    </th>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                    </th>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time to prep
                    </th>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                    </th>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                    </th>
                  </tr>
                <tread>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${detailHelper(result.data)}
                <!-- More items... -->
              </tbody>
              </table>
            </div>
          </div>
          </div>
          <div class="p-2 flex justify-end rounded-b">
            <button class="focus:outline-none py-1 px-2 md:py-2 md:px-3 w-24 bg-red-700 hover:bg-red-600 text-white rounded" onclick="clearPopup()" >Apply and Close</button>
          </div>
        </div>`
        $(".popup").prepend($popUp);
        });
      },
      error: function(error) {
        console.log(error);
      }
    });

  }
}

const cancelItem = function(id) {
  console.log("Front end call to cancel this id :", id)
  $.ajax({
    url: `/order/item/${id}`,
    method: 'POST',
    success: function(result) {
      console.log(result.data)
    }
  })
}


//submitNewItem();
