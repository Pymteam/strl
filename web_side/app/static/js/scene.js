var SCENE_STD_COLOR = '#ddd'
var SM_NORMAL = 0
var SM_SELECT = 1
var SM_SELECT_AND_TRANSFORM = 2
class SceneObject{
	constructor(name){
		this.name = name
		console.log(this.name)
	}

	print(){
		console.log("My name: ", this.name)
	}
}

class BoxShape extends SceneObject{
	constructor(graph, name, w, h){
		super(name)
		this.shape = graph.createRect(10, 10, w, h, SCENE_STD_COLOR)
	}
}

class FrameShape extends SceneObject{
	constructor(graph, name, w, h){
		super(name)
		this.shape = graph.createFrame(10, 10, w, h, SCENE_STD_COLOR, 1)
	}
}

class CircleShape extends SceneObject{
	constructor(graph, name, r){
		super(name)
		this.shape = graph.createCircle(10, 10, r, SCENE_STD_COLOR)
	}
}

class Scene{
	constructor(){
		this.objects = []
		this.mode = SM_NORMAL
	}

	print(){
		console.log("---Scene items---")
		for (var i = 0; i < this.objects.length; i++){
			var item = this.objects[i]
			item.print()
		}
	}

	add(obj){
		this.objects.push(obj)
	}

}

graph = new SVGGraph("worldeditor")

s = new Scene()
so = new SceneObject("pituh1")
s.add(so)
so = new SceneObject("pituh2")
s.add(so)
so = new SceneObject("pituh3")
s.add(so)
so = new BoxShape(graph, "pituh4", 100, 30)
s.add(so)

s.print()