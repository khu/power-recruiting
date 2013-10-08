module("candidates_test", {
	setup: function() {
	}
});

test("should parse the single candidate", function() {
	var candidates = new Candidates();
        candidates.fromCSV("马亚娜	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-A组	A		no comment	Campus Activity");
	equals(1, candidates.size())
	candidate = candidates.find(1)
	equals(1, candidate.id);
	equals("马亚娜", candidate.name);
	equals("F", candidate.gender);
	equals("西安交通大学", candidate.college);
	equals("信息工程", candidate.department);
	equals(8, candidate.logic_score);
	equals(0, candidate.w_correct);
	equals("G-1-1", candidate.group);
	equals('A', candidate.grade);
	equals(candidates.toCSV() , "1	马亚娜	13772148940	F		西安交通大学		信息工程		8	0			G-1-1	A		#no comment#	");
});

test("should parse the single candidate with given group", function() {
	var candidates = new Candidates();
	candidates.fromCSV("马亚娜	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-A组	A		no comment	Campus Activity");
	candidate = candidates.find(1)
	equals(candidate.group, "G-1-1");
	equals(candidates.toCSV(), "1	马亚娜	13772148940	F		西安交通大学		信息工程		8	0			G-1-1	A		#no comment#	");
});

test("should parse multiple candidates", function() {
	var candidates = new Candidates();
	candidates.fromCSV("马亚娜	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-A组	A		no comment	Campus Activity\n"
	+ "沈瞳	 13772148940	M	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-A组	A		no comment	Campus Activity");
	equals(2, candidates.size())
	candidate = candidates.find(2)
	equals(2, candidate.id);
	equals("沈瞳", candidate.name);
	equals("M", candidate.gender);
});

test("should parse multiple candidates with the correct group", function() {
	var groupCountMoreThanFive = 10;
	var candidates = new Candidates(groupCountMoreThanFive);
	candidates.fromCSV("马亚娜	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-A组	A		no comment	Campus Activity\n"
	+ "亚娜	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-B组	A		no comment	Campus Activity\n"
	+ "马娜	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-C组	A		no comment	Campus Activity\n"
	+ "亚马	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-D组	A		no comment	Campus Activity\n"
	+ "娜马亚  	13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-E组	A		no comment	Campus Activity\n"
	+ "马娜亚	 13772148940	F	chaomao@thoughtworks.com	西安交通大学	bachelor	信息工程	health	8	0	2013-10-08-D组	A	2013-10-20-F组	A		no comment	Campus Activity\n");
	equals(6, candidates.size())
	candidate = candidates.find(1)
	equals(1, candidate.id);
	equals("马亚娜", candidate.name);
	equals("G-1-1", candidate.group);
	equals("G-1-2", candidates.find(2).group);
	equals("G-1-3", candidates.find(3).group);
	equals("G-1-4", candidates.find(4).group);
	equals("G-1-5", candidates.find(5).group);
	equals("G-2-1", candidates.find(6).group);
});

test("should escape the header", function() {
	var candidates = new Candidates();
	candidates.fromCSV("姓名	性别	学校	专业	电话	L正确	L答题	W正确	W答题	[组别]");
	equals(0, candidates.size())
});

function createCandidatesWithGivenGenders() {
	var candidates = new Candidates();
	candidates.add(new Candidate([12, "马亚娜", "13772148940", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "A", "", "", ""]));
	candidates.add(new Candidate([13, "马亚娜", "13772148940", "F", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "1", "", "", ""]));
	candidates.add(new Candidate([14, "马亚娜", "13772148940", "M", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "2-A", "", "", ""]));
	candidates.add(new Candidate([15, "马亚娜", "13772148940", "男", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "3", "", "", ""]));
	candidates.add(new Candidate([16, "马亚娜", "13772148940", "无", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "2-B", "", "", ""]));
	candidates.add(new Candidate([17, "马亚娜", "13772148940", "男人", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "D", "", "", ""]));
	return candidates;
}

test("should return the amount of all female/male candidates", function() {
	var candidates = createCandidatesWithGivenGenders();
	equals(2, candidates.females_amount());
	equals(4, candidates.males_amount());
});

test("should return the amount of offered female/male candidates", function() {
	var candidates = createCandidatesWithGivenGenders();
	equals(candidates.offered_females_amount(), 1);
	equals(candidates.offered_males_amount(), 2);
});

test("should export offered candidates ordered by rank", function() {
	var candidates = createCandidatesWithGivenGenders();
	var result = candidates.export_as().split('\n');
	equals(result.length, 6);
	equals(result[0], "1	马亚娜	F	西安交通大学	信息工程	13772148940	1	2	");
	equals(result[1], "2-A	马亚娜	M	西安交通大学	信息工程	13772148940	1	2	");
	equals(result[2], "2-B	马亚娜	无	西安交通大学	信息工程	13772148940	1	2	");
	equals(result[3], "3	马亚娜	男	西安交通大学	信息工程	13772148940	1	2	");
	equals(result[4], "A	马亚娜	女	西安交通大学	信息工程	13772148940	1	2	");
	equals(result[5], "D	马亚娜	男人	西安交通大学	信息工程	13772148940	1	2	");
});

module("candidates_test", {
	setup: function() {
		getLocalStorage().clear()
	}
});

test("should save two candidates into storage and then remove one", function() {
	var candidate1 = new Candidate([12, "马亚娜1", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidate2 = new Candidate([1, "马亚娜2", "F", "西安交通大学", "信息工程", "13772148940", 12, 11, 26, 47, "G-1-1", 'D']);
	var candidates = new Candidates();
	candidates.add(candidate1);
	candidates.add(candidate2);
	
	candidates.persist();
	candidates = new Candidates();
	candidates.load();
	equals(2, candidates.size());
	
	candidates.remove(1);
	candidates = new Candidates();
	candidates.load();
	equals(1, candidates.size());
	equals(true, candidates.find(12) != undefined);
	equals(true, candidates.find(1) == undefined);
});


module("candidates_test", {
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

module("candidates_test", {
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



