
<<<<<<< HEAD
s = new Scene(new SVGGraph("worldeditor"))

// so = new BoxShape(s, "pituh4", 100, 30)
// s.add(so)

// so = new BoxShape(s, "pituh1", 100, 30)
// s.add(so)
// so.move(300, 300)

// so = new CircleShape(s, "pituh2", 70)
// s.add(so)
// so.move(200, 150)

for (var i = 0; i < 3; i++){
	for (var j = 0; j < 3; j++){
		so = new CircleShape(s, "qqq", 100)
		so.move(10 + i * 120, 10 + j * 120)
		s.add(so)
	}
}

s.print()

var objects_panel = document.getElementById("objects_panel_body")
console.log(objects_panel)
=======
graph = new SVGGraph("worldeditor")

current = 0

function initObject(obj){
	obj.selectize(false)
	obj.resize()
	obj.draggable()
	obj.on('mousedown', pick)
}

function pick(){
	if (current != 0){
		current.selectize(false)
	}
	current = this
	current.selectize(true)
}

function unpick(){
	current = 0
}

var c1 = graph.createCircle(100, 100, 100, '#aaf')
initObject(c1)
var r1 = graph.createRect(210, 100, 100, 40, '#afa')
initObject(r1)


>>>>>>> v_0_0_3
