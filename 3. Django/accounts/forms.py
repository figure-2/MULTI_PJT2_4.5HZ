from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.forms.widgets import DateInput
from .models import User


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(
        label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('nickname','username','birth_date', 'gender', 'liked_artist', 'liked_track')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('nickname', 'password', 'username',
                  'is_active', 'is_admin')

    def clean_password(self):
        return self.initial["password"]
    
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User
from django.contrib.auth import get_user_model


class DateInput(forms.DateInput):
    input_type = 'date'

class CustomUserCreationForm(UserCreationForm):
    
    nickname = forms.CharField(label='nickname', max_length=30)
    username = forms.CharField(label='이름', max_length=30)
    # birth_date = forms.DateField(label='생년월일')
    birth_date = forms.DateField(widget=DateInput(), label='생년월일')
    gender = forms.ChoiceField(choices=User.gender_choices, label='성별', required=False)


    
    class Meta:
        # model = User
        model = get_user_model()
        fields = ('nickname','username','birth_date','gender',) 

    
class CustomAuthenticationForm(AuthenticationForm):
    pass

