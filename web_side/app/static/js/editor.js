
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