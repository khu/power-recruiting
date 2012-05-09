
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
	isMeaninglessInput: function(candidateInfoItems) {
		return candidateInfoItems.length < 9 || candidateInfoItems[1].length === 0;
	},
	isHeader: function(candidateInfoItems) {
		return candidateInfoItems.indexOf("姓名") > -1;
	},
	fromCSV:function(string) {
		if(string == null || string.trim() == ""){
			return;
		}
		objs = csv2array(string.trim(), "\t")
		if(!objs) return
		var size = objs.length;
		for (var i = 0; i < size; i++) {
			var candidateInfoItems = objs[i];
			if (this.isMeaninglessInput(candidateInfoItems) || this.isHeader(candidateInfoItems)){
				continue;
			}

			this.init_for_the_first_time(candidateInfoItems, i)
			this._candidates.push(new Candidate(candidateInfoItems))
		}
	},

	init_for_the_first_time:function(fieldsOfCandidate, i) {
		this.init_id(fieldsOfCandidate, i);
		this.init_comments(fieldsOfCandidate);
		if(fieldsOfCandidate.length === 12) {
			this.init_group(fieldsOfCandidate);
		} else if(fieldsOfCandidate.length === 13) {
			this.init_group_fill(fieldsOfCandidate);
		}
		this.init_grade(fieldsOfCandidate);

	},

	init_id:function(fieldsOfCandidate, i) {
		fieldsOfCandidate.unshift(i + 1);	
	},
	init_group_fill:function(fieldsOfCandidate) {
		fieldsOfCandidate[10] = fieldsOfCandidate[11];
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
		fieldsOfCandidate[12] = '#'+fieldsOfCandidate[10]+'#'
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
	remove: function(id) {
		this._candidates.splice(this.index(id), 1);
		
		var localStorage = getLocalStorage();
		localStorage.removeItem('candidates_index');
		localStorage.removeItem('profile-' + id);
		
		this.persist();
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
		var currentGroup = get_current_group();
		this.clean_init();
		this.init_groups();
		set_current_group(currentGroup);
		
		for (var i = 0; i < this.size(); i++) {
			var candidate = this.get(i);			
			candidate.render();
		}
		
		var profiles = new Profiles(this);
		profiles.clean();
		profiles.render();
	},
	init_groups: function() {
		var parent = $("#rank .sub-tab-header");
		var gradeElements = '<div class="grade gradeA"><div class="grade-bg-text">1</div></div>'
			+ '<div class="grade gradeB"><div class="grade-bg-text">2</div></div>'
			+ '<div class="grade gradeC"><div class="grade-bg-text">3</div></div>'
			+ '<div class="grade gradeD"><div class="grade-bg-text">Pass</div></div>';

		var groupNames = ['G-1-1','G-1-2','G-1-3','G-1-4','G-1-5',
							'G-2-1','G-2-2','G-2-3','G-2-4','G-2-5',
							'G-3-1','G-3-2'];
		var groupsCount = getLocalStorage().getItem('groupsCount');
		for (var i = 0; i < groupsCount; i++) {
			var selected = '';
			var display = 'display:none'
			if (i == 0) {
				selected = "sub-tab-button-active";
				display = "";
			}
			
			var panel_id = groupNames[i];
			var open_panel_id = 'open-' +  panel_id;
		
			var groupsHeader = '<div class="sub-tab-button-container ' + selected + '">'
				+ '<span class="sub-tab-button" id="' + open_panel_id + '">' + panel_id + '</span>'
			+ '</div>'
			parent.append($(groupsHeader));

			var groupElements = '<div id="' + panel_id + '" style="' + display + '"></div>';
			$("#single-group").append($(groupElements));

			$("#" + panel_id).append($(gradeElements));
		}
	},
	clean_init:function() {
		$(".candidate").remove();
		$("#rank .sub-tab-button-container").remove();
		$("#single-group > div").remove();
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
	export_as:function() {
		var sortedCandidates = this._candidates.sort(function(candidate1, candidate2){ 
			if (candidate1.grade === candidate2.grade) return 0;
			return (candidate1.grade > candidate2.grade) ? 1 : -1;
		});
		
		var exportingText = "";
		for(var i = 0; i < sortedCandidates.length; i++) {
			exportingText += sortedCandidates[i].export_as() + '\n';
		}
		if (exportingText.length > 0) {
			exportingText = exportingText.substring(0, exportingText.length - 1);
		}
		return exportingText;
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
    rank:function(candidate, grade) {
		var candidateInstance = this.find(candidate.attr('id'));
		candidateInstance.updateGrade(grade.attr('class').toString())
		candidateInstance.updateGroup(grade);
		candidateInstance.persist()

		if (this.fromSingleGroup(candidate) && this.toGradeInAll(grade)) {
			var id = candidate.attr('id');
			candidate.attr('id', id+'_last');
			candidate.addClass('undraggable');
			
			$('#'+id).remove();	//remove in-dragging card
			candidateInstance.renderItself();
			
			init_profile_binding();
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
	offered_females_amount:function() {
		var amount = 0;
		for (var i = 0; i < this.size(); i++) {
			var candidate = this.get(i);
			if (candidate.is_offered() && candidate.is_female()) {
				amount++
			}
		}
		return amount;
	},
	offered_males_amount:function() {
		var amount = 0;
		for (var i = 0; i < this.size(); i++) {
			var candidate = this.get(i);
			if (candidate.is_offered() && !candidate.is_female()) {
				amount++
			}
		}
		return amount;
	}
});