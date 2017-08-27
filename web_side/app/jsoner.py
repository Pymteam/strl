import json
from .models import Project, World


def project_json_from_user(u):
	"""
	создаёт json структуру для страницы projects
	:param u: юзер
	:return: json структура
	"""

	# запрашиваем все проекты юзера
	user_projects = Project.query.filter_by(owner=u).all()
	# список всех проектов
	projects_list = []

	for p in user_projects:
		tmp_project = dict()
		tmp_project['id'] = p.id
		tmp_project['name'] = p.name
		tmp_project['worlds'] = []

		# заберём все миры, соответствующие данному проект
		worlds = World.query.filter_by(owner=p).all()
		for w in worlds:
			tmp_world = dict()
			tmp_world['id'] = w.id
			tmp_world['name'] = w.name

			# добавляем в словарь tmp_project
			tmp_project['worlds'].append(tmp_world)

		projects_list.append(tmp_project)

	project_dict = {'projects': projects_list}

	return json.dumps(project_dict)
