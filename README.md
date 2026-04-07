# FSProject - Full Stack Project

## מה הפרויקט הזה עושה?

זהו פרויקט Full Stack של אתר מתכונים/כרטיסים, שמורכב משני חלקים:

1. Frontend

- בנוי עם React + TypeScript
- מציג מסכים למשתמש (התחברות, הרשמה, עמוד בית, פרופיל ועוד)

2. Backend

- בנוי עם Node.js + Express
- מספק API למשתמשים ולכרטיסים
- מתחבר למסד נתונים MongoDB

בקיצור:
ה-Frontend שולח בקשות, ה-Backend מטפל בהן ושומר/קורא מידע מ-MongoDB.

## טכנולוגיות עיקריות

- Frontend: React, TypeScript, React Router, Axios
- Backend: Node.js, Express, Mongoose, JWT, Joi
- Database: MongoDB (לרוב MongoDB Atlas)

## מבנה תיקיות

- Frontend/ - צד לקוח
- Backend/ - צד שרת

## לפני שמתחילים

צריך מותקן במחשב:

1. Node.js (מומלץ גרסה 18 ומעלה)
2. npm
3. חיבור ל-MongoDB

כדי לבדוק גרסאות:

node -v
npm -v

## הגדרת קבצי סביבה (חשוב מאוד)

יש ליצור קבצי .env מקומיים (לא לדחוף אותם ל-GitHub עם ערכים אמיתיים).

### Backend/.env

דוגמה:

PORT=9000
DB_HOST=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

הסבר קצר:

- PORT - הפורט שבו השרת רץ
- DB_HOST - כתובת החיבור ל-MongoDB
- JWT_SECRET - מפתח לחתימת טוקנים

### Frontend/.env

דוגמה:

REACT_APP_API_USERS=http://127.0.0.1:9000/api/users
REACT_APP_API_CARDS=http://127.0.0.1:9000/api/cards

הסבר קצר:

- אלו הכתובות שאליהן ה-Frontend שולח בקשות
- שים לב שהפורט כאן חייב להתאים לפורט של ה-Backend

## הרצה מקומית של הפרויקט

צריך לפתוח שני טרמינלים.

### טרמינל 1 - Backend

cd Backend
npm install
npm start

### טרמינל 2 - Frontend

cd Frontend
npm install
npm start

אחרי זה האתר אמור להיפתח ב:

http://localhost:3000

והשרת אמור לרוץ ב:

http://localhost:9000

## Endpoints עיקריים ב-Backend

- /api/users
- /api/cards

## תקלות נפוצות ומה לבדוק

1. ה-Frontend עולה אבל אין נתונים

- בדוק שקובץ Frontend/.env מצביע לפורט הנכון
- בדוק שה-Backend באמת רץ

2. שגיאת התחברות ל-MongoDB

- בדוק ש-DB_HOST תקין
- בדוק הרשאות/Whitelist ב-Atlas

3. שגיאת Token או הרשאות

- התחבר מחדש כדי לקבל טוקן חדש
- ודא שנשלחת כותרת Authorization עם Bearer Token

## אבטחה והגשה ל-GitHub

חשוב מאוד:

1. לא מעלים סיסמאות, Secrets, או Connection String אמיתי ל-GitHub.
2. אם בטעות נחשפו פרטים פרטיים, מחליפים אותם מיד (Rotate) בצד השירותים.
3. מעלים רק דוגמאות כמו .env.example עם ערכי דמה.

דוגמה ל-.env.example בטוח:

PORT=9000
DB_HOST=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET

REACT_APP_API_USERS=http://127.0.0.1:9000/api/users
REACT_APP_API_CARDS=http://127.0.0.1:9000/api/cards

## למי שלא בא מרקע טכני

אם זו הפעם הראשונה שלך עם Full Stack, תעבוד לפי הסדר הבא:

1. תוודא שיש Node.js
2. תיצור קבצי .env לפי הדוגמאות למעלה
3. תריץ Backend
4. תריץ Frontend
5. תפתח דפדפן על localhost:3000

אם משהו לא עובד, בדרך כלל הבעיה היא באחד משלושה דברים:

1. פורטים לא תואמים
2. קובץ .env לא נכון
3. השרת (Backend) לא עלה בהצלחה

בהצלחה.
