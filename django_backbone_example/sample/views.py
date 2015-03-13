from django.shortcuts import render
from rest_framework import viewsets
from .import models
from rest_framework.serializers import ModelSerializer
# Create your views here.


class TodoItemSerializer(ModelSerializer):
    class Meta:
        model = models.ToDoItem


class TodoItemViewSet(viewsets.ModelViewSet):
    serializer_class = TodoItemSerializer
    queryset = models.ToDoItem.objects.all()
    

class PersonSerializer(ModelSerializer):
    class Meta:
        model = models.Person


class PersonViewSet(viewsets.ModelViewSet):
    serializer_class = PersonSerializer
    queryset = models.Person.objects.all()
