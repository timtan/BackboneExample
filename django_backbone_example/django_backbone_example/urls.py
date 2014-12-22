from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from django_kss.views import AutoStyleGuideView


class StyleGuideView(AutoStyleGuideView):
    template_name = 'main-style-guide.html'

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_backbone_example.views.home', name='home'),
    # url(r'^django_backbone_example/', include('django_backbone_example.foo.urls')),

    url(r'^$', TemplateView.as_view(template_name='game.html')),
    url(r'^style_guide/(?P<section>\d*)$', StyleGuideView.as_view(), name='styleguide'),

)
