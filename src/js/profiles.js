var Profiles = $.Class.create({
	initialize: function(candidates) {
		this.candidates = candidates;
		this.profiles = [];
	},
	render:function(){
		var length = this.candidates.size();
		for (var i = 0; i< length;i++) {
			new Profile(this.candidates.get(i)).render();
		}
		
	},
	clean:function() {
		$("#profiles").empty()
	}
});
