from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from django_kss.views import AutoStyleGuideView
from rest_framework import routers
from sample.views import PersonViewSet,TodoItemViewSet


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'people', PersonViewSet)
router.register(r'todo', TodoItemViewSet)


class StyleGuideView(AutoStyleGuideView):
    template_name = 'main-style-guide.html'


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_backbone_example.views.home', name='home'),
    # url(r'^django_backbone_example/', include('django_backbone_example.foo.urls')),

    url(r'^$', TemplateView.as_view(template_name='game.html')),
    url(r'^todo/$', TemplateView.as_view(template_name='todo-mockup.html')),
    url(r'^todo_app/$', TemplateView.as_view(template_name='todo.html')),
    url(r'^sample/$', TemplateView.as_view(template_name='sample.html')),
    url(r'^style_guide/(?P<section>\d*)$', StyleGuideView.as_view(), name='styleguide'),
    url(r'^api/', include(router.urls, namespace='api')),
)

