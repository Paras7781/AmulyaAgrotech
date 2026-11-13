import re
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

def clean_and_validate_phone(raw_phone: Optional[str]) -> str:
    if not raw_phone:
        raise ValueError("Phone number is required")
    cleaned = re.sub(r'[\s\-\(\)\+\.]', '', raw_phone)
    if cleaned.startswith('91') and len(cleaned) == 12:
        cleaned = cleaned[2:]
    elif cleaned.startswith('0') and len(cleaned) == 11:
        cleaned = cleaned[1:]
    if not re.fullmatch(r'[6-9][0-9]{9}', cleaned):
        raise ValueError("Please provide a valid 10-digit mobile number")
    return cleaned


def validate_email(value: Optional[str]) -> Optional[str]:
    if value is not None and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
        raise ValueError("Please provide a valid email address")
    return value


class DroneCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    slug: str = Field(..., min_length=2, max_length=120)
    description: str
    price: float = Field(..., ge=0.0)
    active: bool = True

class DroneResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str
    price: float
    active: bool

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=30)
    mobile: Optional[str] = Field(default=None, max_length=30)
    email: Optional[str] = Field(default=None, max_length=180)
    location: Optional[str] = Field(default=None, max_length=180)
    service: Optional[str] = Field(default=None, max_length=180)
    subject: Optional[str] = Field(default=None, max_length=180)
    message: Optional[str] = Field(default=None, max_length=2000)
    language: Optional[str] = Field(default="en", max_length=10)

    @field_validator('*', mode='before')
    @classmethod
    def strip_and_validate(cls, v):
        if isinstance(v, str):
            v = v.strip()
            return v if v else None
        return v

    @field_validator("name", "service", "subject", mode="before")
    @classmethod
    def reject_header_line_breaks(cls, value):
        if isinstance(value, str) and ("\r" in value or "\n" in value):
            raise ValueError("Line breaks are not allowed in this field")
        return value

    @field_validator("email")
    @classmethod
    def validate_customer_email(cls, value):
        return validate_email(value)

    def get_mobile(self) -> str:
        num = self.phone or self.mobile
        return clean_and_validate_phone(num)

    def get_subject(self) -> str:
        return self.service or self.subject or "General Enquiry"

class ContactResponse(BaseModel):
    success: bool = True
    message: str
    id: int = 1
    reference_number: Optional[str] = None
    status: str = "SENT"

class QuotationCreate(BaseModel):
    need: Optional[str] = Field(default=None, max_length=120)
    drone: Optional[str] = Field(default=None, max_length=120)
    drone_id: Optional[int] = Field(default=None, gt=0)
    landArea: Optional[str] = Field(default=None, max_length=120)
    land_area: Optional[str] = Field(default=None, max_length=120)
    crop: Optional[str] = Field(default=None, max_length=120)
    timeline: Optional[str] = Field(default=None, max_length=120)
    name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    customer_name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=30)
    mobile: Optional[str] = Field(default=None, max_length=30)
    email: Optional[str] = Field(default=None, max_length=180)
    location: Optional[str] = Field(default=None, max_length=180)
    message: Optional[str] = Field(default=None, max_length=2000)
    notes: Optional[str] = Field(default=None, max_length=2000)
    category: Optional[str] = Field(default="General", max_length=80)
    language: Optional[str] = Field(default="en", max_length=10)

    @field_validator('*', mode='before')
    @classmethod
    def strip_strings(cls, v):
        if isinstance(v, str):
            v = v.strip()
            return v if v else None
        return v

    @field_validator("name", "customer_name", "need", "drone", "category", mode="before")
    @classmethod
    def reject_header_line_breaks(cls, value):
        if isinstance(value, str) and ("\r" in value or "\n" in value):
            raise ValueError("Line breaks are not allowed in this field")
        return value

    @field_validator("email")
    @classmethod
    def validate_customer_email(cls, value):
        return validate_email(value)

    def get_name(self) -> str:
        name = self.name or self.customer_name
        if not name:
            raise ValueError("Customer name is required")
        return name

    def get_mobile(self) -> str:
        num = self.phone or self.mobile
        return clean_and_validate_phone(num)

    def get_land_area(self) -> Optional[str]:
        return self.land_area or self.landArea

    def get_message(self) -> Optional[str]:
        return self.message or self.notes

class QuotationResponse(BaseModel):
    success: bool = True
    message: str
    reference_number: str
    id: int
    status: str = "NEW"
