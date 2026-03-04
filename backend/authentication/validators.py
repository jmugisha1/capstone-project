from django.core.exceptions import ValidationError
import re

class CustomPasswordValidator:
    """
    Validates that password contains:
    - At least 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    def validate(self, password, user=None):
        if len(password) < 12:
            raise ValidationError("Password must be at least 12 characters long.")
        
        if not re.search(r'[A-Z]', password):
            raise ValidationError("Password must contain at least one uppercase letter.")
        
        if not re.search(r'[a-z]', password):
            raise ValidationError("Password must contain at least one lowercase letter.")
        
        if not re.search(r'\d', password):
            raise ValidationError("Password must contain at least one number.")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError("Password must contain at least one special character (!@#$%^&*).")
    
    def get_help_text(self):
        return "Password must be at least 12 characters and contain uppercase, lowercase, number, and special character."