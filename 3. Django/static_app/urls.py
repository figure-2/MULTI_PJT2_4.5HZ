from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

app_name = 'static_app'

urlpatterns = [
    path('', views.show_static, name ='static_home'),
    path('personal/', views.show_personal_static, name = 'personal_static'),
    # path('personal/', views.spotify_login, name = 'spotify_login'),

]

urlpatterns += staticfiles_urlpatterns()