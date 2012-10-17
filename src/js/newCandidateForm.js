var NewCandidateForm = $.Class.create({
	initialize: function() {
		this.template = '<div id="newCandidate" class="profile-panel">'
			+'<div class="profile-fieldset-title">Personal Info</div>'
			+ '<div class="profile-panel-body">'
				+ '<div class="profile-field">'
					+ '<div class="profile-form-label">'
						+ '<span>Name</span>'
					+ '</div>'
					+ '<div class="profile-form-field-container">'
						+ '<textarea class="single-line-textarea" id="newCandidateName"></textarea>'
					+ '</div>'
				+ '</div>'
				+ '<div class="profile-field">'
					+ '<div class="profile-form-label">'
						+ '<span>Gender</span>'
					+ '</div>'
					+ '<div class="profile-form-field-container">'
						+ '<textarea class="single-line-textarea" id="newCandidateGender"></textarea>'
					+ '</div>'
				+ '</div>'
				+ '<div class="profile-field">'
					+ '<div class="profile-form-label">'
						+ '<span>College</span>'
					+ '</div>'
					+ '<div class="profile-form-field-container">'
						+ '<textarea class="single-line-textarea" id="newCandidateCollege"></textarea>'
					+ '</div>'
				+ '</div>'
				+ '<div class="profile-field">'
					+ '<div class="profile-form-label">'
						+ '<span>Logic</span>'
					+ '</div>'
					+ '<div class="profile-form-field-container">'
						+ '<textarea class="single-line-textarea" id="newCandidateLogic"></textarea>'
					+ '</div>'
				+ '</div>'
				+ '<div class="profile-field">'
					+ '<div class="profile-form-label">'
						+ '<span>Wonderlic</span>'
					+ '</div>'
					+ '<div class="profile-form-field-container">'
						+ '<textarea class="single-line-textarea" id="newCandidateWonderlic"></textarea>'
					+ '</div>'
				+ '</div>'
				+ '<div class="profile-field">'
					+ '<div class="profile-form-label">'
						+ '<span>Comments</span>'
					+ '</div>'
					+ '<div class="profile-form-field-container">'
						+ '<textarea class="three-lines-textarea" id="newCandidateComments"></textarea>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</div>';
	},
	render:function() {
		var newCandidateContainer = $('#newCandidateContainer');
		newCandidateContainer.children().remove();
		newCandidateContainer.append($(this.template));
	},
	saveNewCandidate: function(info) {
		var newCandidate = new Candidate(info);
		
		this.persistNewCandidate(newCandidate);
	},
	persistNewCandidate: function(newCandidate) {
		var indexes = getLocalStorage().getItem('candidates_index');
		getLocalStorage().setItem('candidates_index', indexes + ',' + newCandidate.id);
		
		newCandidate.persist();
	}
});