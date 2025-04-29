from pymongo import MongoClient
from datetime import datetime
import certifi



# Replace with your MongoDB URI
MONGO_URI="mongodb+srv://user-rastog18:test-1234@cluster0.m1frs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

# Replace with your DB and collection name
db = client["test"]
collection = db["users"]

users = [
    {"firstName": "Liam", "lastName": "Nguyen", "puid": "00361-54538", "dormName": "Shreve", "dob": datetime(2002, 6, 2), "collegeYear": "Junior"},
    {"firstName": "Ava", "lastName": "Patel", "puid": "00361-54539", "dormName": "Hillenbrand", "dob": datetime(2001, 9, 14), "collegeYear": "Senior"},
    {"firstName": "Noah", "lastName": "Kim", "puid": "00361-54540", "dormName": "McCutcheon", "dob": datetime(2003, 4, 10), "collegeYear": "Sophomore"},
    {"firstName": "Isabella", "lastName": "Lopez", "puid": "00361-54541", "dormName": "Wiley", "dob": datetime(2004, 12, 5), "collegeYear": "Freshman"},
    {"firstName": "Mason", "lastName": "Singh", "puid": "00361-54542", "dormName": "Earhart Hall", "dob": datetime(2002, 7, 17), "collegeYear": "Junior"},
    {"firstName": "Sophia", "lastName": "Zhang", "puid": "00361-54543", "dormName": "Windsor", "dob": datetime(2001, 10, 9), "collegeYear": "Senior"},
    {"firstName": "Ethan", "lastName": "Ali", "puid": "00361-54544", "dormName": "Shreve", "dob": datetime(2003, 3, 20), "collegeYear": "Sophomore"},
    {"firstName": "Mia", "lastName": "Gonzalez", "puid": "00361-54545", "dormName": "McCutcheon", "dob": datetime(2005, 6, 22), "collegeYear": "Freshman"},
    {"firstName": "Aiden", "lastName": "Brown", "puid": "00361-54546", "dormName": "Earhart Hall", "dob": datetime(2002, 2, 14), "collegeYear": "Junior"},
    {"firstName": "Charlotte", "lastName": "Khan", "puid": "00361-54547", "dormName": "Hillenbrand", "dob": datetime(2001, 5, 30), "collegeYear": "Senior"},
    {"firstName": "Logan", "lastName": "White", "puid": "00361-54548", "dormName": "Wiley", "dob": datetime(2004, 8, 19), "collegeYear": "Sophomore"},
    {"firstName": "Amelia", "lastName": "Singh", "puid": "00361-54549", "dormName": "Windsor", "dob": datetime(2002, 1, 2), "collegeYear": "Junior"},
    {"firstName": "James", "lastName": "Wright", "puid": "00361-54550", "dormName": "Shreve", "dob": datetime(2001, 11, 11), "collegeYear": "Senior"}
]

result = collection.insert_many(users)
print(f"Inserted {len(result.inserted_ids)} users.")
