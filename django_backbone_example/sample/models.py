from django.db import models


class Person(models.Model):
    name = models.CharField(max_length=100)


class ToDoItem(models.Model):
    completed = models.BooleanField(default=False)
    content = models.CharField(default="", max_length=200)