from django import forms
from .models import Artist

# class ArtistForm(forms.ModelForm):
#     class Meta:
#         model = Artist
#         fields = ['artist_name']


class PostSearchForm(forms.Form):
    search_word = forms.CharField(label="Search Word")
    
    
class AddToPlaylistForm(forms.Form):
    track_id = forms.CharField(widget=forms.HiddenInput())
    playlist_id = forms.CharField(widget=forms.HiddenInput())
    rating_score = forms.IntegerField(widget=forms.HiddenInput())
    cnt = forms.IntegerField(widget=forms.HiddenInput())
    

GENRE_CHOICES = [
    ('', 'Select Genre'),
    ('acoustic', 'Acoustic'),
    ('dance', 'Dance'),
    ('edm', 'EDM'),
    ('hip-hop', 'Hip Hop'),
    ('k-pop', 'K-Pop'),
    ('pop', 'Pop'),
    ('r-n-b', 'R&B'),
    ('rock', 'Rock'),
    ('romance', 'Romance'),
    ('soul', 'Soul'),
]

class MusicSearchForm(forms.Form):
    genre = forms.ChoiceField(choices=GENRE_CHOICES, required=False, widget=forms.Select(attrs={'class': 'custom-select'}))
