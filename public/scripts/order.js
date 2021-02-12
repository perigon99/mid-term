const orderIdHelper = function(rows) {
  let menuEntries = "";
  for (let row of rows) {
    let time = row.order_time;
    time = time.substr(11, 5);
    console.log("inside orderIdhelper function", row)
    menuEntries += `
        <tr id="picked:${row.id}">
          <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.order_id}</td>
          <td class="px-6 py-4 whitespace-nowrap"> ${row.name}</td>
          <td class="px-6 py-4 whitespace-nowrap"> ${row.email}</td>
          <td class="px-6 py-4 whitespace-nowrap"> ${time}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button onclick="smsID(${row.telephone}, ${row.id})" id="ready:${row.id}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              SMS
            </button>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button onclick="orderCompleted(${row.order_id})"  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Remove from queue
            </button>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button onclick="orderDetail(${row.order_id})"  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Order Details
          </button>
          </td>
        </tr>
      `;
  }
  return menuEntries;
};

const renderOrders = function() {
  $.get("/admin/order", function(data, status) {
    const orderItems = data.data.rows;
    let $body = `
      <div class="flex flex-col pt-5">
        <div class="-my-2  sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 ">
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
      </div>
    `;
    $(".owner-body").prepend($body);
  });
};

//----------------------------Views order content logic -----------------------------------------------------------------

const clearTable = function() {
  $(".owner-body").empty();
};

const smsID = function(telephone, id) {
  $.ajax({
    url: `/owner/sms/${id}`,
    method: 'POST',
    data: telephone.toString()
  })
  $(`#ready:${id}`).css("background-color","gray")
};


const createOrder = function(cart) {
  if (cart) {
    $.ajax({
      url: `http://localhost:8080/cart`,
      method: 'POST',
      data: cart,
      success: function(result) {
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
      url: `/admin/order`,
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
console.log("inside or detail helper fuunction", row)
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
    console.log(id)
    $.ajax({
      url: `/admin/order/${id}`,
      method: 'GET',
      success: function(result) {
        $(document).ready(function() {
          const $popUp =`
          <div class="bg-white rounded md:w-2/3 w-3/5 border shadow-lg">
            <div class="rounded-t bg-teal-500">
              <div class="relative py-3 px-2 flex">
             <span class="font-semibold text-white md:text-base text-sm">Popup Title</span>
            </div>
          </div>
          <div class="flex flex-col pt-5">
          <div class="">
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
                </tbody>
              </table>
            </div>
          </div>
          <div class="p-2 flex justify-end rounded-b">
            <button class="focus:outline-none py-1 mr-12 px-2 md:py-2 md:px-3 bg-green-700 hover:bg-green-600 text-white rounded" onclick="clearPopup()" >Apply and Close</button>
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

