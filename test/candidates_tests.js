test("should parse the single candidate", function() {
	var candidates = new Candidates();
	candidates.fromCSV("马亚娜	F	西安交通大学	信息工程	13772148940	12	11	26	47");
	equals(1, candidates.size())
	candidate = candidates.find(1)
	equals(1, candidate.id);
	equals("马亚娜", candidate.name);
	equals("F", candidate.gender);
	equals("西安交通大学", candidate.college);
	equals("信息工程", candidate.department);
	equals(11, candidate.logic_correct);
	equals(12, candidate.logic_answered);
	equals(26, candidate.w_correct);
	equals(47, candidate.w_answered);
	equals("G-1-1", candidate.group);
	equals('D', candidate.grade);
	
	equals("1	马亚娜	F	西安交通大学	信息工程	13772148940	12	11	26	47	G-1-1	D	##", candidates.toCSV());
});

test("should parse multiple candidates", function() {
	var candidates = new Candidates();
	candidates.fromCSV("马亚娜	F	西安交通大学	信息工程	13772148940	12	11	26	47\n"
	+ "沈瞳	M	西安交通大学	计算机科学与技术	13659245448	12	11	37	45");
	equals(2, candidates.size())
	candidate = candidates.find(2)
	equals(2, candidate.id);
	equals("沈瞳", candidate.name);
	equals("M", candidate.gender);
});

test("should parse multiple candidates with the correct group", function() {
	var groupCountMoreThanFive = 10;
	
	var candidates = new Candidates(groupCountMoreThanFive);
	candidates.fromCSV("沈瞳	男	西安交通大学	计算机科学与技术	13659245448	12	11	37	45\n"
	+ "张中夏	男	西北工业大学	计算机科学与技术	13636818146	12	11	29	44\n"
	+ "张中夏	男	西北工业大学	计算机科学与技术	13636818146	12	11	29	44\n"
	+ "张中夏	男	西北工业大学	计算机科学与技术	13636818146	12	11	29	44\n"
	+ "张中夏	男	西北工业大学	计算机科学与技术	13636818146	12	11	29	44\n"
	+ "王奇凡	男	西安交通大学	计算机系统结构	13572945374	12	11	27	46\n");
	equals(6, candidates.size())
	
	candidate = candidates.find(1)
	equals(1, candidate.id);
	equals("沈瞳", candidate.name);
	equals("G-1-1", candidate.group);
	
	equals("G-1-2", candidates.find(2).group);
	equals("G-1-3", candidates.find(3).group);
	equals("G-1-4", candidates.find(4).group);
	equals("G-1-5", candidates.find(5).group);
	equals("G-2-1", candidates.find(6).group);
});

test("should escape the header", function() {
	var candidates = new Candidates();
	candidates.fromCSV("姓名	性别	学校	专业	电话	L正确	L答题	W正确	W答题");
	equals(0, candidates.size())
});

test("should only keep the int number", function() {
	var candidate1 = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidate2 = new Candidate([13, "马亚娜A", "M", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidate3 = new Candidate([14, "马亚娜B", "M", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidates = new Candidates();
	candidates.add(candidate1);
	candidates.add(candidate2);
	candidates.add(candidate3);
	equals(33, candidates.females_percentage())
});

test("should only keep the int number", function() {
	var candidate1 = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidate2 = new Candidate([13, "马亚娜A", "M", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidate3 = new Candidate([14, "马亚娜B", "M", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidates = new Candidates();
	candidates.add(candidate1);
	candidates.add(candidate2);
	candidates.add(candidate3);
	equals(3, candidates.size())
});

module("setup test", {
	setup: function() {
		getLocalStorage().clear()
	}
});

test("should save the candidate into storage", function() {
	var candidate1 = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidate2 = new Candidate([1, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidates = new Candidates();
	candidates.add(candidate1);
	candidates.add(candidate2);
	candidates.persist();
	var brandnew = new Candidates();
	brandnew.load()
	equals(2, brandnew.size())
});


module("setup test", {
	setup: function() {
		var candidate = new Candidate([12, "马亚娜", "F","西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
		var groupid = candidate.group;
		var html = '<div id="' + groupid + '" class="group" style="">'
					+ '<div class="grade gradeB ui-droppable"></div>'
					+ '<div class="grade gradeD ui-droppable"></div>'
					+ '</div>'
					+  '<div id="all-groups">'
					+  		'<div class="grade grade1" style="height:50px"></div>'
					+		'<div class="grade grade2-A" style="height:50px"></div>'
					+		'<div class="grade grade2-B" style="height:50px"></div>'
					+		'<div class="grade grade2-C" style="height:50px"></div>'
					+		'<div class="grade grade3" style="height:50px"></div>'
					+  '</div>';
		$("#qunit-fixture").append($(html));
	},
	teardown: function() {
		$("#qunit-fixture").empty();
	}
});

test("should first remove everything before render all", function() {
	var candidate = new Candidate([12, "马亚娜", "F",  "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	candidate.render();
	equals($(".gradeD #" + candidate.id).exists(), true)
	
	candidate.grade = "2-A"
	var candidates = new Candidates();
	candidates.add(candidate);
	candidates.render();
	equals($(".gradeD #" + candidate.id).exists(), false)
	equals($(".grade2-A #" + candidate.id).exists(), true)		
});

module("setup test", {
	setup: function() {
		var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
		var groupid = candidate.group;
		var html = '<div id="' + groupid + '" class="group" style="">'
					+ 	'<div class="grade gradeA"><div class="grade-bg-text">Rank 1</div></div>'
					+ 	'<div class="grade gradeB"></div>'
					+ 	'<div class="grade gradeC"></div>'
					+ 	'<div class="grade gradeD"></div>'
					+ '</div>'
					+  '<div id="all-groups">'
					+  		'<div class="grade grade1"><div class="grade-bg-text">Rank 1</div></div>'
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

test("should render add the water mark to all group back-in", function() {
	var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidates = new Candidates();
	candidates.add(candidate);
	equals($(".grade1 .grade-bg-text").html(), "Rank 1")
	candidates.render();
	equals($(".grade1 .grade-bg-text").html(), "Rank 1")
});

test("should render add the water mark to specific group back-in", function() {
	var candidate = new Candidate([12, "马亚娜", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidates = new Candidates();
	candidates.add(candidate);
	equals($(".gradeA .grade-bg-text").html(), "Rank 1")
	candidates.render();
	equals($(".gradeA .grade-bg-text").html(), "Rank 1")
});



