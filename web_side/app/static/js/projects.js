function get_projects_container(){
	var projects = $("#projects")
	return projects
}

function add_world(project_id, world_name, world_id){
	var project
}


function add_project(project_name, project_id){
	var projects = get_projects_container()
	//add "row"
	var row = $("<div />")
	var id = "row_project_id_" + project_id
	row.attr('id', id)
	row.addClass("row")
	console.log(row)
	row.appendTo(projects)
	//add "col"
	var col = $("<div />")
	col.addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12")
	col.appendTo(row)
	//add "panel"
	var panel = $("<div />")
	panel.addClass("panel panel-default")
	panel.appendTo(col)
	//add "panel-heading"
	var panel_heading = $("<div />")
	panel_heading.addClass("panel-heading")
	panel_heading.append(project_name)
	panel_heading.appendTo(panel)
	//add "panel-body"
	var panel_body = $("<div />")
	panel_body.addClass("panel-body")
	panel_body.appendTo(panel)
	//add world's row (wr)
	var wr = $("<div />")
	wr.addClass("row")
	wr.appendTo(panel_body)

}

add_project("Project2", 2)
add_project("Project3", 3)
add_project("Project4", 4)
