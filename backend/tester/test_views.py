from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework import status

from account.models import User, Teacher, Student, Course
from questions.models import Topic, Question, Subject

class AccountViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.teacher = Teacher.objects.create(user=self.user)
        self.student = Student.objects.create(user=self.user)
        self.course = Course.objects.create(name='Test Course')

    def test_login(self):
        url = reverse('login')
        data = {'username': 'testuser', 'password': 'testpass', 'role': 'teacher'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_teacher_register(self):
        url = reverse('teacher_register')
        data = {'username': 'newteacher', 'password': 'newpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newteacher').exists())

    def test_student_register(self):
        url = reverse('student_register')
        data = {'username': 'newstudent', 'password': 'newpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newstudent').exists())

    def test_teacher_list_get(self):
        url = reverse('teacher_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_teacher_list_post(self):
        url = reverse('teacher_list')
        data = {'username': 'newteacher', 'password': 'newpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newteacher').exists())

    def test_teacher_detail_get(self):
        url = reverse('teacher_detail', args=[self.teacher.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teacher_detail_put(self):
        url = reverse('teacher_detail', args=[self.teacher.pk])
        data = {'username': 'updatedteacher'}
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.teacher.refresh_from_db()
        self.assertEqual(self.teacher.user.username, 'updatedteacher')

    def test_teacher_detail_delete(self):
        url = reverse('teacher_detail', args=[self.teacher.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Teacher.objects.filter(pk=self.teacher.pk).exists())

    def test_student_list_get(self):
        url = reverse('student_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_student_list_post(self):
        url = reverse('student_list')
        data = {'username': 'newstudent', 'password': 'newpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newstudent').exists())

    def test_student_detail_get(self):
        url = reverse('student_detail', args=[self.student.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_detail_put(self):
        url = reverse('student_detail', args=[self.student.pk])
        data = {'username': 'updatedstudent'}
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.user.username, 'updatedstudent')

    def test_student_detail_delete(self):
        url = reverse('student_detail', args=[self.student.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Student.objects.filter(pk=self.student.pk).exists())

    def test_course_list_get(self):
        url = reverse('course_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_course_list_post(self):
        url = reverse('course_list')
        data = {'name': 'New Course'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Course.objects.filter(name='New Course').exists())

    def test_course_detail_get(self):
        url = reverse('course_detail', args=[self.course.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_course_detail_put(self):
        url = reverse('course_detail', args=[self.course.pk])
        data = {'name': 'Updated Course'}
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.name, 'Updated Course')

    def test_course_detail_delete(self):
        url = reverse('course_detail', args=[self.course.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(pk=self.course.pk).exists())


class QuestionsViewTests(TestCase):

    #Topic_Tester
    def setUp(self):
        self.client = Client()
        self.topic = Topic.objects.create(name='Test Topic')
        self.question = Question.objects.create(text='Test Question')
        self.subject = Subject.objects.create(name='Test Subject')
        self.teacher = Teacher.objects.create(user=self.user)
      
    def test_topic_list_get(self):
        url = reverse('topic_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_topic_list_post(self):
        url = reverse('topic_list')
        data = {'name': 'New Topic'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Topic.objects.filter(name='New Topic').exists())

    def test_topic_detail_get(self):
        url = reverse('topic_detail', args=[self.topic.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_topic_detail_put(self):
        url = reverse('topic_detail', args=[self.topic.pk])
        data = {'name': 'Updated Topic'}
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.topic.refresh_from_db()
        self.assertEqual(self.topic.name, 'Updated Topic')

    def test_topic_detail_delete(self):
        url = reverse('topic_detail', args=[self.topic.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Topic.objects.filter(pk=self.topic.pk).exists())

    #Question_Tester

    def test_question_list_get(self):
        url = reverse('question_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_question_list_post(self):
        url = reverse('question_list')
        data = {'text': 'New Question'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Question.objects.filter(text='New Question').exists())

    def test_question_detail_get(self):
        url = reverse('question_detail', args=[self.question.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text'], 'Test Question')

    def test_question_detail_put(self):
        url = reverse('question_detail', args=[self.question.pk])
        data = {'text': 'Updated Question'}
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.question.refresh_from_db()
        self.assertEqual(self.question.text, 'Updated Question')

    def test_question_detail_delete(self):
        url = reverse('question_detail', args=[self.question.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Question.objects.filter(pk=self.question.pk).exists())

    # Subject_Tester

    def test_subject_list_get(self):
        url = reverse('subject_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_subject_list_post(self):
        url = reverse('subject_list')
        data = {'name': 'New Subject'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subject.objects.filter(name='New Subject').exists())

    def test_subject_detail_get(self):
        url = reverse('subject_detail', args=[self.subject.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Subject')

    def test_subject_detail_put(self):
        url = reverse('subject_detail', args=[self.subject.pk])
        data = {'name': 'Updated Subject'}
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.subject.refresh_from_db()
        self.assertEqual(self.subject.name, 'Updated Subject')

    def test_subject_detail_delete(self):
        url = reverse('subject_detail', args=[self.subject.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Subject.objects.filter(pk=self.subject.pk).exists())

    def test_subject_questions_get(self):
        url = reverse('subject_questions', args=[self.subject.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_subject_teachers(self):
        url = reverse('subject_teachers', args=[self.subject.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_teacher_subjects(self):
        url = reverse('teacher_subjects', args=[self.teacher.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_subject_topics(self):
        url = reverse('subject_topics', args=[self.subject.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_subject_questions(self):
        url = reverse('subject_questions', args=[self.subject.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)