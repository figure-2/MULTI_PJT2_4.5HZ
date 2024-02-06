from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from music_rec_app.models import Artist, Track
import logging

logger = logging.getLogger("onclick")

def signup(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('accounts:login')
    else:
        form = CustomUserCreationForm()
        # track = Track.objects.all()   

    context = {
        'form' : form,
        # 'track':track
    }
    return render(request, 'signup.html', context)

def login(request):
    if request.method == "POST":
        form = CustomAuthenticationForm(request, request.POST) 
        # logger = logging.getLogger("onclick")
    
        # user_id = request.user.nickname
        # username = request.user.username
        # gender = request.user.gender
        # birth_date = request.user.birth_date

        # logger.debug( "login", extra={
        #     'user_id': user_id, 
        #     'gender' : gender, 
        #     'username': username, 
        #     'birth_date' : birth_date,
        #     })
        
        if form.is_valid():
            auth_login(request, form.get_user()) 
            return redirect('music_rec_app:main')
        

    else:
        form = CustomAuthenticationForm()
        
    # logger.debug("show message")
    # logger.info("show message info")
    
    context = {
        'form' : form
    }
    
    return render(request, 'form.html',context)

def logout(request):
    auth_logout(request)
    return redirect('accounts:login')