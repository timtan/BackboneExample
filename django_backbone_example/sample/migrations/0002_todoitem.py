# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sample', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ToDoItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('completed', models.BooleanField(default=False)),
                ('content', models.CharField(default=b'', max_length=200)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
