module("setup test", {
	setup: function() {
		var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
		var groupid = candidate.group + '-panel';
		var html = '<div id="profiles"></div>'
		$("#qunit-fixture").append($(html));
	},
	teardown: function() {
		$("#qunit-fixture").empty();
	}
});

test("should render the name of of candidate", function() {
	var profile = new Profile(new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]))
	profile.render();
	equals($("#profiles").html().indexOf("马亚娜") > -1, true)
});

test("should render the college of of candidate", function() {
	var profile = new Profile(new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]))
	profile.render();
	equals($("#profiles").html().indexOf("西安交通大学") > -1, true)
});

test("should render the logic of of candidate", function() {
	var profile = new Profile(new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]))
	profile.render();
	equals($("#profiles").html().indexOf("12") > -1, true)
	
});

test("should render the gender of of candidate", function() {
	var profile = new Profile(new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]))
	profile.render();
	equals($("#profiles").html().indexOf("Female") > -1, true)
});

test("should render the wonderlic of of candidate", function() {
	var profile = new Profile(new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]))
	profile.render();
	equals($("#profiles").html().indexOf("26") > -1, true)
});

test("should render the id of of candidate", function() {
	var profile = new Profile(new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]))
	profile.render();
	equals($("#profiles").html().indexOf("profile-12") > -1, true)
});

