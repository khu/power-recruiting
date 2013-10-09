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
	var candidates = new Candidates(groupsCount)

    getLocalStorage().clear();
    candidates.fromCSV(data_from);

    getLocalStorage().setItem('groupsCount', candidates.getGroupsCount());
    candidates.persist();
	candidates.render();
	init_pages();
}

function regroup_candidates(data) {
	var candidates = new Candidates(getLocalStorage().getItem('groupsCount'))
	candidates.load()
	objs = csv2array(data.trim(), "\t");
	if(!objs) return
	$.each(objs, function(i, obj){
		var candidateInfoItems = obj;
		var candidate = candidates.find_by_name(candidateInfoItems[0])
		if(candidate) {
			candidate.group = candidateInfoItems[1]
			candidate.persist()
		}
	});
	candidates.render();
	init_pages();
}

function load_demo_data(textarea) {
	var demo_data = "\
魏文彬	男	西安交通大学	计算机科学与技术	13500000001	12	11	37	45comment\n\
姜欣	男	西北工业大学	计算机科学与技术	13500000001	12	11	29	44	comment\n\
蒋新建	男	西安交通大学	计算机系统结构	13500000001	12	11	27	46	comment\n\
罗伟雄	男	西安交通大学	计算机科学与技术	13500000001	12	11	27	45	comment\n\
张华立	女	西安交通大学	信息工程	13500000001	12	11	26	47	comment\n\
龙丹妮	男	西北大学	计算机应用	13500000001	12	11	25	37	comment\n\
许三多	男	西北工业大学	微机电系统集成设计技术	13500000001	12	11	24	43	comment\n\
甘小宁	男	西电		13500000001	12	11	24	34	comment\n\
张玉生	男	西电	计算机	13500000001	12	11	23	37	comment\n\
王志刚	男	西电	计算机	13500000001	12	11	22	41	comment\n\
仕明	男	西电	计算机系统结构	13500000001	12	11	22	33	comment\n\
康洪雷	男	西电	计算机	13500000001	12	11	22	30	comment\n\
徐仕明	男	西交	计算机科学与技术	13500000001	12	11	21	43	comment\n\
舒崇福	男	上海交通大学	自动化双控	13500000001	12	11	20	32	comment\n\
王中军	女	西安交通大学	通信与信息系统	13500000001	12	11	20	40	comment\n\
杨文虎	男	西电		13500000001	12	11	16	17	comment\n\
赵明仁	女	西电	计算机应用技术	13500000001	12	11	16	26	comment\n\
王中磊	男	电信学院	计算机科学与技术	13500000001	12	11	16	20	comment\n\
施方平	女	西安交通大学	计算机科学与技术	13500000001	11	11	19	39	comment\n\
高爱平	男	西安交通大学	计算机软件与理论	13500000001	11	11	29	46	comment\n\
张寒冰	男	西北工业大学	计算数学	13500000001	11	11	28	45	comment\n\
韩志伟	女	西电	计算机应用技术	13500000001	11	11	27	36	comment\n\
姬建刚	女	西北大学	计算机软件与理论	13500000001	11	11	26	40	comment\n\
王世顺	男	西安交通大学	计算机科学与技术	13500000001	11	11	25	46	comment\n\
甄洪民	女	西北工业大学	计算机科学与技术	13500000001	11	11	25	37	comment\n\
冯志远	女	西安交通大学		13500000001	11	11	25	47	comment\n\
刘义强	男	西安交通大学	计算机系统结构	13500000001	11	11	23	44	comment\n\
杨峻峰	男	西安电子科技大学	计算机系统结构	13500000001	11	11	23	32	comment\n\
邓长叶	男	西电		13500000001	11	11	22	35	comment\n\
张金华	女	西安交通大学	计算机系统结构	13500000001	11	11	21	28	comment\n\
祝树良	女	西安电子科技大学	计算机应用	13500000001	11	11	20	34	comment\n\
张崇林	女	西交	计算机科学与技术	13500000001	11	11	20	43	comment\n\
邓宝	男	西北工业大学	计算机应用技术	13500000001	11	11	19	28	comment\n\
许兰	女	西安交通大学	软件工程	13500000001	11	11	18	34	comment\n\
刘海洋	男	西电	计算机软件	13500000001	11	11	16	33	comment";

    var demoData2 = "夏思雨测试	18302968133	女	xiasiyu@qq.com	华中科技大学	master	通信	health	6	0	2013-10-08-B组	B	2013-10-15-上午A组	A		\"HR \n\
        :123 \n\
    1231aaa\"	Campus Event \n\
毛超测试	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
魏文彬 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-B组	D		no comment	Campus Activity \n\
姜欣  	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AC组	D		no comment	Campus Activity \n\
蒋新建 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AC组	D		no comment	Campus Activity \n\
罗伟雄 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
张华立 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
龙丹妮 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
许三多 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
甘小宁 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
张玉生 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
王志刚 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
仕明  	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AA组	D		no comment	Campus Activity \n\
康洪雷 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AA组	D		no comment	Campus Activity \n\
徐仕明 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AC组	D		no comment	Campus Activity \n\
舒崇福 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
王中军 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
杨文虎 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AGG组	D		no comment	Campus Activity \n\
赵明仁 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
王中磊 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
施方平 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-FA组	D		no comment	Campus Activity \n\
高爱平 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-FA组	D		no comment	Campus Activity \n\
张寒冰 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
韩志伟 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
姬建刚 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-ABB组	D		no comment	Campus Activity \n\
王世顺 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-ABS组	D		no comment	Campus Activity \n\
甄洪民 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-FA组	D		no comment	Campus Activity \n\
冯志远 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-ABS组	D		no comment	Campus Activity \n\
刘义强 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AGG组	D		no comment	Campus Activity \n\
杨峻峰 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
邓长叶 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
张金华 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-FA组	D		no comment	Campus Activity \n\
祝树良 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
张崇林 	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
邓宝  	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-A组	D		no comment	Campus Activity \n\
许兰  	13809154213	女	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-AGG组	D		no comment	Campus Activity \n\
刘海洋 	13809154213	男	chaomao@thoughtworks.com	西北工业大学	bachelor	计算机	health	8	0	2013-10-08-D组	A	2013-10-20-ABB组	D		no comment	Campus Activity \n";
	textarea.val(demoData2);
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
				candidate.comments = comments.replace("\t", " ").replace("\n", " ").trim();
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
	var idsString = getLocalStorage().getItem('candidates_index');
	var newCandidateId = idsString === null ? 1 : idsString.split(',').length * 50;
	  //[12, "马亚娜", "13772148940", "女", "", "西安交通大学", "", "信息工程", "", 1, 2, "", "", "2013-10-15-上午A组", "2-A", "", "", ""]
	var info = [];
	info.push(newCandidateId);
	info.push($('#newCandidateName').val());
	info.push('NaN');	//phone
	info.push($('#newCandidateGender').val());
	info.push('NaN');	//mailbox
	info.push($('#newCandidateCollege').val());
	info.push('NaN');	//degree
	info.push('NaN');	//department
	info.push('NaN');	//status
	info.push($('#newCandidateLogic').val());
	info.push($('#newCandidateWonderlic').val());
	info.push('NaN');	//HR Group
	info.push('NaN');	//HR result
	info.push(get_current_group()); //hard-coded group
	info.push('D');	//default grade
	info.push('NaN');	//offer
	info.push(wrapCommentsContent($('#newCandidateComments').val()));
	info.push('NaN');	//info source

	return info;
}

function wrapCommentsContent(comments){
	var withoutTabOrEnter = comments.replace("\t", " ").replace("\n", " ");
	return "#" + withoutTabOrEnter.trim() + "#";
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

function get_group_name_by_index(index) {
    day = Math.floor(index/5) + 1;
    group_per_day = index%5 + 1;
    return 'G-' + day + '-' + group_per_day;
}