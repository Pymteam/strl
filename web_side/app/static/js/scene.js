
var SCENE_NAME = "ROOT_SCENE"
var SCENE_STD_COLOR = '#ddd'
var SM_NORMAL = 0
var SM_SELECT = 1
var SM_SELECT_AND_TRANSFORM = 2

class SceneObject{
	constructor(parent, name){
		this.parent = parent
		this.setScene(this)
		this.name = name
		this.position = {
			x: 0,
			y: 0
		}
		this.size = {
			w: 0,
			h: 0
		}
		this.rotation = 0.0
		this.color = SCENE_STD_COLOR
		//console.log(this.name)
		this.shape = 0
	}

	print(){
		console.log("My name: ", this.name)
	}

	assignWithSVGObject(){
		this.shape.strl_object = this
	}

	setScene(self){
		var obj = self.parent
		if (obj.name == SCENE_NAME){
			self.scene = obj
		}
		else{
			setScene(self.parent)
		}

	}

	move(x, y){
		this.position.x = x
		this.position.y = y
		this.shape.move(x, y)
	}

	dmove(x, y){
		this.position.x += x
		this.position.y += y
		this.shape.dmove(x, y)
	}


}

class BoxShape extends SceneObject{
	constructor(scene, name, w, h){
		super(scene, name)
		this.position.x = 10
		this.position.y = 10
		this.size.w = w
		this.size.h = h
		this.shape = this.scene.graph.createRect(10, 10, w, h, SCENE_STD_COLOR)
		this.assignWithSVGObject()
	}
}

class FrameShape extends SceneObject{
	constructor(scene, name, w, h){
		super(scene, name)
		this.position.x = 10
		this.position.y = 10
		this.size.w = w
		this.size.h = h
		this.width = 1
		this.shape = this.scene.graph.createFrame(10, 10, w, h, SCENE_STD_COLOR, 1)
		this.assignWithSVGObject()
	}

	setColor(color){
		this.color = color
		this.shape.stroke({color: color})
	}
}

class CircleShape extends SceneObject{
	constructor(scene, name, r){
		super(scene, name)
		this.position.x = 10
		this.position.y = 10
		this.size.w = r
		this.size.h = r
		this.shape = this.scene.graph.createCircle(10, 10, r, SCENE_STD_COLOR)
		this.assignWithSVGObject()
	}
}

class Scene{
	constructor(graph){
		this.scene = this
		this.graph = graph
		this.objects = []
		this.name = SCENE_NAME
		this.mode = SM_SELECT
		this.picked = {
			picked: false,
			ref: 0,
			drag: false,
			predPosition: {
				x: 0,
				y: 0
			},
			objects: {
				selected_frame: 0,
				scalable_points: [],
				rotate_points: []

			}
		}
		this.graph.svg.strl_object = this
		this.graph.svg.on('mousedown', this.on_mousedown)
		this.graph.svg.on('mousemove', this.on_mousemove)
		this.graph.svg.on('mouseup', this.on_mouseup)
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
		obj.shape.on('mousedown', this.on_mousedown)
	}

	find(name){
		var obj = 0
		for (var i = 0; i < this.objects.length; i++){
			var item = this.objects[i]
			if (item.name == name){
				obj = item
				break
			}

		}
		return obj	
			
	}

	unpick(){
		if (this.picked.ref != 0){
			this.picked.objects.selected_frame.shape.remove()
			this.picked.ref = 0
		}
	}

	on_mousedown(event){
		//получение объекта strl
		var self = this.strl_object
		//если ткнули не в объект, а в сцену, то отменить выбор
		if (self.name == SCENE_NAME){
			if (! self.picked.picked){
				self.unpick()
			}
		}
		//если ткнули в объект...
		if (self.name != SCENE_NAME){
			var scene = self.scene
			//делаем деселект
			scene.unpick()
			//создаем рамку и указываем что объект выбран
			if (scene.picked.ref == 0){
				//указать что выбран объект
				scene.picked.picked = true
				//указать ссылку на выбранный объект
				scene.picked.ref = self
				//задать размеры рамки
				var w = self.size.w
				var h = self.size.h
				var frame = new FrameShape(self.scene, "frame", w, h)
				//задать координаты рамки
				var x = self.position.x
				var y = self.position.y
				frame.shape.move(x, y)
				//добавить рамку к сцене
				scene.picked.objects.selected_frame = frame		
				//задать цвет рамки
				frame.setColor('#0f0')
				//задать состояние выбранного объекта
				scene.picked.drag = true
				//сохранить координаты курсора
				scene.picked.predPosition.x = event.clientX
				scene.picked.predPosition.y = event.clientY
			}
		}
	}

	on_mouseup(event){
		var self = this.strl_object
		if (self.name == SCENE_NAME){
			//указываем что объект не выбирается
			self.picked.picked = false
			//указываем что объект не перемещается
			self.picked.drag = false
		}
	}

	on_mousemove(event){
		var self = this.strl_object.scene.picked.ref
		//если объект перемещается
		if (this.strl_object.scene.picked.drag)
		{
			//считаем смещение в пикселях
			var pred = self.scene.picked.predPosition
			var offsetX = event.clientX - pred.x
			var offsetY = event.clientY - pred.y
			//смещаем сам объект
			self.dmove(offsetX, offsetY)
			//смещаем рамку
			var sFrame = self.scene.picked.objects.selected_frame;
			sFrame.dmove(offsetX, offsetY)
			//сохраняем текущие координаты курсора
			pred.x = event.clientX
			pred.y = event.clientY
		}

	}

	on_click(){
		//console.log(this.strl_object.name)	
	}

}

s = new Scene(new SVGGraph("worldeditor"))

so = new BoxShape(s, "pituh4", 100, 30)
s.add(so)
so = new BoxShape(s, "pituh1", 100, 30)
s.add(so)
so.move(300, 300)
so = new CircleShape(s, "pituh2", 70)
s.add(so)
so.move(200, 150)

s.print()