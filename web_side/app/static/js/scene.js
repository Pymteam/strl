
var SCENE_NAME = "ROOT_SCENE"
var SCENE_STD_COLOR = '#ddd'
var SOP_SCALABLE = "SCALABLE"
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

	setColor(color){
		this.color = color
		this.shape.fill(color)
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
				sp_drag: false,
				scalable_points: [],
				rotate_points: []

			}
		}
		this.graph.svg.strl_object = this
		this.graph.svg.on('mousedown', this.so_on_mousedown)
		this.graph.svg.on('mousemove', this.so_on_mousemove)
		this.graph.svg.on('mouseup', this.so_on_mouseup)
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
		obj.shape.on('mousedown', this.so_on_mousedown)
		obj.shape.on('mousemove', this.so_on_mousemove)
		obj.shape.on('mouseup', this.so_on_mouseup)
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
			delete this.picked.objects.selected_frame
			this.picked.ref = 0
			for (var i = 0; i < 4; i++){
				this.picked.objects.scalable_points[i].shape.remove()
				delete this.picked.objects.scalable_points[i]
			}
			this.picked.objects.scalable_points = []
		}
	}

	pick(self){
		var scene = self.scene
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
		//создать точки для масштабирования
		var s_points = []
		s_points.push([x, y])
		s_points.push([x + w, y])
		s_points.push([x + w, y + h])
		s_points.push([x, y + h])
		var sp_sz = 10
		for (var i = 0; i < 4; i++){
			var sp = new CircleShape(self.scene, SOP_SCALABLE, sp_sz)
			sp.move(s_points[i][0], s_points[i][1])
			sp.dmove(- sp_sz / 2, - sp_sz / 2)
			sp.setColor("#33f")
			sp.index = i
			sp.shape.on('mousedown', this.so_on_mousedown)
			sp.shape.on('mousemove', this.so_on_mousemove)
			sp.shape.on('mouseup', this.so_on_mouseup)
			scene.picked.objects.scalable_points.push(sp)
		}

		//задать состояние выбранного объекта
		scene.picked.drag = true
	}

	so_on_mousedown(event){
		//получение объекта strl
		var self = this.strl_object
		//если ткнули не в объект, а в сцену, то отменить выбор
		if (self.name == SCENE_NAME){
			if (! self.picked.picked){
				self.unpick()
			}
			return
		}
		if (self.name == SOP_SCALABLE){
			self.scene.picked.picked = true
			console.log("Pick scalable ", self.index)
			self.scene.picked.objects.sp_drag = true
			return
		}
		//если ткнули в объект...
		var scene = self.scene
		//делаем деселект
		scene.unpick()
		//создаем рамку и указываем что объект выбран
		if (scene.picked.ref == 0){
			scene.pick(self)
			//сохранить координаты курсора
			scene.picked.predPosition.x = event.clientX
			scene.picked.predPosition.y = event.clientY
		}
		
	}

	so_on_mouseup(event){
		var self = this.strl_object
		if (self.name == SCENE_NAME){
			//указываем что объект не выбирается
			self.picked.picked = false
			//указываем что объект не перемещается
			self.picked.drag = false
			self.picked.objects.sp_drag = false
			console.log("unPick scalable")
		}
	}

	so_on_mousemove(event){
		var self = this.strl_object.scene.picked.ref
		//если объект перемещается
		if (self.scene.picked.objects.sp_drag){
			
		}
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
			//смещаем scalable_points
			for (var i = 0; i < 4; i++){
				var item = self.scene.picked.objects.scalable_points[i]
				item.dmove(offsetX, offsetY)
			}
			//сохраняем текущие координаты курсора
			pred.x = event.clientX
			pred.y = event.clientY
		}

	}

	so_on_click(){
		//console.log(this.strl_object.name)	
	}

}
