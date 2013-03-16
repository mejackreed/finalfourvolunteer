function testSubmit() {
	jQuery.ajax({
		url : "/api/signup",
		type : "PUT",
		data : {
			"first_name" : $('#firstName').val(),
			"last_name" : $('#lastName').val(),
			"email" : $('#inputEmail').val(),
			"password" : $('#inputPassword').val(),
			"twitter" : $('#twitter').val(),
			"mobile" : $('#mobile').val()
		},
		success : function(data, textStatus, jqXHR) {
			console.log("Post resposne:");
			console.dir(data);
			console.log(textStatus);
			console.dir(jqXHR);
		}
	});
}