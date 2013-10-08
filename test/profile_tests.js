module("profile_test", {
	setup: function() {
		var candidate = new Candidate([12, "马亚娜", "13772148940", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "D", "", "good comments", ""]);
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
function assertEntireContentExist(content) {
	equals($("#profiles span:contains("+content+")").length > 0, true);
}
test("should render the name of candidate", function() {
	assertEntireContentExist('马亚娜');
});

test("should render the college of candidate", function() {
	assertEntireContentExist('西安交通大学');
});

test("should render the logic of candidate", function() {
	assertEntireContentExist('1');
});

test("should render the gender of candidate", function() {
	assertEntireContentExist("Female");
});

test("should render the wonderlic of candidate", function() {
	assertEntireContentExist("2");
});

test("should render the comments of candidate", function() {
	equals($("#profiles textarea:contains('good comments')").length > 0, true);
});

test("should render the id of candidate", function() {
	equals($("#profile-12").length > 0, true)
});