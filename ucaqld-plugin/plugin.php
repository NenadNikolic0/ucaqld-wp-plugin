<?php
/*
Plugin Name: ucaqld-plugin
Description: This plugin is for getting custom post types defined by CPT UI plugin from WP api, showing it on the page and filtering it by text and category.
Version: 1.0
*/


function loadScript()
{
	
    // Register  style like this for a plugin:
    wp_register_style( 'custom-css', plugins_url( '/css/custom.css', __FILE__ ), false, NULL, 'all'  );
 
    // For either a plugin or a theme, you can then enqueue the style:
    wp_enqueue_style( 'custom-css' );
	
	// Register responsive style like this for a plugin:
    wp_register_style( 'responsive-css', plugins_url( '/css/responsive.css', __FILE__ ), false, NULL, 'all'  );
 
    // For either a plugin or a theme, you can then enqueue the style:
    wp_enqueue_style( 'responsive-css' );
	
		
    // Register the script like this for a plugin:
    wp_register_script( 'custom-script', plugins_url( '/js/custom.js', __FILE__ ), array( 'jquery'), NULL, true );

    // For either a plugin or a theme, you can then enqueue the script:
    wp_enqueue_script( 'custom-script' );
		
}


add_action( 'wp_enqueue_scripts', 'loadScript' );


 
add_shortcode("ucaqld","demo_posts");




function demo_posts() {
	
	?>
	
    <!--Style guide row -->
	<div class="style-guide-how">
		<h1>How to use this style guide</h1>
		<span class="row-style">To use this style guide, use the search engine at the top of this screen to search your term or phrase, for example, “By-laws”, “FIP Board” or “presbytery”.</span>  
        <span class="row-style">Consistent, clear and concise terminology strengthens and supports our brand.</span>
        <span class="row-style">Included in this style guide are words and phrases specific to the Uniting Church in Australia and others referring to Queensland Synod strategy, initiatives and businesses.</span>  
        <span class="row-style">We should avoid jargon and “churchy” languages in all instances while communicating the church’s message to the wider community. This style guide also covers exclusive language, style including capitalisation, punctuation and the use of initialisms and acronyms.</span>  
        <span class="row-style">The style guide also has a list of commonly misspelled words and phrases.</span>  
        <span class="row-style">Should you have any questions, please contact Communications and Marketing via email communications@ucaqld.com.au. </span>  				
	</div>
    
    <!--Search wrapper -->
    <div class="search-wrapper">
		 <!--Search field row -->
        <div class="search-field-row">
			<input type="text" class="search-field" />
			<button class="search-button">
				Search
			</button>		
	    </div>

		<!--Dropdown row -->
		<div class="dropdown-field-row">	
			<!--Dropdown-->
			<select id="dropdownSelect">
				<option value="" selected>All categories</option>
			</select>		
		</div>
    </div>
   

     <!--Left side content -->
    <div class="left-side-content">
		<!--Loader page-->
        <div class="loader-over-page">
        	<div class="loader"></div>
        </div>
	</div>

    <!--Right side content -->
    <div class="right-side-content">
		<span>
			This style guide is for use by <br/> Queensland Synod office staff <br/>  and Uniting Church ministry <br/> agents in their communication <br/> across all channels, mediums and <br/> platforms, including the <br/> production of           correspondence, <br/> policies, reports and resources. <br/><br/>
			The Queensland Synod style <br/> follows standard Australian <br/> English and reflects our <br/> commitment to professionalism.<br/> The Macquarie Dictionary and <br/> the Australian Government Style <br/> Manual (2002,currently under <br/> revision)  are our reference points.  <br/><br/><br/>

		This guide is kept up to date by a <br/> working party that meets <br/> regularly. 
			<br/> <br/>

			<a href="#">Join or view minutes from previous meetings ›</a> <br/><br/><br/> </span> 



<span> We welcome your feedback <br/> about errors, omissions, entries <br/> that you think are unclear, or <br/> items you think should be <br/> altered.
    <br/><br/>
	<a href="#">Submit your feedback ›</a> <br/><br/> </span>

<span> <a href="3">View references and appendix › </a>
	   <br/>
	   <br/>
       Grammar mistakes can be costly. 
	   <br/>
	   <a href="#">View details ></a>
		</span>
    </div>
	
	
	
	
	
	
    <?php
      
}



?>