const smsID = function(id) {
    $.ajax({
      url: `/sendsms`,
      method: 'POST',
      data: id,
      success: function(result){
        console.log("everything went well. ", result);
      },
      error: function(error){
        console.log(error)
      }
  });
  console.log(id)
}
const orderCompleted = function(id) {
  $.ajax({
    url: `/order`,
    method: 'POST',
    data: id.toString(),
    success: function(result){
      location.reload(); //Need to make it only rerender the table
    },
    error: function(error){
      console.log(error)
    }
});
console.log(id)
}

