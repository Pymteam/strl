
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


