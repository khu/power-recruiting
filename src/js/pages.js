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
	currentNavigator.parent().removeClass(css)
	$(currentPanel).hide()
}

function to_show(targetNavigator,targetPanel,css, direction) {
	targetNavigator.parent().addClass(css)
	if(!direction) {
		direction = "right";
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

function import_candidates(data_from){
	var candidates = new Candidates()
	if (data_from.val().trim() == "") {
		candidates.clear();
		return;
	}
	candidates.fromCSV(data_from.val())
	candidates.persist();
	candidates.render();
	init_pages();
}

function init_pages() {
	$(".sub-tab-button-container").click(function(){
		switch_to_group($(this).find('.sub-tab-button'));
	});
	// let the gallery items be draggable
	$(".candidate").draggable({
		revert: "invalid", // when not dropped, the item will revert back to its initial position
		helper: "clone",
		cursor: "move"
	});
	// let the trash be droppable, accepting the gallery items
	$(".grade").droppable({
			accept: ".candidate",
			activeClass: "ui-state-highlight",
			drop: function( event, ui ) {
				var candidates = new Candidates();
				candidates.load()
				candidates.rank(ui.draggable,$(this));
			}
	});
}

function export_candidates(data_to){
	var candidates = new Candidates()
	candidates.load();
	data_to.val(candidates.export_as())
}