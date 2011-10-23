jQuery.fn.exists = function(){return jQuery(this).length>0;}


var Candidate = $.Class.create({
initialize: function(obj) {
	//1	马亚娜	F	Dev	Master	西安交通大学	信息工程	13772148940	12	11	26	47
	this.id = obj[0] - 0;
	this.name = obj[1];
	this.gender = obj[2];
	this.college = obj[3];
	this.department = obj[4];
	this.phone = obj[5];
	this.logic_score = obj[6]  - 0;
	this.logic_answered = obj[7]  - 0;
	this.w_correct = obj[8] - 0;
	this.w_answered = obj[9]  - 0;
	this.group = obj[10];
	this.grade = obj[11];
	this.comments = this.getCommentsContent(obj[12]);
	this.last_grade = obj[13] || this.grade;
},
getCommentsContent: function(comments){
	if (!comments || comments.length < 2) {
		return "";
	}
	return comments.substring(1, comments.length - 1);
},
gender_str:function() {
	return this.is_female() ? "Female" : "Male"
},
is_female:function() {
	var gender = this.gender.toLowerCase();
	return gender == 'f' || gender == 'female' || gender == '女';
},
is_offered:function() {
	var grade = this.grade.toUpperCase();
	return grade == '1' || grade == '2-A' || grade == '2-B';
},
display:function() {
	var	group = this.findExistingGroup()
	this.attachToGroup(group, this.getGrade())
},
updateGrade:function(grade) {
	var all_grade = ["gradeA","gradeB","gradeC", "gradeD", "grade1","grade2-A","grade2-B","grade2-C","grade3"]
	var candidate = this;
	$(all_grade).each(function(index, elem) {
		if (grade.indexOf(elem) > -1) {
			var newGrade = elem.replace("grade", "");
			if(candidate._is_single_group()){
				candidate.last_grade = candidate.grade;
			} else {
				candidate.last_grade = newGrade;
			}
			candidate.grade = newGrade;
		}
	})
},
updateGroup: function(grade) {
	var candidate = this;
	var groupId = grade.parent().attr('id').toString();
	
	if (groupId != "all-groups") {
		candidate.group = groupId;
	}
},
_is_single_group : function() {
	var all_grade = ["A","B", "C", "D"];
	var is_single_group = false;
	var candidate = this;
	$(all_grade).each(function(index, elem) {
		if (candidate.grade == elem) {
			is_single_group = true;
		}
	})
	return is_single_group;
},
render:function() {
	this.renderItself();
	this.renderItsLast();
},
renderItself: function() {
	var groupId;
	if (this._is_single_group()) {
		groupId = this.group;
	} else {
		groupId = "all-groups";
	}
	var css = " ui-widget-content " + (this.is_female() ? "female" : "male");
	var text = "<div id=" + this.id + " class='candidate ui-draggable " + css +"'><a href='index.html?id=" + this.id + "'>" + this.name + "</a><div class='score'>" + this.logic_score +" "+ this.w_correct + "</div></div>";
	var obj = $("#" + groupId + " .grade" + this.grade);
	obj.append(text)
},
renderItsLast: function() {
	var css = " ui-widget-content " + (this.is_female() ? "female" : "male");
	if (!this._is_single_group()){
		css += " undraggable "
		var text = "<div id=" + this.id + "_last class='candidate " + css +"'><a href='index.html?id=" + this.id + "'>" + this.name + "</a><div class='score'>" + this.logic_score +" "+ this.w_correct + "</div></div>";
		var obj = $("#" + this.group + " .grade" + this.last_grade);
		obj.append(text)
	}
},
findExistingGroup:function() {
	return $("#" + this.group);
},
toCSV:function() {
	return this.toString()
},
export_as: function() {
	var str = "" + this.name + "\t"
	+ this.gender+ "\t"
	+ this.college + "\t"
	+ this.department + "\t"
	+ this.phone + "\t"
	+ this.logic_score + "\t"
	+ this.logic_answered + "\t"
	+ this.w_correct  + "\t"
	+ this.w_answered + "\t"
	+ this.grade;
	if (this.comments != null && this.comments.length > 0) {
		str += "\t" + wrapCommentsContent(this.comments);
	}
	return str;
},
toString: function() {
	var str = "" + this.id + "\t"
	+ this.name + "\t"
	+ this.gender+ "\t"
	+ this.college + "\t"
	+ this.department + "\t"
	+ this.phone + "\t"
	+ this.logic_score + "\t"
	+ this.logic_answered + "\t"
	+ this.w_correct  + "\t"
	+ this.w_answered + "\t"
	+ this.group + "\t"
	+ this.grade + "\t"
	str += wrapCommentsContent(this.comments);
	if(!this._is_single_group()){
		str += "\t" + this.last_grade;
	}
	return str;
},
persist: function(){
	getLocalStorage().setItem('profile-' + this.id, this.toString());
}
});