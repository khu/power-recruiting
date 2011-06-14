function getLocalStorage() {
  return window['localStorage'];
}

var Candidates = $.Class.create({
	initialize: function(groupsCount) {
		this._candidates = [];
		this._groupsCount = groupsCount == null ? 5 : groupsCount;
	},
	// methods
	size: function() {
		return this._candidates.length;
	},
	toString: function() {
		return "candicates type " + this.size();
	},
	add:function(candidate) {
		this._candidates.push(candidate)
	},
	toCSV:function() {
		var str = ""
		var size = this._candidates.length
		for(var i = 0; i < size; i++) {
			str += this._candidates[i].toCSV()
			if (i < size - 1) {
				str += "\n"
			}
		}
		return str;
	},
	fromCSV:function(string) {
		if(string == null || string.trim() == ""){
			return;
		}
		objs = csv2array(string.trim(), "\t")
		if(!objs) return
		var size = objs.length;
		for (var i = 0; i < size; i++) {
			if (objs[i].indexOf("姓名") > -1){
				continue;
			}

			this.init_for_the_first_time(objs[i], i)
			this._candidates.push(new Candidate(objs[i]))
		}
	},
	init_for_the_first_time:function(fieldsOfCandidate, i) {
		if (fieldsOfCandidate.length == 9) {
			this.init_id(fieldsOfCandidate, i);
			this.init_group(fieldsOfCandidate);
			this.init_grade(fieldsOfCandidate);
			this.init_comments(fieldsOfCandidate);
		};
	},
	init_id:function(fieldsOfCandidate, i) {
		fieldsOfCandidate.unshift(i + 1);	
	},
	init_group:function(fieldsOfCandidate) {
		var candidateIndex = fieldsOfCandidate[0] - 1;
		
		var groupIndex = candidateIndex % this._groupsCount;

		var groupsPerDay = this._groupsCount < 5 ? this._groupsCount : 5;
		var group = groupIndex % groupsPerDay + 1;
		var day = Math.floor(groupIndex / groupsPerDay) + 1;
		
		fieldsOfCandidate[10] = "G-" + day + "-" + group;
	},
	init_grade:function(fieldsOfCandidate) {
		fieldsOfCandidate[11] = 'D'
		fieldsOfCandidate[13] = ''
	},
	init_comments:function(fieldsOfCandidate) {
		fieldsOfCandidate[12] = '##'
	},
	find:function(id) {
		var size = this._candidates.length
		for (var i = 0; i < size; i++) {
			if (this._candidates[i].id == id) {
				return this._candidates[i]
			}
		}

		return null;
	},
	index:function(id) {
		var size = this._candidates.length
		for (var i = 0; i < size; i++) {
			if (this._candidates[i].id == id) {
				return i;
			}
		}
		return -1;
	},
	contains:function(id) {
		return this.index(id) != -1;
	},
	get:function(index) {
		return this._candidates[index];
	},
	update:function(candidate) {
		var index = this.index(candidate.id)
		if (index == -1) return;
		this._candidates.splice(index, 1);
		this.add(candidate)
	},
	render:function() {
		var parent = $("#rank .sub-tab-header");
		this.clean_init()
		for (var i = 0; i < this.size(); i++) {
			var candidate = this.get(i);
			var selected = '';
			var display = 'display:none'
			if (i == 0) {
				selected = "sub-tab-button-active";
				display = "";
			}
			var open_panel_id = 'open-' +  candidate.group;
			var panel_id = candidate.group;
			if ($("#" + open_panel_id).length == 0) {
				var template = '<div class="sub-tab-button-container ' + selected + '">'
					+ '<span class="sub-tab-button" id="' + open_panel_id + '">' + candidate.group + '</span>'
				+ '</div>'
				var rendered = $(template);
				parent.append(rendered);
				
				if ($('#' + panel_id).length == 0) {
					var content = '<div id="' + panel_id + '" style="' + display + '"></div>';
					$("#single-group").append($(content));
				}
			}
			if ($("#" + panel_id + " .grade-bg-text").length == 0) {
				var content = '<div class="grade gradeA"><div class="grade-bg-text">1</div></div>'
					+ '<div class="grade gradeB"><div class="grade-bg-text">2</div></div>'
					+ '<div class="grade gradeC"><div class="grade-bg-text">3</div></div>'
					+ '<div class="grade gradeD"><div class="grade-bg-text">Pass</div></div>'
				$("#" + panel_id).append($(content));
			}
			candidate.render()
		}
		new Profiles(this).render();

	},
	clean_init:function() {
		$(".candidate").remove();
		$("#rank .sub-tab-button-container").remove();
	},
	persist:function() {
		if(!getLocalStorage().getItem('candidates_index')){
			this.init_perist_data();
		}
		var size = this._candidates.length
			for (var i = 0; i < size; i++) {
				this._candidates[i].persist();
			}		
	},
	init_perist_data:function(){
		var profile_index_str = ''
		var size = this._candidates.length
		for (var i = 0; i < size; i++) {
			profile_index_str += this._candidates[i].id + ','
		}
		getLocalStorage().setItem('candidates_index', profile_index_str.replace(/,$/, ''));
	},
	try_persist_and_load:function(html) {
		if (!getLocalStorage().getItem('candidates_index')) {
			this.fromCSV(html);
			this.persist();
		} else {
			this.load();
		}
	},
	clear:function() {
		getLocalStorage().clear();		
	},
	export_as:function() {
		var str = ""
		var size = this._candidates.length
		for(var i = 0; i < size; i++) {
			var export_as = this._candidates[i].export_as();
			if (export_as == "") {
				continue;
			}
			str += this._candidates[i].export_as()
			if (i < size - 1) {
				str += "\n"
			}
		}
		return str;	
	},
	load:function() {
		var profile_index_str = getLocalStorage().getItem('candidates_index');

		profiles_id_array = profile_index_str.split(",")
		var size = profiles_id_array.length
		for(var i = 0; i < size; i++) {
			var CSV_data = getLocalStorage().getItem('profile-' + profiles_id_array[i]);
			if(CSV_data == null){
				continue;
			}
			obj_array = CSV_data.split("\t");

			var candidate = new Candidate(obj_array);
			this._candidates.push(candidate)
		}
	},
    rank:function($item, grade) {
		var candidate = $item;

		var candidateInstance = this.find($item.attr('id'));
		candidateInstance.updateGrade(grade.attr('class').toString())
		candidateInstance.updateGroup(grade);
		candidateInstance.persist()

		if (this.fromSingleGroup(candidate) && this.toGradeInAll(grade)) {
			var id = candidate.attr('id');
			candidate.attr('id', id+'_last');
			candidate.addClass('undraggable');
			$('#'+id).remove();
			candidateInstance.renderItself();
			
			new Profile(candidateInstance).render();
			init_drag_ability();
		} 
		else if ((this.fromSingleGroup(candidate) && this.toGradeForGroup(grade))
				|| (this.fromAllGroups(candidate) && this.toGradeInAll(grade))){
			candidate.appendTo(grade).fadeIn();
		} 
		else if (this.fromAllGroups(candidate) && this.toGradeForGroup(grade)){
			$("#single-group > div").find("#"+candidate.attr("id")).remove();
			$("#single-group > div").find("#"+candidate.attr("id") + "_last").remove();
			candidate.appendTo(grade).fadeIn();
		}
	},
	fromSingleGroup:function(item){
		return item.parent().parent().parent().attr("id") == "single-group";
	},
	fromAllGroups:function(item){
		return item.parent().parent().attr("id") == "all-groups";
	},
	toGradeForGroup:function(grade){
		return grade.parent().parent().attr("id") == "single-group";
	},
	toGradeInAll:function(grade){
		return grade.parent().attr("id") == "all-groups"
	},
	females_amount:function() {
		var amount = 0;
		for (var i = 0; i < this.size(); i++) {
			if (this.get(i).is_female()) {
				amount++
			}
		}
		return amount;
	},
	males_amount:function() {
		return this.size() - this.females_amount();
	},
	females_percentage:function() {
		var females_percentage = (this.females_amount() / this.size()) * 100
		return Math.round(females_percentage)
	},
	males_percentage:function() {
		return 100 - this.females_percentage();
	}
});