module("setup test", {
	setup: function() {
	}
});

test("should render the single candidate", function() {
	var candidate = new Candidate([12, "马亚娜", "女", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
	equals(12, candidate.id);
	equals("马亚娜", candidate.name);
	equals("女", candidate.gender);
	equals("西安交通大学", candidate.college);
	equals("信息工程", candidate.department);
	equals(12, candidate.logic_correct);
	equals(11, candidate.logic_answered);
	equals(26, candidate.w_correct);
	equals(47, candidate.w_answered);
	equals("G-1-2", candidate.group)
	equals('D', candidate.grade)
});

test("should consider the group as 1-x when the order is less than 50", function() {
	var candidate = new Candidate([12, "马亚娜", "女", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
	equals(12, candidate.id);
	equals("马亚娜", candidate.name);
	equals("女", candidate.gender);
	equals("西安交通大学", candidate.college);
	equals("信息工程", candidate.department);
	equals(12, candidate.logic_correct);
	equals(11, candidate.logic_answered);
	equals(26, candidate.w_correct);
	equals(47, candidate.w_answered);
	equals("G-1-2", candidate.group)
	equals('D', candidate.grade)
});

test("should she is female if the second value is 女", function() {
	var candidate = new Candidate([12, "马亚娜", "女", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
	equals(candidate.is_female(), true)
});

test("should consider the group as 2-x when the order is greater than 50", function() {
	var candidate = new Candidate([52, "马亚娜", "女", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
	equals(52, candidate.id);
	equals("G-2-1", candidate.group)
	equals('D', candidate.grade)
});


test("should return empty string if the user's grade has not been changed to overall grade", function() {
	var candidate = new Candidate([52, "马亚娜", "女", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
	equals("", candidate.export_as())

});

test("should return empty string if the user's grade has  been changed to overall grade", function() {
	var candidate = new Candidate([52, "马亚娜", "女", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
	candidate.grade = 1
	equals("马亚娜	女	西安交通大学	信息工程	13772148940	12	11	26	47	1", candidate.export_as())

});

module("setup test", {
	setup: function() {
		var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
		var groupid = candidate.group + '-panel';
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
	}
});

test("should render the single candidate to its groupD by default", function() {
	var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47]);
	equals($(".gradeD #" + candidate.id).exists(), false)
	candidate.render();
	equals($(".gradeD #" + candidate.id).exists(), true)
});

test("should render the single candidate to specific group", function() {
	var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, null, "B"]);
	equals($(".gradeB #" + candidate.id).exists(), false)
	candidate.render();
	equals($(".gradeB #" + candidate.id).exists(), true)
});

test("should render the single candidate to overall rank group", function() {
	var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, null, "2-A"]);
	equals($(".grade2-A #" + candidate.id).exists(), false)
	candidate.render();
	equals($(".grade2-A #" + candidate.id).exists(), true)
});



