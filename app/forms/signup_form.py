from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, Length, ValidationError
from app.models import User


def user_exists(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username',
        validators=[
            DataRequired(message="Username is required."),
            Length(min=3, max=40, message="Username must be between 3 and 40 characters."),
            username_exists
        ]
    )
    email = StringField(
        'email',
        validators=[
            DataRequired(message="Email is required."),
            Email(message="Must be a valid email address."),
            user_exists
        ]
    )
    password = PasswordField(
        'password',
        validators=[
            DataRequired(message="Password is required."),
            Length(min=6, message="Password must be at least 6 characters.")
        ]
    )
