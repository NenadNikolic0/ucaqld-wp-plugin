jQuery(document).ready(function(){
	
  // main array with posts
  var posts = [];
	
  var data={};
  data.action = 'MyPlugin_GetVars'
    jQuery.post('/wp-admin/admin-ajax.php', data, function(response) {
		
		// default custom values in theme
		var default_theme_types = ["ajde_events","staff-member","avada_portfolio","avada_faq","contact","slide","fusion_template"];
		
		// declare empty type property
		var type_array = [];
		
		// convert string response to json object
		response = JSON.parse(response);
		
        
		// iterate throught all properties in respons and add in type array if not exist in default_theme_types 
		for (var property in response) {
		
			if(default_theme_types.indexOf(property)===-1){
				type_array.push(property);
			}
		} 
		
		// iterate throught all custom posts and create promise for each type 
		if(type_array && type_array.length!=0) {
			// create empty promise array 
			var promise_array = [];
			
			// url address for async calls
			var url;
			
			
			// fill promise array with promises
			type_array.forEach((type)=>{
				url = window.location.origin + "/wp-json/wp/v2/" + type ;
				var jsPromise = Promise.resolve(jQuery.get(url));
				promise_array.push(jsPromise);
			});
			
			// call all promises async
			Promise.all(promise_array).then(function(values) {
														
            posts = values;
																	
			// Hide loading spinner 
			jQuery(".loader-over-page").css("display","none");	
				
			// Order data in each cpt by date 
			if(posts && posts.length!=0){
				posts.forEach((post) => {
					post = post.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
				});
			}	
				
				
				
			console.log('Received data:',posts);
			
			// Populate dropdown 
			populateDropdown(posts);
				
			// populate html 
			populateHtml(posts);
				
				
			});
			
			
		}
		
		
		
		
               
    }); 
	
	 // Populate dropdown
	 function populateDropdown(typeArray){
	   // Get dropdown element from DOM
       var dropdown = document.getElementById("dropdownSelect");
		 
	   var types = [];
	   if(typeArray && typeArray.length!=0){
		   typeArray.forEach((element)=>{
			   // if type contains children skip it 
			   if(String(element[0].type).indexOf("child") === -1) {
				   types.push(element[0].type);
			   }			   
			   // else find parent name and add category as property for filtering purpose 
			   else {
				   var parent_name = String(element[0].type).slice(0,String(element[0].type).indexOf("_")).toLowerCase().trim();
				   var category ="";
				   for(let i in posts){
					   if(posts[i] && posts[i].length!=0){
						   posts[i].forEach((post)=>{
							   if(post.title && String(post.title.rendered).toLowerCase().trim().indexOf(parent_name) !==-1 ){
								   category = post.type;
							   }
						   });
					   }
				   }
				   
				   element.forEach((el)=>{
					   el.category = category;
				   });
			   }
		   });
	   }
		 
	   var new_type = [{'value':"All categories", 'text':"All categories"}];
		 
	   // Go through types and transform values
	  types.forEach((type) => {
		   var new_item = type;
		   var new_item_value = new_item;
		   new_item = capitalizeFirstLetter(new_item.replace(/uniting_church_agenc/g,"uniting church agencies").replace(/_/g," "));
		   new_type.push({'value':new_item, 'text':new_item_value});  
		  
	  });
		  
	    
		 
	   console.log('Types:',new_type);	 
     
       // Loop through the array       
       jQuery('#dropdownSelect').empty();
       // Get dropdown element from DOM
       var dropdown = document.getElementById("dropdownSelect");

       // Loop through the array
       for (var i = 0; i < new_type.length; ++i) {
       // Append the element to the end of Array list
       dropdown[dropdown.length] = new Option(new_type[i].value, new_type[i].text);
       }
		 
	 	   
	 }
	
	
	// Function that will populate html
	function populateHtml(all_posts){
		var html = "";
		var subsections = [];
		if(all_posts && all_posts.length!=0){
			all_posts.forEach((post) => {							 
				// Check if post type doesn't contain child (not a subpost)				
				if(String(post[0].type).indexOf("_child")===-1){
					html += "<h1 class='post-type-title'>" + capitalizeFirstLetter(post[0].type.replace(/uniting_church_agenc/g,"uniting church agencies").replace(/_/g," ")) + "</h1>" + "<br/>";
				   if(post && post.length!=0) {
					post.forEach((postType)=>{
                        var post_title = String(postType.title.rendered).toLowerCase().trim().replace(" ","_");						
						html +="<div class='post-type post-type-"  + post_title +"'><h3>" + postType.title.rendered + "</h3>" + "<br/>" + "<span class='post-type-content'>" + postType.content.rendered + "</span><br/></div>";
					});
					
					html += "<br/><br/>"
				}
					
				}
				
				else {
					var sub_html = "";
				    if(post && post.length!=0) {
					post.forEach((postType)=>{
						// Correct postType content to mark example
						if(String(postType.content.rendered).indexOf("Example")!==-1 && String(postType.content.rendered).indexOf("marked-text")===-1){
						 postType.content.rendered = String(postType.content.rendered).slice(0,String(postType.content.rendered).indexOf('Example')) +
						"<span class='marked-text'>" + String(postType.content.rendered).slice(String(postType.content.rendered).indexOf('Example')) + "</span>";
						}
						
						else if(String(postType.content.rendered).indexOf("Reference")!==-1  && String(postType.content.rendered).indexOf("marked-text")===-1 ){
						 postType.content.rendered = String(postType.content.rendered).slice(0,String(postType.content.rendered).indexOf('Reference')) +
						"<span class='marked-text'>" + String(postType.content.rendered).slice(String(postType.content.rendered).indexOf('Reference')) + "</span>";
						}
																	
						sub_html +="<div class='post-type-sub post-type-sub-"  + String(postType.type).toLowerCase().trim().substr(0,String(postType.type).indexOf("_")).replace(" ","_") +"'><h4 class='post-title-h4'>" + postType.title.rendered + "</h4>" + "<br/>" + "<span class='post-type-content'>" + postType.content.rendered + "</span><br/></div>";
						
					});
					sub_html += "<br/><br/>";
					subsections.push({'parent-post':String(post[0].type).toLowerCase().trim().replace("_child",""), 'html':sub_html});
				}
					
					
					
				}
				
				
				
		
			});
		}
		
		// First empty existing div 
		jQuery(".left-side-content").empty();
		
		if(html==""){
			if(subsections.length ===0){
				html = "<span class='result-not-found'>Result not found for this filter combination.</span>";			
			}	
		}
		

		//Inner html 
		jQuery(".left-side-content").append(html);
		
				// Append child items to sections 
		if(subsections && subsections.length!=0){
					subsections.forEach((sub) => {
						if(jQuery('.post-type-'+sub["parent-post"]).length==0){
											html +="<div style='margin-top:20px;' class='post-type post-type-"  + String(sub["parent-post"]).toLowerCase().trim() +"'><h1>" + capitalizeFirstLetter(String(sub["parent-post"]).toLowerCase().trim()) + "</h1>" + "<br/><br/></div>";
							}

					});
		}
		
	
		// Append child items to sections 
		if(subsections && subsections.length!=0){
			subsections.forEach((sub) => {
				jQuery('.post-type-'+sub["parent-post"]).append(sub.html);				
			});
		}
		
	  
		// Hide uniting title 
		 jQuery('h3').filter(function(index) { return jQuery(this).text() === "Uniting"; })[0].innerText="" ;
		
		
	}
	
	// Capitalize first letter	 
	function capitalizeFirstLetter(stringValue) {
    	return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
     }	
	
	
	
	// Prevent loading page click 
	jQuery(document).on("click",".loader-over-page", function(event){
		event.preventDefault();
		event.stopPropagation();
	});
	
	
	// Filter posts on search click 
	jQuery(document).on("click",".search-button", function(){
		filter();	
	});
	
	// Filter posts on enter press 
	jQuery(document).on("keypress",function(e){
		var keycode = (e.keyCode ? e.keyCode : e.which);
		if (keycode == '13') {
			filter();
		}			
	});
	
	
	// Initial searchbar distance from top 
	var searchDistance = jQuery('.search-wrapper').offset().top;
	
	// Sticky search functionality 
	 jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() >= searchDistance) {
            jQuery('.search-wrapper').addClass('stickytop');
        }
        else {
            jQuery('.search-wrapper').removeClass('stickytop');
        }
    });
	
	
	// Filter function 
	function filter(){
		var search_value = String(jQuery(".search-field").val()).toLowerCase().trim();
		var selected_category = String(jQuery("#dropdownSelect").val()) ? String(jQuery("#dropdownSelect").val()) : "All categories";		
		var filtered_posts=[];
		
		if(selected_category!="All categories") {
			
			if(search_value!=""){
				// Filter array by value and category  
					 if(posts && posts.length!=0){
					 posts.forEach((post_array)=>{
						 if(post_array && post_array.length!=0) {
							 var new_array = [];
							 post_array.forEach((post_array_posts) => {
								
								if((String(post_array_posts.title.rendered).toLowerCase().trim().indexOf(search_value)!==-1 || String(post_array_posts.content.rendered).toLowerCase().trim().indexOf(search_value)!==-1) && 
								   (String(post_array_posts.type).trim() == selected_category || (post_array_posts.category && String(post_array_posts.category).trim() == selected_category)
									|| (post_array_posts.category && String(post_array_posts.category).trim() == (selected_category.substr(0,selected_category.indexOf("_")) + "_child"))
								    )){
								 new_array.push(post_array_posts);
							 }
							 });
							if(new_array && new_array.length!=0){
								filtered_posts.push(new_array);
							}
							
						 }
					 });
				 }
			}
			
			else {
				    debugger;
					// Filter array by category only 
					 if(posts && posts.length!=0){
					 posts.forEach((post_array)=>{
						 if(post_array && post_array.length!=0){
							 var new_array_n=[];
							 post_array.forEach((post_in_array)=>{
							 if(String(post_in_array.type).trim() == selected_category || (post_in_array.category && String(post_in_array.category).trim() == selected_category)
								|| (post_in_array.category && String(post_in_array.category).trim() == (selected_category.substr(0,selected_category.indexOf("_")) + "_child"))){
								 new_array_n.push(post_in_array);
							 }
							 });
							 	if(new_array_n && new_array_n.length!=0){
								filtered_posts.push(new_array_n);
							}
						
						 }
					 });
				 }
			}
				
		}
		
		else {
			
			 if(search_value!="") {
					// Filter array by value and category  
					 if(posts && posts.length!=0){
					 posts.forEach((post_array)=>{
						 if(post_array && post_array.length!=0) {
							 var new_array = [];
							 post_array.forEach((post_array_posts) => {
								if(String(post_array_posts.title.rendered).toLowerCase().trim().indexOf(search_value)!==-1 || String(post_array_posts.content.rendered).toLowerCase().trim().indexOf(search_value)!==-1 ){
								 new_array.push(post_array_posts);
							 }
							 });
							if(new_array && new_array.length!=0){
								filtered_posts.push(new_array);
							} 
							
						 }
					 });
				 }
			
			}
			
			else {
						filtered_posts = posts;
			}
			
			
			}
			
			// Populate html with filtered posts
			populateHtml(filtered_posts);
	}
	
	
    }); 