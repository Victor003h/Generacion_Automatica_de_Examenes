# Generated by Django 5.1.3 on 2024-12-09 07:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_alter_student_options_alter_teacher_options_and_more'),
        ('exam_question_manage', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='head_of_subject',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='account.teacher'),
        ),
    ]
