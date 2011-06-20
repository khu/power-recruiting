module("setup test", {
	setup: function() {
		var html = '<div id="newCandidateContainer"></div>'
		$("#qunit-fixture").append($(html));
		var newCandidateForm = new NewCandidateForm();
		newCandidateForm.render();
	},
	teardown: function() {
		$("#qunit-fixture").empty();
	}
});

test("should render the textareas for new candidate info", function() {
	equals($("#newCandidateContainer .single-line-textarea").length == 5, true)
	equals($("#newCandidateContainer .three-lines-textarea").length == 1, true)	
});