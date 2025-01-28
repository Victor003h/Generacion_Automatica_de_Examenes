from django.test import SimpleTestCase
from django.urls import resolve, reverse
from account.views import *
from exams.views import *
from questions.views import *
from questions.viewss.topics import *
from questions.viewss.subjects import *
from questions.viewss.questions import *


class TestUrls(SimpleTestCase):

    # Tests for account URLs

    def test_teacher_register_url_resolved(self):
        url = reverse('teacher_register')
        self.assertEqual(resolve(url).func, teacher_register)

    def test_student_register_url_resolved(self):
        url = reverse('student_register')
        self.assertEqual(resolve(url).func, student_register)

    def test_login_url_resolved(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func, login)

    def test_getUser_url_resolved(self):
        url = reverse('getUser')
        self.assertEqual(resolve(url).func, getUser)

    def test_teacher_list_url_resolved(self):
        url = reverse('teacher_list')
        self.assertEqual(resolve(url).func, teacher_list)

    def test_teacher_detail_url_resolved(self):
        url = reverse('teacher_detail', args=[1])
        self.assertEqual(resolve(url).func, teacher_detail)

    def test_student_list_url_resolved(self):
        url = reverse('student_list')
        self.assertEqual(resolve(url).func, student_list)

    def test_student_detail_url_resolved(self):
        url = reverse('student_detail', args=[1])
        self.assertEqual(resolve(url).func, student_detail)

    def test_course_list_url_resolved(self):
        url = reverse('course_list')
        self.assertEqual(resolve(url).func, course_list)

    def test_course_detail_url_resolved(self):
        url = reverse('course_detail', args=[1])
        self.assertEqual(resolve(url).func, course_detail)



    # Tests for questions URLs

        # Tests for subjects URLs

        def test_subject_list_url_resolved(self):
            url = reverse('subject-list')
            self.assertEqual(resolve(url).func, subject_list)

        def test_subject_detail_url_resolved(self):
            url = reverse('subject-detail', args=[1])
            self.assertEqual(resolve(url).func, subject_detail)

        def test_subject_questions_url_resolved(self):
            url = reverse('subject-questions', args=[1])
            self.assertEqual(resolve(url).func, subject_questions)

        def test_subject_topics_url_resolved(self):
            url = reverse('subject-topics', args=[1])
            self.assertEqual(resolve(url).func, subject_topics)

        def test_subject_teachers_url_resolved(self):
            url = reverse('subject-teachers', args=[1])
            self.assertEqual(resolve(url).func, subject_teachers)

        # Tests for topics URLs

        def test_topic_list_url_resolved(self):
            url = reverse('topic-list')
            self.assertEqual(resolve(url).func, topic_list)

        def test_topic_detail_url_resolved(self):
            url = reverse('topic-detail', args=[1])
            self.assertEqual(resolve(url).func, topic_detail)

        def test_topic_subject_url_resolved(self):
            url = reverse('topic-subject', args=[1])
            self.assertEqual(resolve(url).func, topic_subject)

        def test_topic_questions_url_resolved(self):
            url = reverse('topic-questions', args=[1])
            self.assertEqual(resolve(url).func, topic_question)

        # Tests for teacher URLs

        def test_teacher_subjects_url_resolved(self):
            url = reverse('teacher-subjects', args=[1])
            self.assertEqual(resolve(url).func, teacher_subjects)
        def test_question_list_url_resolved(self):
            url = reverse('question_list')
            self.assertEqual(resolve(url).func, question_list)

        def test_question_detail_url_resolved(self):
            url = reverse('question_detail', args=[1])
            self.assertEqual(resolve(url).func, question_detail)

        def test_question_topic_url_resolved(self):
            url = reverse('question-topic', args=[1])
            self.assertEqual(resolve(url).func, question_topic)

    # Tests for exams URLs

    def test_exam_list_url_resolved(self):
        url = reverse('exam_list')
        self.assertEqual(resolve(url).func, exam_list)
    def test_exam_detail_url_resolved(self):
        url = reverse('exam_detail', args=[1])
        self.assertEqual(resolve(url).func, exam_detail)