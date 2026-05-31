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
client_id | token | active | project_name | status | description | site_url | youtube_url | image_url | location | lat | lng | planned_end_date | actual_end_date | tags | risk | next_step
```

- `risk` — נמוך / בינוני / גבוה
- `active` — TRUE / FALSE

### אבטחת מסך מנהלי פרויקטים

- קריאה רגילה לפורטל נשארת עם `client` + `token`
- לעדכון נתונים נדרש `manager_key` נוסף (נפרד מה-token)
- הגדרת מפתח מנהל פעם אחת ב-Apps Script:

```js
setManagerKey('your-strong-manager-key')
```

- פתיחת מסך מנהל: הוסיפו ל-URL של הפורטל גם `manager_key=...`

---
מופעל על ידי **MAKOM LTD**
