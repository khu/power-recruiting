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
	info.push('-');	//department
	info.push('-');	//phone
	info.push('-');	//answered-logic
	info.push($('#newCandidateLogic').val());
	info.push($('#newCandidateWonderlic').val());
	info.push('-');	//wonderlic-logic
	info.push('G-1-1'); //hard-coded group
	info.push('D');	//default grade
	info.push(wrapCommentsContent($('#newCandidateComments').val()));

	return info;
}

function wrapCommentsContent(comments){
	return "#" + comments + "#";
}

function get_current_group() {
	return $('sub-tab-button-active sub-tab-button').innerText;
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
	var canvasId = 'diversity-chart-canvas';
	clear_statistic_canvas($('#'+canvasId)[0])
	
	var candidates = get_candidates_instance();
	
	var diversityPie = new RGraph.Pie(canvasId, [candidates.females_amount(),candidates.males_amount()]);
	var females_label = candidates.females_percentage() + "%";
	var male_label = candidates.males_percentage() + "%";

	diversityPie.Set('chart.labels', ['Female (' + females_label + ')', 'Male (' + male_label + ')']);
	diversityPie.Set('chart.gutter', 30);
	diversityPie.Set('chart.shadow', false);
	diversityPie.Set('chart.tooltips.effect', 'contract');
	diversityPie.Set('chart.tooltips', [
		candidates.females_amount() + ' of ' + candidates.size(),
		candidates.males_amount() + ' of '  + candidates.size(),
	]);
	diversityPie.Set('chart.highlight.style', '3d');
	diversityPie.Set('chart.zoom.hdir', 'center');
	diversityPie.Set('chart.zoom.vdir', 'up');
	diversityPie.Set('chart.labels.sticks', true);
	diversityPie.Set('chart.labels.sticks.color', '#aaa');
	diversityPie.Set('chart.contextmenu', [['Zoom in', RGraph.Zoom]]);
	diversityPie.Set('chart.linewidth', 5);
	diversityPie.Set('chart.labels.sticks', true);
	diversityPie.Set('chart.strokestyle', 'transparent');
	diversityPie.Set('chart.colors', ["pink", "#CCF"]);
	diversityPie.Draw();
}

function clear_statistic_canvas(canvas) {
	var context = canvas.getContext('2d');
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	var w = canvas.width;
	canvas.width = 1;
	canvas.width = w;
}

function load_group_count() {
	var groupsCount = getLocalStorage().getItem('groupsCount');
	if (groupsCount == null) {
		getLocalStorage().setItem('groupsCount', $("#groups-count").val());
	} else {
		$("#groups-count").val(groupsCount);
	}
}