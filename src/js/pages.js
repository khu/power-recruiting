function navigate_to(obj) {
	var targetPanel = target_panel_obj(obj);
	var currentNavigator = $(".list-item.item-selected > span");
	var currentPanel = target_panel_obj(currentNavigator)
	if (is_selecting_current(targetPanel, currentPanel)) {
		return;
	}
	$('#title').html(obj.html());
	to_hide(currentNavigator, currentPanel, 'item-selected')
	to_show(obj,targetPanel,'item-selected')
}

function target_panel_obj(span) {
	var id = $(span).attr('id');
	var toOpen = id.replace('open-', "")
	return $("#" + toOpen);
}
function to_hide(currentNavigator, currentPanel, css) {
	currentNavigator.parent().removeClass(css);
	if (currentPanel.attr('id') == "rank") {
		$(".list-sub-item").hide();
		$("#trash").hide();
	}
	$(currentPanel).hide();
}

function to_show(targetNavigator,targetPanel,css, direction) {
	targetNavigator.parent().addClass(css)
	if(!direction) {
		direction = "right";
	}
	
	if (targetPanel.attr('id') == "rank") {
		$(".list-sub-item").show();
		$("#trash").show();
	}
	
	$(targetPanel).show('slide', {direction: direction}, 200)
}

function is_selecting_current(current, target) {
	return current.attr('id') == target.attr('id')
}

function switch_to_group(obj) {
	var targetPanel = target_panel_obj(obj);
	var currentNavigator = $(obj).parent().parent().find(".sub-tab-button-active > span" );
	var currentPanel = target_panel_obj(currentNavigator)
	if (is_selecting_current(targetPanel, currentPanel)) {
		return;
	}
	to_hide(currentNavigator, currentPanel,"sub-tab-button-active")
	var direction = slide_moving_direction($(obj).parent().parent(), currentNavigator, obj, ".sub-tab-button");
	to_show(obj, targetPanel,"sub-tab-button-active", direction)
}

function slide_moving_direction(parent, currentElem, targetElem, select) {
	var current = index_in_scople(parent, currentElem,select)
	var target  = index_in_scople(parent, targetElem, select)

	return current > target ? "left" : "right";
}

function index_in_scople(parent, current_elem, select) {
	var array = $(parent).find(select);
	var length = array.length;
	for (var i = 0; i < length; i++) {
		if($(array[i]).attr("id") == current_elem.attr("id")) {
			return i;
		}
	}
	return -1;
}

function import_candidates(data_from, groupsCount){
	if (data_from.trim() == "") {
		return;
	}

	var candidates = new Candidates(groupsCount)

	getLocalStorage().clear();
	getLocalStorage().setItem('groupsCount', groupsCount);

	candidates.fromCSV(data_from);
	candidates.persist();
	candidates.render();
	init_pages();
}

function init_pages() {
	$(".sub-tab-button-container").click(function(){
		switch_to_group($(this).find('.sub-tab-button'));
	});
	
	init_drag_ability();
	init_drop_ability();
	
	init_profile_binding();
	init_new_candidate_container();
}

function init_drag_ability() {
	$(".candidate").draggable({
		revert: "invalid",
		helper: "clone"
	});
	
	$(".undraggable").draggable("disable");
}

function init_drop_ability() {
	$(".grade").droppable({
		accept: ".candidate",
		activeClass: "ui-state-highlight",
		drop: function( event, ui ) {
			var candidates = get_candidates_instance();
			candidates.rank(ui.draggable,$(this));
		}
	});
	
	$("#trash").droppable({
		accept: ".candidate",
		activeClass: "ui-state-highlight",
		drop: function(event, ui) {
			var candidates = get_candidates_instance();
			candidates.remove(ui.draggable.attr('id'));
			candidates.render();
			init_pages();
		}
	});
}

function init_profile_binding() {
	$(".candidate").click(function(){
		var candidateId = $(this).attr('id').replace('_last', '');
		$(this).colorbox({width:"50%", inline:true, href:"#profile-" + candidateId});
		
		var closingBoxEventName = 'cbox_cleanup';
		$(this).unbind(closingBoxEventName);
		$(this).bind(closingBoxEventName, function() {
			var comments = $("#comments_" + candidateId).val();
			if(comments != undefined){
				var candidates = get_candidates_instance();
				
				var candidate = candidates.find(candidateId);
				candidate.comments = comments;
				candidate.persist();
			}
		});
		$('.list-sub-item').unbind(closingBoxEventName);
	});
}

function init_new_candidate_container() {
	var newCandidateForm = new NewCandidateForm();
	newCandidateForm.render();
	
	$(".list-sub-item").click(function(){
		$(this).colorbox({width:"50%", inline:true, href:"#newCandidate"});
		
		var closingBoxEventName = 'cbox_cleanup';
		$(this).unbind(closingBoxEventName);
		$(this).bind(closingBoxEventName, function() {
			//save new candidate and render it in rank
			var newCandidateInfo = collect_new_candidate_info();
			newCandidateForm.saveNewCandidate(newCandidateInfo);
			
			var candidates = get_candidates_instance();
			candidates.render();
			init_pages();
		});
	});
}

function collect_new_candidate_info() {
	var ids = getLocalStorage().getItem('candidates_index').split(',');
	var newCandidateId = ids.length * 50;
	
	var info = [];
	info.push(newCandidateId);
	info.push($('#newCandidateName').val());
	info.push($('#newCandidateGender').val());
	info.push($('#newCandidateCollege').val());
	info.push('NaN');	//department
	info.push('NaN');	//phone
	info.push('NaN');	//answered-logic
	info.push($('#newCandidateLogic').val());
	info.push($('#newCandidateWonderlic').val());
	info.push('NaN');	//wonderlic-logic
	info.push(get_current_group()); //hard-coded group
	info.push('D');	//default grade
	info.push(wrapCommentsContent($('#newCandidateComments').val()));

	return info;
}

function wrapCommentsContent(comments){
	return "#" + comments + "#";
}

function get_current_group() {
	var activeGroup = $('#rank .sub-tab-button-active .sub-tab-button');
	
	return activeGroup.length == 0 ? 'G-1-1' : activeGroup[0].innerText;
}

function set_current_group(currentGroup) {
	var groupHeaders = $('#rank .sub-tab-button-container');
	for(var i=0; i<groupHeaders.size(); i++) {
		if (groupHeaders[i].children[0].innerText == currentGroup) {
			switch_to_group($(groupHeaders[i]).find('.sub-tab-button'));
			return;
		}
	}
}

function get_candidates_instance() {
	var candidates = new Candidates(getLocalStorage().getItem('groupsCount'));
	candidates.load();
	return candidates;
}

function export_candidates(data_to){
	var candidates = get_candidates_instance();
	data_to.val(candidates.export_as())
}

function statistic_draw() {
	var candidates = get_candidates_instance();
	var chart = new Highcharts.Chart({
	  chart: {
	     renderTo: 'diversity-chart',
	     margin: [50, 0, 0, 0],
	     backgroundColor: '#EEEEEE',
	     plotBorderWidth: 0,
	     plotShadow: false            
	  },
	  title: {
	    text: 'Gender diversity statistic for candidates', 
	  },
	  subtitle: {
	    text: 'Outer circle: All candidates<br/>Inner circle: Offered candidates',
	  },
	  tooltip: {
	     formatter: function() {
	        return '<b>'+ this.point.name +'</b><br/>'+ 
	           'Percentage: '+ Math.round(this.percentage) +' %<br/>'+
					 'Count: ' + this.y;
	     }
	  },
	  series: [{
			type: 'pie',
			name: 'Offered candidates',
			size: '45%',
			innerSize: '20%',
			data: [
			   { name: 'Male', y: candidates.offered_males_amount(), color: '#4572A7' },
			   { name: 'Female', y: candidates.offered_females_amount(), color: '#AA4643' }
			],
			dataLabels: {
			   enabled: false
			}
	  }, 
		{
	    type: 'pie',
	    name: 'All candidates',
	    innerSize: '45%',
	    data: [
	     { name: 'Male', y: candidates.males_amount(), color: '#4572A7' },
	     { name: 'Female', y: candidates.females_amount(), color: '#AA4643' }
	    ]
		}]
	});
	
	$("tspan:contains('Highcharts.com')").remove();
}

function load_group_count() {
	var groupsCount = getLocalStorage().getItem('groupsCount');
	if (groupsCount == null) {
		getLocalStorage().setItem('groupsCount', $("#groups-count").val());
	} else {
		$("#groups-count").val(groupsCount);
	}
}