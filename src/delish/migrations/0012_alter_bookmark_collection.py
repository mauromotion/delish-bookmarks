# Generated by Django 5.2 on 2025-04-17 17:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delish', '0011_alter_bookmark_collection'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='collection',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='bookmarks_in_collection', to='delish.collection'),
        ),
    ]
