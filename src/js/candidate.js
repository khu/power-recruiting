jQuery.fn.exists = function () {
	return jQuery(this).length > 0;
}


var Candidate = $.Class.create({
	comments_index: 18,
	raw_comments_index: 16,
	grade_index: 14,
	prev_grade_index: 20,
	group_index: 13,
	group_code_index: 21,

	initialize: function (obj, i) {
		//1 马亚娜	18302968133	女	xiasiyu@qq.com	华中科技大学	master	通信	health	6	0
		// 2013-10-08-C组	B	2013-10-15-上午A组	B+		HR Campus Event
		if (i != undefined) {
			obj = this.init_for_the_first_time(obj, i);
		} else {
			this.init_comments(obj);
		}

		this.id = obj[0] - 0;
		this.name = obj[1];
		this.phone = obj[2];
		this.gender = obj[3];
		this.college = obj[5];
		this.department = obj[7];
		this.logic_score = obj[9] - 0;
		this.w_correct = obj[10] - 0;
		this.group = obj[this.group_index] == undefined ? "G-1-1" : obj[this.group_index];
		this.grade = obj[this.grade_index] == undefined ? 'D' : obj[this.grade_index];
		this.comments = this.getCommentsContent(obj[this.comments_index]);
		this.last_grade = obj[this.prev_grade_index] || this.grade;
		this.group_name = obj[this.group_index];
	},
	init_for_the_first_time: function (fieldsOfCandidate, i) {
		this.init_id(fieldsOfCandidate, i);
		this.init_comments(fieldsOfCandidate);
		this.init_grade(fieldsOfCandidate);
		return fieldsOfCandidate;
	},

	init_id: function (fieldsOfCandidate, i) {
		fieldsOfCandidate.unshift(i + 1);
	},
	updateGroupIndex: function (groups) {
		this.group = groups[this.group_name];
	},
	init_grade: function (fieldsOfCandidate) {
		fieldsOfCandidate[this.grade_index] = 'D';
	},
	init_comments: function (fieldsOfCandidate) {
		fieldsOfCandidate[this.comments_index] = '#' + fieldsOfCandidate[this.raw_comments_index] + '#'
	},
	getCommentsContent: function (comments) {
		if (!comments || comments.length < 2) {
			return "";
		}
		return comments.substring(1, comments.length - 1);
	},
	gender_str: function () {
		return this.is_female() ? "Female" : "Male"
	},
	is_female: function () {
		var gender = this.gender.toLowerCase();
		return gender == 'f' || gender == 'female' || gender == '女';
	},
	is_offered: function () {
		var grade = this.grade.toUpperCase();
		return grade == '1' || grade == '2-A' || grade == '2-B';
	},
	display: function () {
		var group = this.findExistingGroup()
		this.attachToGroup(group, this.getGrade())
	},
	updateGrade: function (grade) {
		var all_grade = ["gradeA", "gradeB", "gradeC", "gradeD", "grade1", "grade2-A", "grade2-B", "grade2-C", "grade3"];
		var candidate = this;
		var newGrade = _.find(all_grade,function (gradeClass) {
			return grade.indexOf(gradeClass) > -1;
		}).replace("grade", "");
		candidate.last_grade = candidate._is_single_group() ? candidate.grade : newGrade;
		candidate.grade = newGrade;
	},
	updateGroup: function (grade) {
		var candidate = this;
		var groupId = grade.parent().attr('id').toString();

		if (groupId != "all-groups") {
			candidate.group = groupId;
		}
	},
	_is_single_group: function () {
		var candidate = this;
		return _.find(["A", "B", "C", "D"], function (grade) {
			return candidate.grade == grade;
		}) != undefined;
	},
	render: function () {
		this.renderItself();
		this.renderItsLast();
	},
	renderItself: function () {
		var groupId = this._is_single_group() ? this.group : "all-groups";
		var css = " ui-widget-content " + (this.is_female() ? "female" : "male");
		var text = "<div id=" + this.id + " class='candidate ui-draggable " + css + "'><a href='index.html?id=" + this.id + "'>" + this.name + "</a><div class='score'>" + this.logic_score + " " + this.w_correct + "</div></div>";
		var obj = $("#" + groupId + " .grade" + this.grade);
		obj.append(text);
	},
	renderItsLast: function () {
		var css = " ui-widget-content " + (this.is_female() ? "female" : "male");
		if (!this._is_single_group()) {
			css += " undraggable "
			var text = "<div id=" + this.id + "_last class='candidate " + css + "'><a href='index.html?id=" + this.id + "'>" + this.name + "</a><div class='score'>" + this.logic_score + " " + this.w_correct + "</div></div>";
			var obj = $("#" + this.group + " .grade" + this.last_grade);
			obj.append(text);
		}
	},
	findExistingGroup: function () {
		return $("#" + this.group);
	},
	toCSV: function () {
		return this.toString();
	},
	export_as: function () {
		var str = "" + this.grade + "\t"
			+ this.name + "\t"
			+ this.gender + "\t"
			+ this.college + "\t"
			+ this.department + "\t"
			+ this.phone + "\t"
			+ this.logic_score + "\t"
			+ this.w_correct + "\t"
		if (this.comments != null && this.comments.length > 0) {
			str += "\t" + wrapCommentsContent(this.comments);
		}
		return str;
	},
	toString: function () {
		//1 马亚娜	18302968133	女	xiasiyu@qq.com	华中科技大学	master
		// 通信	health	6	0	2013-10-08-C组	B	2013-10-15-上午A组
		// B+		HR Campus Event
		var str = "" + this.id + "\t"
			+ this.name + "\t"
			+ this.phone + "\t"
			+ this.gender + "\t\t"
			+ this.college + "\t\t"
			+ this.department + "\t\t"
			+ this.logic_score + "\t"
			+ this.w_correct + "\t\t\t"
			+ this.group + "\t"
			+ this.grade + "\t\t";

		str += this.comments;
		str += "\t\t\t\t" + this.last_grade;
		return str;
	},
	persist: function () {
		getLocalStorage().setItem('profile-' + this.id, this.toString());
	}
});