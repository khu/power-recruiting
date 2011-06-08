module("setup test", {
	setup: function() {
		var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "D", "G-1-1", "#good comments#"]);
		var groupid = candidate.group;
		var html = '<div id="profiles"></div>'
		$("#qunit-fixture").append($(html));
		var profile = new Profile(candidate);
		profile.render();
	},
	teardown: function() {
		$("#qunit-fixture").empty();
	}
});

test("should render the name of candidate", function() {
	equals($("#profiles").html().indexOf("马亚娜") > -1, true)
});

test("should render the college of candidate", function() {
	equals($("#profiles").html().indexOf("西安交通大学") > -1, true)
});

test("should render the logic of candidate", function() {
	equals($("#profiles").html().indexOf("12") > -1, true)
	
});

test("should render the gender of candidate", function() {
	equals($("#profiles").html().indexOf("Female") > -1, true)
});

test("should render the wonderlic of candidate", function() {
	equals($("#profiles").html().indexOf("26") > -1, true)
});

test("should render the id of candidate", function() {
	equals($("#profiles").html().indexOf("profile-12") > -1, true)
});

test("should render the comments of candidate", function() {
	equals($("#profiles").html().indexOf("good comments") > -1, true)
});