module("candidate_test", {
	setup: function() {
	}
});

test("should render the single candidate", function() {
    //1 马亚娜	18302968133	女	xiasiyu@qq.com	华中科技大学	master
    // 通信	health	6	0	2013-10-08-C组	B	2013-10-15-上午A组
    // B+		HR Campus Event
	var candidate = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "1", "", "", ""]);
	equals(12, candidate.id);
	equals("马亚娜", candidate.name);
	equals("女", candidate.gender);
	equals("西安交通大学", candidate.college);
	equals(candidate.department, "信息工程");
	equals(1, candidate.logic_score);
	equals(2, candidate.w_correct);
	equals("G-1-1", candidate.group)
	equals(candidate.grade, '1')
});

test("should she is female if the second value is 女", function() {
	var candidate = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "D", ""]);
	equals(candidate.is_female(), true)
});

test("should she is offered if the rank in total is not below 2-B", function() {
	var candidate1 = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "1", "", ""]);
	var candidate2 = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "2-A", "", ""]);
	var candidate3 = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "2-B", "", ""]);
	var candidate4 = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "2-C", "", ""]);
	var candidate5 = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "3", "", ""]);
	var candidate6 = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "A", "", ""]);
	var candidate7 = new Candidate([12, "马亚娜", "18302968133", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "D", "", ""]);

	equals(candidate1.is_offered(), true)
	equals(candidate2.is_offered(), true)
	equals(candidate3.is_offered(), true)
	equals(candidate4.is_offered(), false)
	equals(candidate5.is_offered(), false)
	equals(candidate6.is_offered(), false)
	equals(candidate7.is_offered(), false)
});

test("should export all candidates data no matter which grade", function() {
	var candidate = new Candidate([12, "马亚娜", "13772148940", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "D", "", ""]);
	equals(candidate.export_as().indexOf("D"), 0);
	
	candidate.grade = 1
    equals(candidate.export_as().indexOf("1"), 0);
});

test("should export candidate data with comments", function() {
	var candidate = new Candidate([12, "马亚娜", "13772148940", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "D", "", "#She is good at testing.	Ignore tab and trim blank #", ""]);
	equals(candidate.export_as().indexOf("##She is good at testing. Ignore tab and trim blank ##") > 0, true);
});

module("candidate_test", {
	setup: function() {
		var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
		var groupid = candidate.group;
		var html = '<div id="' + groupid + '" class="group" style="">'
					+ '<div class="grade gradeB ui-droppable"></div>'
					+ '<div class="grade gradeD ui-droppable"></div>'
					+ '</div>'
					+  '<div id="all-groups">'
					+  		'<div class="grade grade1" ></div>'
					+		'<div class="grade grade2-A"></div>'
					+		'<div class="grade grade2-B"></div>'
					+		'<div class="grade grade2-C"></div>'
					+		'<div class="grade grade3"></div>'
					+  '</div>';
		$("#qunit-fixture").append($(html));
	},
	teardown: function() {
		$("#qunit-fixture").empty();
		getLocalStorage().clear();
	}
});

test("should render the single candidate to its groupD by default", function() {
	var candidate = new Candidate([1, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	equals($(".gradeD #1").exists(), false)
	candidate.render();
	equals($(".gradeD #1").exists(), true)
});

test("should render the single candidate to specific group", function() {
	var candidate = new Candidate([12, "马亚娜", "13772148940", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "B", "", "", ""]);
	equals($(".gradeB #" + candidate.id).exists(), false)
	candidate.render();
	equals($(".gradeB #" + candidate.id).exists(), true)
});

test("should render the single candidate to overall rank group", function() {
	var candidate = new Candidate([12, "马亚娜", "13772148940", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "2-A", "", "", ""]);
	equals($(".grade2-A #" + candidate.id).exists(), false)
	candidate.render();
	equals($(".grade2-A #" + candidate.id).exists(), true)
});



