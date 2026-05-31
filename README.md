# פורטל פרויקטים MAKOM – Fattal

מערכת להטמעת פורטל ניהול פרויקטים ב-Google Sites, מבוססת Google Apps Script וגיליון Google Sheet.

## קבצים

| קובץ | תיאור |
|------|-------|
| `portal-link-generator.html` | **כלי מחולל קישורים** — פתחו בדפדפן, הגדירו לקוחות וצרו קודי Embed לכל לקוח |
| `Code.gs` | קוד Apps Script (העלו ל-Apps Script Editor) |
| `index.html` | תבנית HTML לפורטל (העלו ל-Apps Script Editor בשם `index`) |

## התקנה מהירה

1. פתחו [Apps Script](https://script.google.com) → פרויקט חדש
2. העתיקו את תוכן `Code.gs` לקובץ `Code.gs`
3. הוסיפו קובץ HTML חדש בשם `index` — העתיקו לתוכו את `index.html`
4. הכניסו את מזהה ה-Google Sheet שלכם ב-`SPREADSHEET_ID`
5. פרסו (Deploy → New deployment → Web App → Anyone)
6. פתחו `portal-link-generator.html` בדפדפן → הדביקו את ה-URL → הוסיפו לקוח → העתיקו Embed
7. ב-Google Sites: Insert → Embed → הדביקו את קוד ה-iframe

## מבנה הגיליון

```
client_id | token | active | project_name | status | description | site_url | youtube_url | image_url | location | lat | lng | planned_end_date | actual_end_date | tags | progress | risk | next_step
```

- `progress` — מספר 0–100
- `risk` — נמוך / בינוני / גבוה
- `active` — TRUE / FALSE

## ניהול שוטף מסודר

- **מקור המידע היחיד**: כל נתוני הפרויקטים נשמרים בגיליון Google Sheet — כל שורת פרויקט מתעדכנת שם בלבד.
- **מקור הלינקים ללקוחות**: `portal-link-generator.html` שומר בדפדפן את כתובת ה-Web App, מזהי הלקוחות, הטוקנים, הלינק הישיר וה-Embed לכל לקוח.
- **פורמט הלינק ללקוח**: `WEB_APP_URL?client=CLIENT_ID&token=TOKEN`
- **עדכון תוכן שוטף**: כשמשנים סטטוס, תיאור, תאריך או מיקום — מעדכנים רק את הגיליון והפורטל מושך את המידע מחדש.
- **עדכון קוד / UI**: כשמשנים את `Code.gs` או `google-sites-apps-script-index.html` צריך לבצע Deploy מחדש ל-Web App, ואז להדביק את ה-URL המעודכן במחולל הקישורים.
- **סדר עבודה מומלץ**: Sheet לניהול מידע, generator לניהול לקוחות וקישורים, Google Sites להטמעה בלבד.

---
מופעל על ידי **MAKOM LTD**
