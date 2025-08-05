from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import motor.motor_asyncio
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI(
    title="UberClone API",
    description="A comprehensive ride-sharing API built with FastAPI",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017/uber_clone")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
database = client.uber_clone

# Security
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Pydantic models
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    user_type: str = "user"

class UserCreate(UserBase):
    password: str
    vehicle_info: Optional[dict] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    is_verified: bool = False
    is_active: bool = True
    rating: dict = {"average": 0, "count": 0}
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class RideCreate(BaseModel):
    pickup_location: dict
    destination: dict
    ride_type: str = "economy"

class Ride(BaseModel):
    id: str
    rider_id: str
    driver_id: Optional[str] = None
    pickup_location: dict
    destination: dict
    ride_type: str
    status: str = "requested"
    distance: float
    estimated_duration: int
    fare: dict
    created_at: datetime

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await database.users.find_one({"_id": user_id})
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.get("/")
async def root():
    return {"message": "UberClone FastAPI Backend", "version": "1.0.0"}

@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await database.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user document
    user_doc = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "password": hashed_password,
        "user_type": user.user_type,
        "is_verified": False,
        "is_active": True,
        "rating": {"average": 0, "count": 0},
        "created_at": datetime.utcnow()
    }
    
    if user.vehicle_info and user.user_type == "driver":
        user_doc["vehicle_info"] = user.vehicle_info
    
    # Insert user
    result = await database.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    # Return response
    user_response = User(
        id=str(result.inserted_id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        user_type=user.user_type,
        is_verified=False,
        is_active=True,
        rating={"average": 0, "count": 0},
        created_at=user_doc["created_at"]
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@app.post("/api/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    # Find user
    user = await database.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account has been deactivated"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    # Return response
    user_response = User(
        id=str(user["_id"]),
        first_name=user["first_name"],
        last_name=user["last_name"],
        email=user["email"],
        phone=user["phone"],
        user_type=user["user_type"],
        is_verified=user["is_verified"],
        is_active=user["is_active"],
        rating=user.get("rating", {"average": 0, "count": 0}),
        created_at=user["created_at"]
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@app.get("/api/auth/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return User(
        id=str(current_user["_id"]),
        first_name=current_user["first_name"],
        last_name=current_user["last_name"],
        email=current_user["email"],
        phone=current_user["phone"],
        user_type=current_user["user_type"],
        is_verified=current_user["is_verified"],
        is_active=current_user["is_active"],
        rating=current_user.get("rating", {"average": 0, "count": 0}),
        created_at=current_user["created_at"]
    )

@app.post("/api/rides/request", response_model=Ride)
async def request_ride(ride: RideCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "user":
        raise HTTPException(
            status_code=403,
            detail="Only users can request rides"
        )
    
    # Calculate fare (simplified)
    distance = 5.0  # Mock distance calculation
    estimated_duration = 15  # Mock duration
    base_fare = 2.50
    distance_fare = distance * 1.20
    total_fare = base_fare + distance_fare
    
    # Create ride document
    ride_doc = {
        "rider_id": str(current_user["_id"]),
        "pickup_location": ride.pickup_location,
        "destination": ride.destination,
        "ride_type": ride.ride_type,
        "status": "requested",
        "distance": distance,
        "estimated_duration": estimated_duration,
        "fare": {
            "base_fare": base_fare,
            "distance_fare": distance_fare,
            "total": total_fare
        },
        "created_at": datetime.utcnow()
    }
    
    # Insert ride
    result = await database.rides.insert_one(ride_doc)
    ride_doc["_id"] = result.inserted_id
    
    return Ride(
        id=str(result.inserted_id),
        rider_id=str(current_user["_id"]),
        pickup_location=ride.pickup_location,
        destination=ride.destination,
        ride_type=ride.ride_type,
        status="requested",
        distance=distance,
        estimated_duration=estimated_duration,
        fare=ride_doc["fare"],
        created_at=ride_doc["created_at"]
    )

@app.get("/api/rides/history")
async def get_ride_history(current_user: dict = Depends(get_current_user)):
    # Get user's rides based on their type
    if current_user["user_type"] == "driver":
        cursor = database.rides.find({"driver_id": str(current_user["_id"])})
    else:
        cursor = database.rides.find({"rider_id": str(current_user["_id"])})
    
    rides = []
    async for ride in cursor:
        ride["id"] = str(ride["_id"])
        del ride["_id"]
        rides.append(ride)
    
    return {"rides": rides}

@app.get("/api/admin/dashboard")
async def get_admin_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    # Get statistics
    total_users = await database.users.count_documents({"user_type": "user"})
    total_drivers = await database.users.count_documents({"user_type": "driver"})
    total_rides = await database.rides.count_documents({})
    
    return {
        "stats": {
            "total_users": total_users,
            "total_drivers": total_drivers,
            "total_rides": total_rides
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)