# Generated by Django 5.2 on 2025-04-16 20:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delish', '0010_alter_bookmark_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='collection',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bookmarks_in_collection', to='delish.collection'),
        ),
    ]
